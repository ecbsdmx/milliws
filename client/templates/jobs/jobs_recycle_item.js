//FIXME initialize the sessions variables to the default: opened or closed...
Template.jobsRecycleItem.helpers({
  dynTemp : function() {
    var jobItem = this._id;

    var jobsState = Session.get("jobRecycleState" + jobItem);
    if (typeof(jobsState) == 'undefined') {
      jobsState = defaultJobPanelState;
      Session.set("jobRecycleState" + jobItem,jobsState);
     }

    switch (jobsState) {
      case "details":
        return "jobsItemDetail";
    }
    return "";
  }
});

Template.jobsRecycleItem.events({
  /* Whole JOB row click to toggle details */
  'click .jobsHeader': function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var clickedItem = this._id;
    var currentItemState = Session.get("jobRecycleState" + clickedItem);
    var $panel = $(e.target).closest(".panel");

    if (typeof(currentItemState) == 'undefined') {
      // not toggled yet : toggle on
      Session.set("jobRecycleStateItem", clickedItem);
      Session.set("jobRecycleState" + clickedItem, "details");
      if (defaultJobPanelState === "details"){
        $panel.addClass("details");
      }
      else {
        $panel.addClass("collapsed");
      }
    }

    if (currentItemState === "details") {
      // not in edit mode for that item and in details mode: toggle off
      Session.set("jobRecycleStateItem", clickedItem);
      Session.set("jobRecycleState" + clickedItem, "");
      $panel.removeClass("details").addClass("collapsed");
    } else {
      // already toggled buit not currently toggled on: toggle on
      Session.set("jobRecycleState"+ clickedItem, "details");
      Session.set("jobRecycleStateItem", clickedItem);
      $panel.removeClass("collapsed").addClass("details");
    }
  }
});