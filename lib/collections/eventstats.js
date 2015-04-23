EventStats = new Mongo.Collection('eventStats');

Meteor.methods({
  updateEventStats: function () {
    Events.mapReduce(map, reduce, { query: {}, out: {replace: "eventStats"}, finalize: finalize });
    console.log("Doing some map reduce operation");
  }
});

var map = function() {
  var key = this.jobId;

  var value = {
    count: 1,
    countProb: this.isProblematic ? 1 : 0,
    rt: this.responseTime,
    min: this.responseTime,
    max: this.responseTime,
    first: this.etime,
    last: this.etime,
    lastProb: this.isProblematic,
    allRt : [this.responseTime]
  };

  emit(key, value);
}

var reduce = function(jobId, values) {
  var a = values[0];

  for (var i = 1; i < values.length; i++) {
    var b = values[i];
    a.count += b.count;
    a.countProb += b.countProb;
    a.rt += b.rt;
    a.min = Math.min(a.min, b.min);
    a.max = Math.max(a.max, b.max);
    a.first = a.first < b.first ? a.first : b.first;
    a.last = a.last > b.last ? a.last : b.last;
    a.lastProb = a.last > b.last ? a.lastProb : b.lastProb;
    a.allRt = a.allRt.concat(b.allRt);
  }

  return a;
}

var finalize = function(key, value){
  value.avg = Math.round(value.rt / value.count);

  value.allRt.sort(function(a,b) {
    return a - b;
  });

  value.quartile1 = value.allRt[Math.floor(25 * value.count / 100)];
  value.quartile2 = value.allRt[Math.floor(50 * value.count / 100)];
  value.quartile3 = value.allRt[Math.floor(75 * value.count / 100)];

  delete value.allRt;

  return value;
}
