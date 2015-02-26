//FIXME initialize the sessions variables to the default: opened or closed...
Template.jobsItem.helpers({
  dynTemp : function() {
    console.log("dynTemp update triggered");
    var jobItem = this._id;

    var jobsState = Session.get("jobDetailState" + jobItem);
    if (typeof(jobsState) == 'undefined') {
      jobsState = defaultJobPanelState;
      Session.set("jobDetailState" + jobItem,jobsState);
     }

    switch (jobsState) {
      case "edit":
        return "jobsItemEdit";
      case "details":
        return "jobsItemDetail";
    }
    return "";
  }
});


Template.jobsItem.events({
  /* Whole JOB row click to toggle details */
  'click .jobsHeader': function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    var clickedItem = this._id;
    var currentItemState = Session.get("jobDetailState" + clickedItem);
    var $panel = $(e.target).closest(".panel");

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
