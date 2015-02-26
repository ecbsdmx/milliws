
Template.jobsItem.helpers({
  dynTemp : function() {
    console.log("dynTemp: " + this._id);
    var jobItem = this._id;

    var jobsState = Session.get("jobDetailState" + jobItem);
    if (typeof(jobsState) == 'undefined') return "";

    switch (jobsState) {
      case "edit":
        return "jobsItemEdit";
      case "details":
        return "jobsItemDetail";
    }
    return "";
  }
});
