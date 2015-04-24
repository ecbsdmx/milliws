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
    var val = Template.instance().yearTotal.get();
    return Session.equals("SelectedBreakdown", "rtBreakdown")?formatMs(val):formatCount(val);
  },
  yearRange : function() {
    return "Apr 16, 2014 - Apr 16, 2015";
  },
  monthTotal : function() {
    var val = Template.instance().monthTotal.get();
    return Session.equals("SelectedBreakdown", "rtBreakdown")?formatMs(val):formatCount(val);
  },
  monthRange : function() {
    return "Mar 16, 2015 - Apr 16, 2015";
  },
  isMonthTotalOK: function() {
    //FIXME this is not to be devided by 12 but by number of available periods of data !!!
    var availDataPeriods = 12;
    console.log("month/year comp: " + Template.instance().yearTotal.get()/availDataPeriods  + " > " + Template.instance().monthTotal.get());
    return Template.instance().yearTotal.get()/availDataPeriods > Template.instance().monthTotal.get()?"text-success":"text-danger";
  },
  dayTotal : function() {
    var val = Template.instance().dayTotal.get();
    return Session.equals("SelectedBreakdown", "rtBreakdown")?formatMs(val):formatCount(val);
  },
  isDayTotalOK: function() {
    //FIXME this is not to be devided by 30 but by number of available days in month of data !!!
    var availDataPeriods = 30;
    console.log("month/year comp: " + Template.instance().monthTotal.get()/availDataPeriods  + " > " + Template.instance().dayTotal.get());
    return Template.instance().monthTotal.get()/availDataPeriods > Template.instance().dayTotal.get()?"text-success":"text-danger";
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
      template.yearTotal.set(result);
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
      template.monthTotal.set(result);
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
      template.dayTotal.set(result);
    }
  });
}
