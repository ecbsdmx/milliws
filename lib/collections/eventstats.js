EventStats = new Mongo.Collection('eventStats');
var executeAggregationEveryHours = 2;
var aggAtLeastForNValues = 20;

Meteor.methods({

  updateEventStatsOpt: function(jobVector) {
    var now = new Date();
    Meteor.call("messageLogDebug", "updateEventStatsOpt", "eventstats");
    // update individual values
    jobVector.forEach(function(element, index, array) {
      var isProblematic = !((element.statusCode === 200 || element.statusCode === 304 || (element.statusCode === 404 && element.j.deltas)) && element.rt <= element.j.ert)
      var countJobStat = EventStats.find({_id: element.j._id}).count();
      // check for non-existant job event stat document !!!
      if (countJobStat < 1) {
        Meteor.call("messageLogDebug", "Job: " + element.j._id + " hos currently no stats...", "eventstats");
        var jobStat = {
          count: 1,
          lastProb: isProblematic,
          countProb: isProblematic?1:0,
          first: now, last: now,
          min: element.rt, max: element.rt, avg: element.rt,
          quartile1: element.rt, quartile2: element.rt, quartile3: element.rt, whiskerStop: element.rt
        };
        EventStats.insert({_id: element.j._id, value: jobStat});
        return;
      }

      var curStat = EventStats.findOne({_id: element.j._id});

      var aggLastRun = curStat.lastTrigger;
      var pAvg = curStat.value.avg;
      if (isProblematic) {
        curStat.value.countProb += 1;
        curStat.value.lastProb = true;
      }
      else {
        curStat.value.lastProb = false;
      }
      curStat.value.last = element.j.lastRun;
      curStat.value.min = Math.min(curStat.value.min, element.rt);
      curStat.value.max = Math.max(curStat.value.max, element.rt);
      curStat.value.avg = addToAvg(curStat.value.count, pAvg, [element.rt]);
      curStat.value.count += 1;

      // check if we need to trigger the aggregation again
      if ((typeof aggLastRun === 'undefined') || curStat.value.count < aggAtLeastForNValues || ((now - aggLastRun) > (1000*60*60*executeAggregationEveryHours)) ) {
        Meteor.call("messageLogDebug", "Aggregation for: " + element.j._id + " is being triggered...", "eventstats");
        var triggerTS = new Date();
        var elemsToAgg = Events.find({jobId: element.j._id}, {fields: {responseTime: 1}}).fetch();
        if (0 < elemsToAgg.length) {
          var elems = _.pluck(elemsToAgg, "responseTime");
          elems.sort(function(a,b) {
            return a - b;
          });
          curStat.value.quartile1 = quartileValue(elems, 25);
          curStat.value.quartile2 = quartileValue(elems, 50);
          curStat.value.quartile3 = quartileValue(elems, 75);
          curStat.value.whiskerStop = quartileValue(elems, 91);
        }//exist elemsToAgg
        EventStats.update({_id: element.j._id}, {$set: {lastTrigger: triggerTS}});
      }//last agg too old
      EventStats.update({_id: element.j._id}, {$set: {value: curStat.value}});
    });
    Meteor.call("messageLogDebug", "updateEventStatsOpt done", "eventstats");
  }
});

// calculates the average of an array
var mathAverage = function(arr) {
  var sum = 0;
  for( var i = 0; i < arr.length; i++ ) {
    sum += arr[i];
  }
  return sum/arr.length;
};

// add to average method. NB: prepared to add more than one item to the average
var addToAvg = function(pN, pAvg, nVect) {
  var n = nVect.length;
  if (n === 1) {
    return Math.round(pAvg + ((nVect[0] - pAvg)/(pN+1)));
  }
  else
  {
    var nAvg = mathAverage(nVect);
    return Math.round((pAvg*pN+nAvg)/n);
  }
};

var quartileValue = function(values, quartile) {
  var idx = quartile * values.length / 100;
  if (Math.floor(idx) == idx) {
    return (values[idx - 1] + values[idx]) / 2;
  } else {
    return values[Math.floor(idx)];
  }
};

/**
 * Percentile calculated by linear interpolation between closest ranks
 *
 * @param  {[type]} sortedArr Array sorted in ascending order
 * @param  {[type]} rank      a percentile rank : 0-100
 * @return {[type]}           the percentile calculated by linear interpolation between closest ranks
 */
function percentile_linInterp(sortedArr, rank) {
  var arrLen = sortedArr.length;
  var ranks = [];
  for (var i=1;i<arrLen+1;i++) {
    ranks[i-1] = (100.0/arrLen)*(i-0.5);
  }

  // optimization
  if (rank < ranks[0]) return sortedArr[0];
  if (rank > ranks[ranks.length-1]) return sortedArr[sortedArr.length-1];

  for (var i=0;i<arrLen-1;i++) {
    var curRank = ranks[i];
    var nextRank = ranks[i+1];
    if (curRank == rank) return sortedArr[i];
    else if ( (curRank < rank) && (rank < nextRank) ) {
      return sortedArr[i] + arrLen*(rank-curRank)*(sortedArr[i+1]-sortedArr[i])/100.0;
    }
  }
}
