Template.usersList.helpers({
  highlander: function() {
    return 1 === this.count(); // There can be only one
  },
  count: function() {
    return this.count();
  }
});
