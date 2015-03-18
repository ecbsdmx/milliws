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
      console.log("User '" + this.userId + "' does not have permissions");
    }
  },
  deleteUser: function(userId) {
    if (checkPermissions()) {
      Meteor.users.remove({_id: userId});
    } else {
      //FIXME Should log an error for the admins
      console.log("User '" + this.userId + "' does not have permissions");
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
