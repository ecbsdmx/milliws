Meteor.methods({
  updateUserRoles: function(userId, isAdmin, isCreator) {
    if (checkPermissions()) {
      if (isAdmin) {
        Roles.addUsersToRoles(userId, 'bofh');
      } else {
        Roles.removeUsersFromRoles(userId, 'bofh');
      }
      if (isCreator) {
        Roles.addUsersToRoles(userId, 'job-creator');
      } else {
        Roles.removeUsersFromRoles(userId, 'job-creator');
      }
    } else {
      Meteor.call("messageLogError", "User " + this.userId + " does not have permissions", "updateUserRoles");
    }
  },
  deleteUser: function(userId) {
    if (checkPermissions()) {
      Meteor.users.remove({_id: userId});
    } else {
      //FIXME Should log an error for the admins
      Meteor.call("messageLogError", "User " + this.userId + " does not have permissions", "deleteUser");
    }
  }
});

var checkPermissions = function() {
  if (Roles.userIsInRole(Meteor.user(), 'bofh')) {
    return true;
  } else {
    return false;
  }
};
