//FIXME initialize the sessions variables to the default: opened or closed...
Template.jobsItem.helpers({
  dynTemp : function() {
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

    if (typeof(currentItemState) == 'undefined') {
      // not toggled yet : toggle on
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState"+ clickedItem, defaultJobPanelState);
    }

    if (currentItemState === "details" && currentItemState !== "edit") {
      // not in edit mode for that item and in details mode: toggle off
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState" + clickedItem, "");
    }
    else if (currentItemState !== "edit") {
      // already toggled previously but not currently on: toggle on
      Session.set("jobDetailState"+ clickedItem, "details");
      Session.set("jobDetailStateItem", clickedItem);
    }

    /*
    e.preventDefault();
    e.stopImmediatePropagation();

    var $detailRow = $('#jobDetailRow_' + this._id);

    // prevent showing details when in edit mode and clicking on the job row header
    var $editRow = $('#jobEditRow_' + this._id);
    if ($editRow.hasClass("displayRow")) { return; }

    $detailRow.toggleClass("displayRow");

    //-- toggle chevron class
    var chevronId = "#chevron_" + this._id;
    if($(chevronId).hasClass( "fa-chevron-down")) {
      $(chevronId).removeClass("fa-chevron-down").addClass("fa-chevron-up");
    } else {
      $(chevronId).removeClass("fa-chevron-up").addClass("fa-chevron-down");
    }
    */
  }
});
