Template.jobsRecycle.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobsRecycle.helpers({
  isEmpty: function() {
    return 0 === Jobs.find().count();
  }
});

Template.jobsRecycle.events({

  /* Actions on individual JOB (-line) */
  'click .jobs .undo': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.isDeleted = false;
    Meteor.call('jobRecoverDeleted', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },
  'click .jobs .delete': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var job = this;
    bootbox.dialog({
      message: "Are you sure you want to delete this monitoring job? The job cannot be recovered later on. Furthemore, all events recorded for that job will be deleted too!",
      title: "Delete monitoring job?",
      buttons: {
        success: {
          label: "Cancel",
          className: "btn-default",
          callback: function() {
            $('.bootbox').modal('hide');
          }
        },
        danger: {
          label: "Delete",
          className: "btn-danger",
          callback: function() {
            Meteor.call('jobPhysicalDelete', job, function(error, result) {
              if (error) {
                return alert(error.reason);
              }
            });
          }
        }
      }
    });
  }
});
