Template.jobsList.helpers({
  isEmpty: function() {
    return 0 === Jobs.find().count();
  }
});
