Template.jobsRecycle.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobsRecycle.events({
  'click #undoAll': function(e) {
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
  'click #deleteAll': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (confirm("Are you sure you want to delete all these monitoring jobs? They cannot be recovered later on.")) {
      this.forEach(function(item) {
        Jobs.remove(item._id);
      });
    }
  },

  'click .jobsRecycle .undo': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.isDeleted = false;
    Meteor.call('jobUpdate', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },
  'click .jobsRecycle .delete': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (confirm("Are you sure you want to delete this monitoring job? The job cannot be recovered later on.")) {
      Jobs.remove(this._id);
    }
  }

});