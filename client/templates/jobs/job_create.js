Template.jobCreate.rendered = function() {
  $('#createWizard input[type=checkbox]').bootstrapToggle();
};

Template.jobCreate.events({
  'finished.fu.wizard #createWizard': function(e) {
    var queryString = $("#inputWSEntry").val() + "/data/" + $("#inputFlow").val() + "/" + $("#inputKey").val() + "/" + $("#inputProvider").val();
    var hasQueryParam = false;
    queryString = augmentQueryString(queryString, "startPeriod", $("#inputStartPeriod").val());
    queryString = augmentQueryString(queryString, "endPeriod", $("#inputEndPeriod").val());
    queryString = augmentQueryString(queryString, "dimensionAtObservation", $("#inputObsDim").val());
    queryString = augmentQueryString(queryString, "firstNObservations", $("#inputFirstNObs").val());
    queryString = augmentQueryString(queryString, "lastNObservations", $("#inputLastNObs").val());
    queryString = augmentQueryString(queryString, "detail", $("#inputDetail").val());
    queryString = augmentQueryString(queryString, "includeHistory", $('#inputWithHistory').prop('checked'));
    var job = {
      _id: $("#inputID").val(),
      name: $("#inputName").val(),
      url: queryString,
      ert: parseInt($("#inputERT").val()),
      freq: parseInt($("#inputFreq").val()),
      deltas: $('#inputDeltas').prop('checked')
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

function augmentQueryString(queryString, paramName, value) {
  if (value) {
    if (-1 === queryString.indexOf('?')) {
      queryString += "?";
    } else {
      queryString += "&";
    }
    queryString += paramName + "=" + value;
  }
  return queryString;
}
