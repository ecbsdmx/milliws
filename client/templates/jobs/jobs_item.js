//FIXME initialize the sessions variables to the default: opened or closed...
Template.jobsItem.helpers({
  dynTemp : function() {
    var jobItem = this._id;

    var jobsState = Session.get("jobDetailState" + jobItem);
    if (typeof(jobsState) == 'undefined') return "jobsItemDetail";

    switch (jobsState) {
      case "edit":
        return "jobsItemEdit";
      case "details":
        return "jobsItemDetail";
    }
    return "";
  }
});
