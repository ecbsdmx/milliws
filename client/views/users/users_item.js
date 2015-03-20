Template.userItem.rendered = function() {
  $('input[type=checkbox]').bootstrapToggle();
  $('[data-toggle="tooltip"]').tooltip();
};

Template.userItem.helpers({
  name: function() {
    return this.hasOwnProperty('profile') && this.profile.hasOwnProperty('name') ? this.profile.name : this.username;
  },
  date: function() {
    return moment(this.createdAt).format();
  },
  isAdmin: function() {
    return (typeof this.roles != 'undefined') && -1 < this.roles.indexOf('bofh');
  },
  isCreator: function() {
    return (typeof this.roles != 'undefined') && -1 < this.roles.indexOf('job-creator');
  }
});

Template.userItem.events({

  'change input[type=checkbox]': function(e) {
    var userId = this._id;
    var isAdmin = $("#" + this._id + "_isAdmin").prop('checked');
    var isCreator = $("#" + this._id + "_isCreator").prop('checked');
    Meteor.call('updateUserRoles', userId, isAdmin, isCreator, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },

  'click .delete': function(e) {
    Meteor.call('deleteUser', this._id, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  }
});
