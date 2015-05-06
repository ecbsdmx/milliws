Template.reportBreakdown.onCreated(function() {
  var instance = this;

  instance.yearTotal = new ReactiveVar(0);
  instance.monthTotal = new ReactiveVar(0);
  instance.dayTotal = new ReactiveVar(0);

  instance.yearTotalFormatted = new ReactiveVar(0);
  instance.monthTotalFormatted = new ReactiveVar(0);
  instance.dayTotalFormatted = new ReactiveVar(0);

  instance.monthOk = new ReactiveVar(0);
  instance.dayOk = new ReactiveVar(0);

  instance.endPeriod = new ReactiveVar(new Date());
  instance.yRdy = new ReactiveVar(false);
  instance.mRdy = new ReactiveVar(false);
  instance.dRdy = new ReactiveVar(false);

  if(!Session.get("SelectedBreakdown")){
    Session.set("SelectedBreakdown","rtBreakdown");
  }

  Tracker.autorun(function () {
    var indicatorType = Session.get("SelectedBreakdown");
    var selectedJobs = Session.get("SelectedEventsStats");
    instance.yRdy.set(false);
    instance.mRdy.set(false);
    instance.dRdy.set(false);
    getYearlyTotal(instance, indicatorType, selectedJobs);
    getMonthlyTotal(instance, indicatorType, selectedJobs);
    getDailyTotal(instance, indicatorType, selectedJobs);
  });
});


Template.reportBreakdown.onRendered(function() {
  var instance = this;
  //in case page remains open for several days
  instance.endPeriod.set(new Date());
});


Template.reportBreakdown.helpers({
  breakDownIsChecked: function(breakdown){
    return isSelectedBreakDown(breakdown) ? "checked" : "";
  },
  breakDownIsActive: function(breakdown){
    return isSelectedBreakDown(breakdown) ? "active" : "";
  },
  yearTotal : function() {
    return Template.instance().yearTotalFormatted.get();
  },
  yearTotalCount : function() {
    return Template.instance().yearTotal.get().total;
  },
  yearTotalPercent : function() {
    var result = Template.instance().yearTotal.get();
    return (result.val / result.total * 100).toFixed(2);
  },
  yearRange : function() {
    var endPeriod = Template.instance().endPeriod.get();
    var startPeriod = new Date(endPeriod.getFullYear()-1, endPeriod.getMonth(), endPeriod.getDate());
    return moment(startPeriod).format("MMM DD, YYYY") + " - " + moment(endPeriod).format("MMM DD, YYYY");
  },
  monthTotal : function() {
    return Template.instance().monthTotalFormatted.get();
  },
  monthTotalCount : function() {
    return Template.instance().monthTotal.get().total;
  },
  monthTotalPercent: function() {
    var result = Template.instance().monthTotal.get();
    return (result.val / result.total * 100).toFixed(2);
  },
  monthRange : function() {
    var endPeriod = Template.instance().endPeriod.get();
    var startPeriod = new Date(endPeriod.getFullYear(), endPeriod.getMonth()-1, endPeriod.getDate());
    return moment(startPeriod).format("MMM DD, YYYY") + " - " + moment(endPeriod).format("MMM DD, YYYY");
  },
  isMonthTotalOK: function() {
    return Template.instance().monthOk.get();
  },
  dayTotal : function() {
    return Template.instance().dayTotalFormatted.get();
  },
  dayTotalCount : function() {
    return Template.instance().dayTotal.get().total;
  },
  dayTotalPercent : function() {
    var result = Template.instance().dayTotal.get();
    return (result.val / result.total * 100).toFixed(2);
  },
  isDayTotalOK: function() {
    return Template.instance().dayOk.get();
  },
  isRTBreakdown: function() {
    return Session.equals("SelectedBreakdown", "rtBreakdown");
  },
  isErrorBreakdown: function() {
    return Session.equals("SelectedBreakdown", "errorBreakdown");
  },
  isYearReady: function() {
    return Template.instance().yRdy.get();
  },
  isMonthReady: function() {
    return Template.instance().mRdy.get();
  },
  isDayReady: function() {
    return Template.instance().dRdy.get();
  }
});


Template.reportBreakdown.events({
  'click .breakdown .btn': function(e){
    e.preventDefault();
    Session.set("SelectedBreakdown", e.currentTarget.id);
  }
});


var isSelectedBreakDown = function(breakdown) {
  return Session.equals("SelectedBreakdown", breakdown);
}

function getYearlyTotal(templateInstance, indicatorType, selectedJobs)
{
  Meteor.call("compileYearTotal", indicatorType, selectedJobs, templateInstance.endPeriod.get(), function(error, result) {
    if (error) {
      console.log("compileYearTotal callback error: " + error);
    }
    else {
      templateInstance.yearTotal.set(result);
      templateInstance.yearTotalFormatted.set(indicatorType === "rtBreakdown" ? formatMs(result.val) : formatCount(result.val));
      templateInstance.yRdy.set(true);
    }
  });
}

function getMonthlyTotal(templateInstance, indicatorType, selectedJobs)
{
  Meteor.call("compileMonthTotal", indicatorType, selectedJobs, templateInstance.endPeriod.get(), function(error, result) {
    if (error) {
      console.log("compileMonthTotal callback error: " + error);
    }
    else {
      templateInstance.monthTotal.set(result);
      templateInstance.monthTotalFormatted.set(indicatorType === "rtBreakdown" ? formatMs(result.val) : formatCount(result.val));

      if(indicatorType === "rtBreakdown") {
        templateInstance.monthOk.set(templateInstance.monthTotal.get().val > templateInstance.yearTotal.get().val? "text-danger" : "text-success");
      }
      else {
        var resultY = templateInstance.yearTotal.get();
        var yearPercent = resultY.val / resultY.total;
        var resultM = templateInstance.monthTotal.get();
        var monthPercent = resultM.val / resultM.total;
        templateInstance.monthOk.set(monthPercent > yearPercent? "text-danger" : "text-success");
      }
      templateInstance.mRdy.set(true);
    }
  });
}

function getDailyTotal(templateInstance, indicatorType, selectedJobs)
{
  Meteor.call("compileDayTotal", indicatorType, selectedJobs, templateInstance.endPeriod.get(), function(error, result) {
    if (error) {
      console.log("compileDayTotal callback error: " + error);
    }
    else {
      templateInstance.dayTotal.set(result);
      templateInstance.dayTotalFormatted.set(indicatorType === "rtBreakdown" ? formatMs(result.val) : formatCount(result.val));

      if(indicatorType === "rtBreakdown") {
        templateInstance.dayOk.set(templateInstance.dayTotal.get().val > templateInstance.yearTotal.get().val? "text-danger" : "text-success");
      }
      else {
        var resultY = templateInstance.yearTotal.get();
        var yearPercent = resultY.val / resultY.total;
        var resultD = templateInstance.dayTotal.get();
        var dayPercent = resultD.val / resultD.total;
        templateInstance.dayOk.set(dayPercent > yearPercent? "text-danger" : "text-success");
      }
      templateInstance.dRdy.set(true);
    }
  });
}
