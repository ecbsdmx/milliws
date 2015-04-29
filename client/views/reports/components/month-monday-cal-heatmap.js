
Template.monthMondayCalHeatmap.onCreated(function() {
  var instance = this;
  instance.firstGo = true;
  
  instance.aggData   = new ReactiveVar();

  Tracker.autorun(function() {
    var selectedJobs = Session.get("SelectedEventsStats") || [];
    var indicatorType = Session.get("SelectedBreakdown") || "rtBreakdown"; 

    Meteor.call("compileDailyAgg", indicatorType, selectedJobs, new Date(), function(error, result) {
      if (error) {
        console.log("compileDailyAgg error: " + error);
      }
      else {
        instance.aggData.set(result);
      }
    });
  });
});


Template.monthMondayCalHeatmap.onRendered(function() {
  var instance = this;
  if (instance.firstGo){
    calendarHeatMap(".calHeatMap", "No data", null, 1000);
    instance.firstGo = false;
  }

  Tracker.autorun(function() {
    var dat = instance.aggData.get();
    if (typeof dat != 'undefined') {
      updateData(dat, 1000);
    }
  })
});


Template.monthMondayCalHeatmap.helpers({
});
Template.monthMondayCalHeatmap.events({
});


//FIXME pass in options to function: colorscale size, width, height, show-options, ...
var calendarHeatMap = function(destinationElem, calendarTitle, daysAggregate, ert) {
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
  var colorScaleSize  = 6;
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
  var maxDate             = new Date();
  var minDate             = new Date(maxDate.getFullYear()-1, maxDate.getMonth(), 1);
  var minFirstDayOfMonth  = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  var minWeek             = parseInt(week(minFirstDayOfMonth));
  var minYear             = parseInt(year(minDate));
  var maxYear             = parseInt(year(maxDate));
  var numYears            = maxYear - minYear + 1;

  var color       = d3.scale.quantize()//FIXME duplicate color scale def
    .domain([0, ert])
    .range(d3.range(colorScaleSize));

  //XXX not mindate directly, otherwise start date not includesm in date range...
  var dateRangeDays           = d3.time.days(new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()), maxDate);
  var dateRangeMonths         = d3.time.months(new Date(minDate.getFullYear(), minDate.getMonth(), 1), maxDate);

  /* DEBUG */
  // console.dir(input);
  // console.dir(aggByDates);
  // console.log("Min      :" + date(minDate));
  // console.log("Max      :" + date(maxDate));
  //console.log("Num years: " + numYears);
  //console.log("Nesting per date for current input:");
  //console.dir(dateRangeDays);
  /* DEBUG */

  var svg = d3.select(destinationElem)
    .append("svg")
      .attr("class", "jobCalHeatMap greenOrangeRedGrad")
      .attr("shape-rendering", "crisp-edges")
      .attr("stroke-linecap","round")
      .attr("stroke-linejoin","round")
      .attr("width", finalWidth)
      .attr("height", finalHeight)
      .attr("title", calendarTitle)
    .append("g")
      .attr("class", "calHeatmapGroup")
      .attr("transform", "translate("+margin.left+", " + margin.top + ")")
  ;

  //-- title label
  var calJobLabel =
  svg
    .append("text")
    .attr("class", "jobName")
    .attr("transform", "translate(-" + (margin.left/9*7) + "," + (height/2) + ")rotate(-90)")
    .attr("text-anchor", "middle")
    .text(calendarTitle)
  ;
  //-- year label
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

//  updateData(daysAggregate, ert);

  //===================
  //-- Functions
  //===================

  function monthPath(t0) {
    var yearDecal = year(t0) - year(minDate);
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
    var w0 = +(week(t0)-minWeek + 52*yearDecal);
    var w1 = +(week(t1)-minWeek + 52*yearDecal);
    var d0 = +day(t0),
        d1 = +day(t1);
    return "M" + (w0 + 1) * size + "," + d0 * size
    + "H" + w0 * size + "V" + 7 * size
    + "H" + w1 * size + "V" + (d1 + 1) * size
    + "H" + (w1 + 1) * size + "V" + 0
    + "H" + (w0 + 1) * size + "Z";
  }  
}



function updateData(dataInput, ert) {
  var date    = d3.time.format("%Y-%m-%d");
  var svg = d3.select("svg g.calHeatmapGroup");

  var color       = d3.scale.quantize() //FIXME duplicate color scale def
  .domain([0, ert])
  .range(d3.range(6));//FIXME colorscale range

  var tip = d3.tip().attr("class", "d3-tip").html(function(d) {
    var obj = aggByDates[date(d)];
    return typeof obj === 'undefined'?date(d): '<i class="fa fa-calendar fa-fw"></i>' + date(d) + "<br />" + 
     '<i class="fa fa-heartbeat fa-fw"></i><span class="c'+color(obj)+'">' + obj.toFixed(2) + " sec. </span>";
  });
  svg.call(tip);


  var aggByDates = dataInput;

  svg.selectAll("g.jobDays .day")
    .filter(function(d) {
      return date(d) in aggByDates;
    })
    .attr("class", function(d) {
      var obj = aggByDates[date(d)];
      return "day c" + color(obj)  ;
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    // .select("title")
    // .remove();
  ;
}

function clearData(){
  var svg = d3.select("svg g.calHeatmapGroup");
  svg.selectAll("g.jobDays .day")
  .attr("class", "day")
}







