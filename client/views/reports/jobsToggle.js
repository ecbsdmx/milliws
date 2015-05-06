Template.jobsToggle.helpers({
  isActive: function(job){
    return isSelectedJob(job) ? "active" : "";
  },

  isChecked: function(job){
    return isSelectedJob(job) ? "checked" : "";
  }
});

Template.jobsToggle.events({
  'click .btn': function(e){
    e.preventDefault();
    var selectedJob = e.currentTarget.id.replace('_toggle', '');
    var selectedJobs = Session.get("SelectedEventsStats");
    var i = selectedJobs.indexOf(selectedJob);
    if(-1 === i) {
      selectedJobs.push(selectedJob);
    } else {
      selectedJobs.splice(i, 1);
    }
    Session.set("SelectedEventsStats", selectedJobs);
  }
});

var isSelectedJob = function(jobId) {
  var selectedJobs = Session.get("SelectedEventsStats") || null;
  return null === selectedJobs || -1 < selectedJobs.indexOf(jobId);
}
