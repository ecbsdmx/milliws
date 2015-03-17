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
    var warningTheshold = 0.8;

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

    var measure = Math.min(rangeError, this.responseTime);
    var ranges =[ 
      {index: 1, val: rangeSuccess, percent: rgPct1 + "%"}, 
      {index: 2, val: rangeWarning, percent: rgPct2 + "%"}, 
      {index: 3, val: rangeError, percent: rgPct3 + "%"}
    ];
    var marker = Math.min(rangeError,Math.ceil(this.avg));

    return {
      ranges:         ranges,
      marker:         marker,
      ticks:          ticks,
      measure:        measure,
      measureState:   measureStyle,
      measurePercent: (measure / ranges[2].val * 100) + "%",
      rangesPercent:  [(ranges[0].val / ranges[2].val * 100)+"%", (ranges[1].val / ranges[2].val * 100)+"%", "100%"],
      markerPercent:  (marker / ranges[2].val * 100)+"%"
    };
  }
});