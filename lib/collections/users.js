var debug = Npm.require("debug")("loki:collections:users:validation");

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
      //FIXME Should log an error for the admins
      debug("User %j does not have permissions", this.userId);
    }
  },
  deleteUser: function(userId) {
    if (checkPermissions()) {
      Meteor.users.remove({_id: userId});
    } else {
      //FIXME Should log an error for the admins
      debug("User %j does not have permissions", this.userId);
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
