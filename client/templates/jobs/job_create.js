Template.jobCreate.events({
  'submit form': function(e) {
    e.preventDefault();

    var job = {
      _id: $("#inputID").val(),
      name: $("#inputName").val(),
      url: $("#inputURL").val(),
      ert: parseInt($("#inputERT").val()),
      freq: parseInt($("#inputFreq").val())
    };
    Meteor.call('jobInsert', job, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
      if (result.idTaken) {
        return alert('There is already a monitoring job with that id.');
      }
      if (result.urlExists) {
        return alert('There is already a monitoring job for the supplied URL.');
      }
      $('#insertJobModal').modal('hide');
    });
  }
});
