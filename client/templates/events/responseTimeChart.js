Template.responseTimeChart.rendered = function() {
  var warningTheshold = 0.8;

  //respTimeChart
  var w = 350;
  var h = 30;
  var margin = {top: 2, right: 10, bottom:12, left: 5};

  var chart = d3.bullet()
  .width(w - margin.left - margin.right)
  .height(h - margin.top - margin.bottom);
  
  var jobStat = EventsStatPerJob.findOne({_id: this.data.jobId});
  var rangeSuccess = this.data.ert * warningTheshold;
  var rangeWarning = this.data.ert;
  var rangeError = this.data.ert * 1.5;//this.data.ert * 1.3; //max for this job id (from eventsStats collection)

  var dat = [{
    title:      "RT",
    subtitle:   "(ms)",
    ranges:     [rangeSuccess, rangeWarning, rangeError], // 0, ert, ert+20%
    measures:   [Math.min(this.data.ert * 1.5, this.data.responseTime)],
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

  var measure = svg.select(".measure.s0");
  if ((this.data.ert * 1.5) < this.data.responseTime ) {
   measure.style("fill", "#000"); 
  }
  else if (this.data.ert < this.data.responseTime ) {
    measure.style("fill", "#8A2126");
  }
  else if ((this.data.ert*warningTheshold) < this.data.responseTime ) {
    measure.style("fill", "#feb645");
  }

};
