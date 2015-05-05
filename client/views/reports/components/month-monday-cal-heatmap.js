var calOptions = {
  destCssSelector: ".calHeatMap",
  width: 1147,
  height: 147,
  margins: {top:15.5, right:5.5, bottom:5.5, left:40.5},
  title: "",
  colorScale: d3.scale.quantize().domain([0, 900]).range(d3.range(6)),
  colorScaleSize: 6,
  showMonthGroups: true,
  showMonthContour: true,
  showAllWeekDays: false,
  showLegend: true
};

Template.monthMondayCalHeatmap.onCreated(function() {
  var instance = this;
  instance.firstGo = true;
  calOptions.colorScaleSize = instance.data.colorScaleSize;
});


Template.monthMondayCalHeatmap.onRendered(function() {
  var instance = this;
  if (instance.firstGo){
    calendarHeatMap(calOptions);
    instance.firstGo = false;
  }

  // create reactive (on session vars) subscription
  this.autorun(function(tComp) {
    var selectedJobs = Session.get("SelectedEventsStats") || [];
    var indicatorType = Session.get("SelectedBreakdown") || "rtBreakdown";

    var tzOffset = new Date().getTimezoneOffset(); // We want the aggregation for the user timezone, so we need the client offset with UTC
    clearData();
    Meteor.call("compileDailyAgg", indicatorType, selectedJobs, new Date(), tzOffset, function(error, result) {
      if (error) {
        console.log("compileDailyAgg error: " + error);
      }
      else {
        var dat = {data: result, indicatorType: indicatorType};

        var acceptableThreshold = 0;
        switch (indicatorType)
        {
          case "rtBreakdown":
            var jobs = Jobs.find({_id: {$in: selectedJobs}});
            jobs.forEach(function (job) {
              acceptableThreshold += job.ert;
            });
            acceptableThreshold /= jobs.count();
          break;
          case "errorBreakdown":
            acceptableThreshold = 5;
          break;
        }

        calOptions.colorScale = d3.scale.quantize()
          .domain([0, acceptableThreshold*1.5])
          .range(d3.range(calOptions.colorScaleSize));

        updateData(dat.data, dat.indicatorType, calOptions.colorScale);
      }
    });
  });
});

var calendarHeatMap = function(options) {
  //-- formats
  var day     = function(d) { return (d.getDay() + 6) % 7;};
  var week    = d3.time.format("%W");
  var month   = d3.time.format("%b");
  var year    = d3.time.format("%Y");
  var year2   = d3.time.format("%y");
  var date    = d3.time.format("%Y-%m-%d");
  var theDay  = d3.time.format("%A");

  //-- calculated variables
  var width       = options.width - options.margins.left - options.margins.right;
  var height      = options.height - options.margins.top - options.margins.bottom;
  var size        = height/7;

  //-- data manipulation
  var maxDate             = new Date(); //FIXME when implementing pager
  var minDate             = new Date(maxDate.getFullYear()-1, maxDate.getMonth(), 1);
  var minFirstDayOfMonth  = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  var minWeek             = parseInt(week(minFirstDayOfMonth));
  var minYear             = parseInt(year(minDate));
  var maxYear             = parseInt(year(maxDate));
  var numYears            = maxYear - minYear + 1;

  var dateRangeDays           = d3.time.days(new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()), maxDate);
  var dateRangeMonths         = d3.time.months(new Date(minDate.getFullYear(), minDate.getMonth(), 1), maxDate);

  var svg = d3.select(options.destCssSelector)
    .append("svg")
      .attr("class", "jobCalHeatMap greenOrangeRedGrad")
      .attr("shape-rendering", "crisp-edges")
      .attr("stroke-linecap","round")
      .attr("stroke-linejoin","round")
      .attr("width", options.width)
      .attr("height", options.height)
      .attr("title", options.title)
    .append("g")
      .attr("class", "calHeatmapGroup")
      .attr("transform", "translate("+options.margins.left+", " + options.margins.top + ")")
  ;


