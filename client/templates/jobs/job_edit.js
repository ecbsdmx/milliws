Template.jobEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var job = {
      _id: this._id,
      name: $("#inputName").val(),
      url: $("#inputURL").val(),
      ert: parseInt($("#inputERT").val()),
      freq: parseInt($("#inputFreq").val()),
      isDeleted: this.isDeleted,
      isActive: this.isActive
    };
    Meteor.call('jobUpdate', job, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
      if (result.urlExists) {
        return alert('There is already a monitoring job for the supplied URL.');
      }
      Router.go('jobsList');
    });
  },
  'click #close': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    Router.go('jobsList');
  }
});