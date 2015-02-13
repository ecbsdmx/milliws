Template.jobsList.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobsRecycle.events({
  'click #undo': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.forEach(function(item) {
      item.isDeleted = false;
      Meteor.call('jobUpdate', item, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
      });
    });

  },
  'click #delete': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (confirm("Are you sure you want to delete all these monitoring jobs? They cannot be recovered later on.")) {
      this.forEach(function(item) {
        Jobs.remove(item._id);
      });
    }
  }
});