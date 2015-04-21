
Template.monthMondayCalHeatmap.onCreated(function() {
});

Template.monthMondayCalHeatmap.rendered = function() {
var input = {
    _id: "dexr-gen",
    max: 30332,
    avg: 286.6837606837607,
    count: 1558,
    min: 8,
    ert: 1000,
    last: new Date("2015-04-14"),
    first: new Date("2015-03-19"),
    lastProb: false,
    dayAgg: [
      { date: '2015-04-14',
       count: 468,
       minRT: 8,
       maxRT: 30332,
       avgRT: 286.6837606837607 },
      { date: '2015-02-13',
       count: 433,
       minRT: 17,
       maxRT: 10480,
       avgRT: 407.1986143187067 },
      { date: '2015-04-02',
       count: 69,
       minRT: 52,
       maxRT: 7862,
       avgRT: 314.0289855072464 },
      { date: '2015-03-26',
       count: 115,
       minRT: 57,
       maxRT: 6134,
       avgRT: 395.38260869565215 },
      { date: '2015-03-25',
       count: 9,
       minRT: 82,
       maxRT: 1031,
       avgRT: 319.55555555555554 },
      { date: '2015-03-20',
       count: 258,
       minRT: 46,
       maxRT: 4498,
       avgRT: 209.60852713178295 },
      { date: '2015-03-19',
       count: 206,
       minRT: 46,
       maxRT: 3710,
       avgRT: 168.89320388349515 }
    ]
  };

//-- formats
var day     = function(d) { return (d.getDay() + 6) % 7;};
var week    = d3.time.format("%W");
var month   = d3.time.format("%b");
var year    = d3.time.format("%Y");
var year2   = d3.time.format("%y");
var date    = d3.time.format("%Y-%m-%d");
var theDay  = d3.time.format("%A");

//-- options
var showMonthGroups   = true;
var showMonthContour  = true;
var showAllWeekDays   = false;

//-- constants
var colorScaleSize  = 10;
var finalWidth      = 1147;//960,
    finalHeight     = 147;//147;//orig: 105
var margin          = {top:15.5, right:5.5, bottom:5.5, left:40.5};
//-- calculated variables
var width       = finalWidth - margin.left - margin.right;
var height      = finalHeight - margin.top - margin.bottom;
var size        = height/7;

//-- data manipulation
// Get the maximum data date and go back one day,
// to the beginning of that month.
var maxDate             = new Date(d3.max(input.dayAgg, function(d) {return d.date;}));
var minDate             = new Date(maxDate.getFullYear()-1, maxDate.getMonth(), 1); //TODO chk +1day ?
var minFirstDayOfMonth  = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
var minWeek             = parseInt(week(minFirstDayOfMonth));
var minYear             = parseInt(year(minDate));
var maxYear             = parseInt(year(maxDate));
//var minDate     = new Date(d3.min(input.dayAgg, function(d) {return d.date;}));
var numYears    = maxYear - minYear + 1;

var color       = d3.scale.quantize()
  .domain([0,input.ert])
  .range(d3.range(colorScaleSize));

var aggByDates  = d3.nest()
  .key(function(d) {
    return d.date;
  })
  .sortKeys(d3.ascending)
  .rollup(function(e){return {count: e[0].count, minRT: e[0].minRT, maxRT: e[0].maxRT, avgRT: e[0].avgRT};})
  .map(input.dayAgg);

//FIXME find a way to have directly in dateRangeDays the formatted date(x) date !
  //XXX not mindate directly, otherwise start date not includesm in date range...
var dateRangeDays           = d3.time.days(new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()), maxDate);
var dateRangeMonths         = d3.time.months(new Date(minDate.getFullYear(), minDate.getMonth(), 1), maxDate);

/* DEBUG */
console.dir(input);
console.dir(aggByDates);
console.log("Min      :" + date(minDate));
console.log("Max      :" + date(maxDate));
//console.log("Num years: " + numYears);
//console.log("Nesting per date for current input:");
//console.dir(dateRangeDays);
/* DEBUG */


