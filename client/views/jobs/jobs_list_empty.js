Template.jobsListEmpty.helpers({
  isRecycle: function() {
    return Router.current().route.getName() === "jobsRecycle";
  }
});
