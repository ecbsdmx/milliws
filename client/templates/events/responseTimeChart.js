Template.responseTimeChart.rendered = function() {
  var warningTheshold = 0.8;

  //respTimeChart
  var w = 350;
  var h = 30;
  var margin = {top: 3, right: 5, bottom:12, left: 25};

 // var chart = d3.bullet()
 //  .width(w - margin.left - margin.right)
 //  .height(h - margin.top - margin.bottom);
  
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
    .attr("width", "100%")
    .attr("height", h + margin.top + margin.bottom)
  ;
  
  var containerCellAvailableWidth = svg.style("width");
  containerCellAvailableWidth = parseInt(containerCellAvailableWidth.substr(0, containerCellAvailableWidth.length - 2));

  var actualChartWidth = containerCellAvailableWidth - margin.left - margin.right;
  var actualChartHeight = h - margin.top - margin.bottom;
  
  var chart = d3.bullet()
    .width(actualChartWidth)
    .height(actualChartHeight);

  svg.selectAll("svg")
    .attr("width", actualChartWidth + margin.left + margin.right)
    .attr("height", actualChartHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(chart);

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