var svg = d3.select(".calHeatMap").selectAll("svg")
  .data([input])
  .enter()
    .append("svg")
      .attr("class", "jobCalHeatMap greenOrangeRedGrad")
      .attr("shape-rendering", "crisp-edges")
      .attr("stroke-linecap","round")
      .attr("stroke-linejoin","round")
      .attr("width", finalWidth)
      .attr("height", finalHeight)
      .attr("title", function(d) {return d._id;})
    .append("g")
      .attr("class", "")
      .attr("transform", "translate("+margin.left+", " + margin.top + ")")
;
//-- job name label
var calJobLabel =
svg
  .append("text")
  .attr("class", "jobName")
  .attr("transform", "translate(-" + (margin.left/9*7) + "," + (height/2) + ")rotate(-90)")
  .attr("text-anchor", "middle")
  .text(function(d) { return d._id; })
;
//-- job year label
var calYearLabel =
svg
  .append("text")
  .attr("class", "yearLabel")
  .attr("transform", "translate(-" + (margin.left/9*4) + "," + (height/2) + ")rotate(-90)")
  .attr("text-anchor", "middle")
  .text(function(d) { return year(minDate) + "-" + year(maxDate); })
;

//-- week days label
var weekDays = ["M", "T", "W", "T", "F", "S", "S"];
var calWeekDayLabels =
svg
  .append("g")
  .attr("class", "jobWeekDays")
  .selectAll("text")
  .data(function(d) {return weekDays;})
  .enter()
    .append("text")
    .attr("x", -margin.left/9*2)
    .attr("y", function(d, i) { return i*size+margin.top;})
    .attr("class", "dayName")
    .attr("text-anchor", "middle")
    .text(function(d, i) {return showAllWeekDays?d:(i%2 === 0?d:"");})
;
//weeks for each years

var calDays =
svg
  .append("g")
  .attr("class", "jobDays")
  .selectAll("rect")
    .data(dateRangeDays)
    .enter()
      .append("rect")
      .attr("class", "day")
      .attr("theDate", function(d) { return date(d);})
      .attr("width", size)
      .attr("height", size)
      .attr("x", function(d) {
        var yearDecal = year(d) - year(minDate);
        return (week(d)-minWeek + 52*yearDecal)  * size;
      })
      .attr("y", function(d) {return day(d) * size;})
      .append("title")
        .text(function(d) {return date(d) + " : " + theDay(d);})
;

if (showMonthGroups) {
  //months for each years
  var calMonthLabels =
    svg
    .append("g").attr("class", "jobMonths")
    .selectAll(".month")
    .data(dateRangeMonths)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
      var yearDecal = year(d) - year(minDate);
      return  (week(d)-minWeek + 52*yearDecal)  * size;
    })
    .attr("y", -5)
    .attr("class", "monthName")
    .text(function(d) {
      var m = month(d);
      return m === 'Jan'?month(d) + "'" + year2(d):m;
    })
    ;

  if (showMonthContour) {
    //-- months contour path
    var calMonthContours =
    svg.select(".jobMonths")
    .selectAll(".monthPath")
    .data(dateRangeMonths)
    .enter()
    .append("path")
    .attr("class", "monthPath")
    .attr("d", monthPath)
    ;
  }
}


updateData();

console.log("input.ert: " + input.ert);

//===================
//-- Functions
//===================
function updateData() {
  svg.selectAll("g.jobDays .day")
    .filter(function(d) {
      return date(d) in aggByDates;
    })
  .attr("class", function(d) {
    var obj = aggByDates[date(d)];
    //console.log("color: " + color(obj.avgRT));
    return "day c" + color(obj.avgRT)  ;
  })
  ;
}


function monthPath(t0) {
  var yearDecal = year(t0) - year(minDate);
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
  var w0 = +(week(t0)-minWeek + 52*yearDecal);
  var w1 = +(week(t1)-minWeek + 52*yearDecal);
  var
      d0 = +day(t0),
      d1 = +day(t1);
  return "M" + (w0 + 1) * size + "," + d0 * size
  + "H" + w0 * size + "V" + 7 * size
  + "H" + w1 * size + "V" + (d1 + 1) * size
  + "H" + (w1 + 1) * size + "V" + 0
  + "H" + (w0 + 1) * size + "Z";
}
}


Template.monthMondayCalHeatmap.helpers({
});


Template.monthMondayCalHeatmap.events({
});