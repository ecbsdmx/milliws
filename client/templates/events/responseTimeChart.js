Template.responseTimeChart.rendered = function() {
  //respTimeChart
  var w = 350;
  var h = 30;
  var margin = {top: 5, right: 0, bottom: 12, left: 5};

  var chart = d3.bullet()
  .width(w - margin.left - margin.right)
  .height(h - margin.top - margin.bottom);
  
  var jobStat = EventsStatPerJob.findOne({_id: this.data.jobId});
  var rangeSuccess = this.data.ert * 0.8;
  var rangeWarning = this.data.ert;
  var rangeError = jobStat.max;//this.data.ert * 1.3; //max for this job id (from eventsStats collection)

  var dat = [{
    title:      "RT",
    subtitle:   "(ms)",
    ranges:     [rangeSuccess, rangeWarning, rangeError], // 0, ert - 20%, ert
    measures:   [this.data.responseTime],
    markers:    [jobStat.avg]
  }];
  

  var svg = d3.select("#respTimeChart_" + this.data._id);
  svg
  .data(dat)
  .append("svg")
  .attr("class", "bullet")
  .attr("width", w)
  .attr("height", h)
  .append("g")
  .attr("transform", "translate("+margin.left+","+margin.top+")")
  .call(chart)
  ;
  
  //FIXME not working: (measure should be red when 'isProblematic: true')
  /*
  if (this.data.ert < this.data.responseTime ) {
    svg.selectAll("svg").selectAll(".measure .s0").style("fill", "#f55");
  }
  */
};
