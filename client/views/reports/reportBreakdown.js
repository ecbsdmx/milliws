Template.reportBreakdown.onCreated(function() {
  var instance = this;
  instance.yearTotal = new ReactiveVar(0);

  if(!Session.get("SelectedBreakdown")){
    Session.set("SelectedBreakdown","rtBreakdown");
  }
  
  Tracker.autorun(function () {
    getYearlyTotal(instance);
  });
});


Template.reportBreakdown.onRendered(function() {
  var instance = this;

});


Template.reportBreakdown.helpers({
  
  breakDownIsChecked: function(breakdown){
    return isSelectedBreakDown(breakdown) ? "checked" : "";
  },
  breakDownIsActive: function(breakdown){
    return isSelectedBreakDown(breakdown) ? "active" : "";
  },
  yearTotal : function() {
    return Template.instance().yearTotal.get();
  },
  yearRange : function() {
    return "Apr 16, 2014 - Apr 16, 2015";
  },
  monthTotal : function() {
    return 40;
  },
  monthRange : function() {
    return "Mar 16, 2015 - Apr 16, 2015";
  },
  dayTotal : function() {
    return 0;
  }

});


Template.reportBreakdown.events({
  'click .breakdown .btn': function(e){
    e.preventDefault();
    Session.set("SelectedBreakdown", e.currentTarget.id);

    getYearlyTotal(Template.instance());
  }
});



var isSelectedBreakDown = function(breakdown) {
  return Session.equals("SelectedBreakdown", breakdown);
}


function getYearlyTotal(template)
{
  Meteor.call("compileYearTotal", Session.get("SelectedBreakdown"), Session.get("SelectedEventsStats"), null, function(error, result) {
    if (error) {
      console.log("compileYearTotal callback error: " + error);
    }
    else {
      template.yearTotal.set(result);
    }
  });
}