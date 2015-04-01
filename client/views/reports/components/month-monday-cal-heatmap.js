/*
Orig data:

Date,Open,High,Low,Close,Volume,Adj Close
2010-10-01,10789.72,10907.41,10759.14,10829.68,4298910000,10829.68
2010-09-30,10835.96,10960.99,10732.27,10788.05,4284160000,10788.05
2010-09-29,10857.98,10901.96,10759.75,10835.28,3990280000,10835.28
2010-09-28,10809.85,10905.44,10714.03,10858.14,4025840000,10858.14
2010-09-27,10860.03,10902.52,10776.44,10812.04,3587860000,10812.04
2010-09-24,10664.39,10897.83,10664.39,10860.26,4123950000,10860.26
2010-09-23,10738.48,10779.65,10610.12,10662.42,3847850000,10662.42
2010-09-22,10761.11,10829.75,10682.40,10739.31,3911070000,10739.31
2010-09-21,10753.39,10844.89,10674.83,10761.03,4175660000,10761.03
2010-09-20,10608.08,10783.51,10594.38,10753.62,3364080000,10753.62
...

*/


Template.monthMondayCalHeatmap.rendered = function() {

  var dat =[
    {date: "2015-03-31", val: 0},
    {date: "2015-03-30", val: 0},
    {date: "2015-03-29", val: 0},
    {date: "2015-03-28", val: 0},
    {date: "2015-03-27", val: 0},
    {date: "2015-03-26", val: 0},
    {date: "2015-03-25", val: 0},
    {date: "2015-03-24", val: 0},

    {date: "2015-02-31", val: 0},
    {date: "2015-02-30", val: 0},
    {date: "2015-02-29", val: 0},
    {date: "2015-02-28", val: 0},
    {date: "2015-02-27", val: 0},
    {date: "2015-02-26", val: 0},
    {date: "2015-02-25", val: 0},
    {date: "2015-02-24", val: 0}
  ];


  var margin = {top: 5.5, right: 0, bottom: 5.5, left: 19.5},
  width = 960 - margin.left - margin.right,
  height = 130 - margin.top - margin.bottom,
  size = height / 7;

  //-- formatters
  var day = function(d) { return (d.getDay() + 6) % 7; }, // monday = 0
  month = function(d) { return d.getMonth(); },
  week = d3.time.format("%W"), // monday-based week number
  date = d3.time.format("%Y-%m-%d"),
  percent = d3.format("+.1%");

  //-- scales (color)
  //FIXME: define the color range scale according to the actual data min/max !
  var color = d3.scale.quantize()
    .domain([-.05, .05])
    .range(d3.range(9));

  //-- rows for each year 
  var svg = d3.select(".calHeatMap").selectAll("svg")
    .data(d3.range(2013, 2015))
    .enter()
      .append("svg")
      .attr("class", "RdYlGn")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //-- row year label
  svg.append("text")
    .attr("transform", "translate(-6," + size * 3.5 + ")rotate(-90)")
    .attr("text-anchor", "middle")
    .text(function(d) { return d; });

  //-- foreach year in data(what data?) create all the days & their rectanglen than place them correctly 
  //--> the data that is already bound to the svg element (2014, 2015)
  //-- [and format the key - not working]
  // [ [rect: {__data__: Date(), ...}, rect: {}, ... ], [], ... ]
  // 
  var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter()
      .append("rect")
      .attr("class", "day")
      .attr("width", size)
      .attr("height", size)
      .attr("x", function(d) { return week(d) * size; })
      .attr("y", function(d) { return day(d) * size; })
      //.map(date)
      ;

  //-- tooltip of day box
  rect.append("title")
    .text(function(d) { return d; });

  //-- month contour path
  svg.selectAll(".month")
    .data(function(d) { console.log(".month");return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter()
      .append("path")
      .attr("class", "month")
      .attr("d", monthPath);

  // d3.csv("dji.csv", function(csv) {
  //   var data = d3.nest()
  //   .key(function(d) { return d.Date; })
  //   .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
  //   .map(csv);

  //   console.log("CSV: ");
  //   console.dir(csv);
  //   console.log("data: ");
  //   console.dir(data);

  //   rect.filter(function(d) { return d in data; })
  //   .attr("class", function(d) { return "day q" + color(data[d]) + "-9"; })
  //   .select("title")
  //   .text(function(d) { return d + ": " + percent(data[d]); });
  // });

  function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
    d0 = +day(t0), w0 = +week(t0),
    d1 = +day(t1), w1 = +week(t1);
    return "M" + (w0 + 1) * size + "," + d0 * size
    + "H" + w0 * size + "V" + 7 * size
    + "H" + w1 * size + "V" + (d1 + 1) * size
    + "H" + (w1 + 1) * size + "V" + 0
    + "H" + (w0 + 1) * size + "Z";
  }
};


Template.monthMondayCalHeatmap.helpers({
});


Template.monthMondayCalHeatmap.events({
});