// Needed to prevent users from escalating their privileges
Meteor.users.deny({
  update: function() {
    return true;
  }
});