//LEGEND START
  var lgdSvg = d3.select(options.destCssSelector)
    .append("svg")
      .attr("class", "jobCalHeatMapLegend greenOrangeRedGrad")
      .attr("shape-rendering", "crisp-edges")
      .attr("stroke-linecap","round")
      .attr("stroke-linejoin","round")
      .attr("width", options.width)
      .attr("height", size)
    .append("g")
      .attr("class", "calHeatmapLegendGroup")
      //.attr("transform", "translate("+(options.width - options.margins.right - (size*calOptions.colorScaleSize)) +", " + (options.height - options.margins.bottom - size) + ")")
  ;

  lgdSvg.selectAll("rect")
    .data(d3.range(options.colorScaleSize))
    .enter()
      .append("rect")
      .attr("class", function(d, i) {return "day lgd c" + i; })
      .attr("width", size)
      .attr("height", size)
      .attr("x", function(d, i) { return i * size; })
      .attr("y", 0)
      .attr("transform", "translate(" + ( options.margins.left) +", 0)")
  ;
// LEGEND END


  //-- title label
  var calJobLabel =
  svg
    .append("text")
    .attr("class", "jobName")
    .attr("transform", "translate(-" + (options.margins.left/9*7) + "," + (height/2) + ")rotate(-90)")
    .attr("text-anchor", "middle")
    .text(options.title)
  ;
  //-- year label
  var calYearLabel =
  svg
    .append("text")
    .attr("class", "yearLabel")
    .attr("transform", "translate(-" + (options.margins.left/9*4) + "," + (height/2) + ")rotate(-90)")
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
      .attr("x", -options.margins.left/9*2)
      .attr("y", function(d, i) { return i*size+options.margins.top;})
      .attr("class", "dayName")
      .attr("text-anchor", "middle")
      .text(function(d, i) {return options.showAllWeekDays?d:(i%2 === 0?d:"");})
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
  ;

  if (options.showMonthGroups) {
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

    if (options.showMonthContour) {
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


function updateData(dataInput, indicatorType, colorScale) {
  var date = d3.time.format("%Y-%m-%d");
  var svg = d3.select("svg g.calHeatmapGroup");

  var tipRT = d3.tip().attr("class", "d3-tip").html(function(d) {
    var obj = dataInput[date(d)];
    return typeof obj === 'undefined'?date(d): '<div class="text-center">' + date(d) + "<br />" + obj.toFixed(0) + "ms";
  });
  svg.call(tipRT);
  var tipError = d3.tip().attr("class", "d3-tip").html(function(d) {
    var obj = dataInput[date(d)];
    return typeof obj === 'undefined'?date(d): '<div class="text-center">' + date(d) + "<br />" + obj.toFixed(2) + " %</div>";
  });
  svg.call(tipError);

  svg.selectAll("g.jobDays .day")
    .filter(function(d) {
      return date(d) in dataInput;
    })
    .attr("class", function(d) {
      var obj = dataInput[date(d)];
      return "day c" + colorScale(obj);
    })
    .on('mouseover', indicatorType === "rtBreakdown"?tipRT.show:tipError.show)
    .on('mouseout', function() {tipRT.hide();tipError.hide();})
  ;

  //UPDATE LEGEND START
  //FIXME add the tip !!!
  var lgdSvg = d3.select("svg g.calHeatmapLegendGroup");
  
  var tipLgd = d3.tip().attr("class", "d3-tip").html(function(d, i) {
    var range = colorScale.invertExtent(i);
    var label = indicatorType === "rtBreakdown"?"ms":"%";
    return "From " + range[0] + label + " to " + range[1] + label;

    // var obj = dataInput[date(d)];
    // return typeof obj === 'undefined'?date(d): '<div class="text-center">' + date(d) + "<br />" + obj.toFixed(2) + " %</div>";
  });
  lgdSvg.call(tipLgd);

  lgdSvg.selectAll(".lgd")
    .attr("range", function(d, i) {
      var range = colorScale.invertExtent(i);
      var label = indicatorType === "rtBreakdown"?"ms":"%";
      return "From " + range[0] + label + " to " + range[1] + label;
    })
    .on('mouseover', tipLgd.show)
    .on('mouseout', tipLgd.hide)
  ;
  //UPDATE LEGEND END
}

function clearData(){
  var svg = d3.select("svg g.calHeatmapGroup");
  svg.selectAll("g.jobDays .day")
    .attr("class", "day")
    .on('mouseover', null)
    .on('mouseout', null)
  ;
}
