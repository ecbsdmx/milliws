Template.reportBreakdown.onCreated(function() {
  var instance = this;
  instance.yearTotal = new ReactiveVar(0);
  instance.monthTotal = new ReactiveVar(0);
  instance.dayTotal = new ReactiveVar(0);

  if(!Session.get("SelectedBreakdown")){
    Session.set("SelectedBreakdown","rtBreakdown");
  }
  
  Tracker.autorun(function () {
    getYearlyTotal(instance);
    getMonthlyTotal(instance)
    getDailyTotal(instance)
  });
});


Template.reportBreakdown.onRendered(function() {
});


Template.reportBreakdown.helpers({
  breakDownIsChecked: function(breakdown){
    return isSelectedBreakDown(breakdown) ? "checked" : "";
  },
  breakDownIsActive: function(breakdown){
    return isSelectedBreakDown(breakdown) ? "active" : "";
  },
  yearTotal : function() {
    return Template.instance().yearTotal.get()
  },
  yearRange : function() {
    return "Apr 16, 2014 - Apr 16, 2015";
  },
  monthTotal : function() {
    return Template.instance().monthTotal.get()
  },
  monthRange : function() {
    return "Mar 16, 2015 - Apr 16, 2015";
  },
  isMonthTotalOK: function() {
    //FIXME this is not to be devided by 12 but by number of available periods of data !!!
    var availDataPeriods = 12;
    //console.log("month/year comp: " + Template.instance().yearTotal.get()/availDataPeriods  + " > " + Template.instance().monthTotal.get());
    return Template.instance().yearTotal.get()/availDataPeriods > Template.instance().monthTotal.get()?"text-success":"text-danger";
  },
  dayTotal : function() {
    return Template.instance().dayTotal.get();
  },
  isDayTotalOK: function() {
    //FIXME this is not to be devided by 30 but by number of available days in month of data !!!
    var availDataPeriods = 30;
    //console.log("day/month comp: " + Template.instance().monthTotal.get()/availDataPeriods  + " > " + Template.instance().dayTotal.get());
    return Template.instance().monthTotal.get()/availDataPeriods > Template.instance().dayTotal.get()?"text-success":"text-danger";
  },
  subscriptionType: function() {
    return Session.equals("SelectedBreakdown", "rtBreakdown");
  }

});


Template.reportBreakdown.events({
  'click .breakdown .btn': function(e){
    e.preventDefault();
    Session.set("SelectedBreakdown", e.currentTarget.id);

    getYearlyTotal(Template.instance());
    getMonthlyTotal(Template.instance());
    getDailyTotal(Template.instance());
  }
});



var isSelectedBreakDown = function(breakdown) {
  return Session.equals("SelectedBreakdown", breakdown);
}

function getYearlyTotal(template)
{
  //FIXME pass in the period or last-displayed date
  Meteor.call("compileYearTotal", Session.get("SelectedBreakdown"), Session.get("SelectedEventsStats"), new Date(), function(error, result) {
    if (error) {
      console.log("compileYearTotal callback error: " + error);
    }
    else {
      template.yearTotal.set(Session.equals("SelectedBreakdown", "rtBreakdown")?formatMs(result):formatCount(result));
    }
  });
}

function getMonthlyTotal(template)
{
  //FIXME pass in the period or last-displayed date
  Meteor.call("compileMonthTotal", Session.get("SelectedBreakdown"), Session.get("SelectedEventsStats"), new Date(), function(error, result) {
    if (error) {
      console.log("compileMonthTotal callback error: " + error);
    }
    else {
      template.monthTotal.set(Session.equals("SelectedBreakdown", "rtBreakdown")?formatMs(result):formatCount(result));
    }
  });
}

function getDailyTotal(template)
{
  //FIXME pass in the period or last-displayed date
  Meteor.call("compileDayTotal", Session.get("SelectedBreakdown"), Session.get("SelectedEventsStats"), new Date(), function(error, result) {
    if (error) {
      console.log("compileDayTotal callback error: " + error);
    }
    else {
      console.log("day result: " + result);
      template.dayTotal.set(Session.equals("SelectedBreakdown", "rtBreakdown")?formatMs(result):formatCount(result));
    }
  });
}
