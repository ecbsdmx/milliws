var dat = {};

Template.responseTimeChartCSS.created = function() {
  var warningTheshold = 0.8;

  var jobStat = EventsStatPerJob.findOne({_id: this.data.jobId});
  
  var rangeSuccess = this.data.ert * warningTheshold;
  var rangeWarning = this.data.ert;
  var rangeError = this.data.ert * 1.5;//this.data.ert * 1.3; //max for this job id (from eventsStats collection)
  var rgPct1 = rangeSuccess/rangeError*100;
  var rgPct2 = rangeWarning/rangeError*100 - rgPct1;
  var rgPct3 = 100 - rgPct1 - rgPct2;

  //-- tick generation
  var numTicks = 5;
  var ticks = [];
  var step = rangeError / numTicks;
  for (var i=0;i<=numTicks;i++) {
    ticks[i] = {
      tickValue:    i*step,
      tickPercent:  (100/numTicks)*i + "%"
    };
  }

  //-- measure style
  var measureStyle = "";
  if (this.data.responseTime >= rangeError) {
    measureStyle = "outlier";
  }
  else if (this.data.responseTime > (rangeError) ) {
   measureStyle = ""; 
  }
  else if (this.data.responseTime > this.data.ert) {
    measureStyle = "error";    
  }
  else if (this.data.responseTime > (this.data.ert*warningTheshold)) {
    measureStyle = "warning";
  }

  dat = {
    responseTime:   "" + this.data.responseTime,
    ert:            "Ert: " + this.data.ert,
    ranges:         [
                      {index: 1, val: rangeSuccess, percent: rgPct1 + "%"}, 
                      {index: 2, val: rangeWarning, percent: rgPct2 + "%"}, 
                      {index: 3, val: rangeError, percent: rgPct3 + "%"}
                    ], // 0, ert, ert+20%
    measure:        Math.min(rangeError, this.data.responseTime),
    measureState:   measureStyle, 
    marker:         Math.ceil(jobStat.avg),
    ticks:          ticks
  };
};


Template.responseTimeChartCSS.helpers({
  graphData: function() {
    var ret = _.extend(dat,  {
      measurePercent : (dat.measure / dat.ranges[2].val * 100) + "%",
      rangesPercent: [(dat.ranges[0].val / dat.ranges[2].val * 100)+"%", (dat.ranges[1].val / dat.ranges[2].val * 100)+"%", "100%"],
      markerPercent: (dat.marker / dat.ranges[2].val * 100)+"%"
    })
    return ret;
  }
});