//FIXME initialize the sessions variables to the default: opened or closed...
Template.jobsRecycleItem.helpers({
  dynTemp : function() {
    var jobItem = this._id;

    var jobsState = Session.get("jobRecycleState" + jobItem);
    if (typeof(jobsState) == 'undefined') return "jobsItemDetail";

    switch (jobsState) {
      case "details":
        return "jobsItemDetail";
    }
    return "";
  }
});
