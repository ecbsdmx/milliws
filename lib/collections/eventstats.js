EventStats = new Mongo.Collection('eventStats');

Meteor.methods({
  updateEventStats: function () {
    Events.mapReduce(map, reduce, { query: {}, out: {replace: "eventStats"}, finalize: finalize, scope: {quartileValue: quartileValue} });
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

  value.quartile1 = quartileValue(25, value.allRt);
  value.quartile2 = quartileValue(50, value.allRt);
  value.quartile3 = quartileValue(75, value.allRt);

  delete value.allRt;

  return value;
}

var quartileValue = function(quartile, values) {
  var idx = quartile * values.length / 100;
  if (0 === idx % 1) {
    return (values[idx] + values[idx - 1]) / 2;
  } else {
    return values[Math.floor(idx)];
  }
}
