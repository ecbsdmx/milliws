Template.jobsItem.created = function() {
  var jobItem = this.data._id;
  var jobState = Session.get("jobDetailState" + jobItem);
  if (typeof(jobState) == 'undefined') {
    Session.set("jobDetailState" + jobItem, defaultJobPanelState);
  }
};

Template.jobsItem.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobsItem.helpers({
  jobPanelStateClass: function() {
    var jobItem = this._id;
    var jobState = Session.get("jobDetailState" + jobItem);
    return "" === jobState ? "collapsed" : "details";
  },
  dynTemp: function() {
    var jobItem = this._id;

    var jobState = Session.get("jobDetailState" + jobItem);
    var $panel = $("#jobPanel_" + this._id);
    updateCollapseMode(jobState, $panel);

    switch (jobState) {
      case "edit":
        return "jobsItemEdit";
      case "details":
        return "jobsItemDetail";
    }
    return "";
  },
  runCount: function() {
    var jobStat = EventStats.findOne({_id: this._id});
    var count = jobStat ? jobStat.value.count : 0;
    return count + (count > 1 ? " times" : " time")
  }
});


Template.jobsItem.events({
  /* Whole JOB row click to toggle details */
  'click .jobsHeader': function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var clickedItem = this._id;
    var currentItemState = Session.get("jobDetailState" + clickedItem);
    var $panel = $("#jobPanel_" + this._id);

    if (typeof(currentItemState) == 'undefined') {
      // not toggled yet : toggle on
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState"+ clickedItem, defaultJobPanelState);
      if (defaultJobPanelState === "details"){
        $panel.addClass("details");
      }
      else {
        $panel.addClass("collapsed");
      }
    }

    if (currentItemState === "details" && currentItemState !== "edit") {
      // not in edit mode for that item and in details mode: toggle off
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState" + clickedItem, "");
      $panel.removeClass("details").addClass("collapsed");
    }
    else if (currentItemState !== "edit") {
      // already toggled previously but not currently on: toggle on
      Session.set("jobDetailState"+ clickedItem, "details");
      Session.set("jobDetailStateItem", clickedItem);
      $panel.removeClass("collapsed").addClass("details");
    }
  }
});
