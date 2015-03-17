// DEBUG & profiling
Template.responseTimeChartCSS.destroyed = function() {
  //console.log(":: DEBUG :: - Template [responseTimeChartCSS] destroyed.");
};
Template.responseTimeChartCSS.rendered = function() {
  //console.log(":: DEBUG :: - Template [responseTimeChartCSS] rendered.");
};
Template.responseTimeChartCSS.created = function() {
  //console.log(":: DEBUG :: - Template [responseTimeChartCSS] created.");
};


Template.responseTimeChartCSS.helpers({
  graphData: function() {
    var dat = {};
    var warningTheshold = 0.8;

    var jobStat = EventsStatPerJob.findOne({_id: this.jobId});
    
    var rangeSuccess = this.ert * warningTheshold;
    var rangeWarning = this.ert;
    var rangeError = this.ert * 1.5;//this.ert * 1.3; //max for this job id (from eventsStats collection)
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
    if (this.responseTime >= rangeError) {
      measureStyle = "outlier";
    }
    else if (this.responseTime > (rangeError) ) {
     measureStyle = ""; 
    }
    else if (this.responseTime > this.ert) {
      measureStyle = "error";    
    }
    else if (this.responseTime > (this.ert*warningTheshold)) {
      measureStyle = "warning";
    }

    dat = {
      ranges:         [
                        {index: 1, val: rangeSuccess, percent: rgPct1 + "%"}, 
                        {index: 2, val: rangeWarning, percent: rgPct2 + "%"}, 
                        {index: 3, val: rangeError, percent: rgPct3 + "%"}
                      ],
      marker:         Math.min(rangeError,Math.ceil(jobStat.avg)),
      ticks:          ticks,
      measure:        Math.min(rangeError, this.responseTime),
      measureState:   measureStyle
    };


    return _.extend(dat,  {
      measurePercent : (dat.measure / dat.ranges[2].val * 100) + "%",
      rangesPercent: [(dat.ranges[0].val / dat.ranges[2].val * 100)+"%", (dat.ranges[1].val / dat.ranges[2].val * 100)+"%", "100%"],
      markerPercent: (dat.marker / dat.ranges[2].val * 100)+"%"
    })
  }
});