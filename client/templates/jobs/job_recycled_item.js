Template.jobRecycledItem.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobRecycledItem.events({
    'click #undo': function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.isDeleted = false;
      Meteor.call('jobUpdate', this, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
      });
    },
    'click #delete': function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (confirm("Are you sure you want to delete this monitoring job? The job cannot be recovered later on.")) {
        Jobs.remove(this._id);
      }
    }
});