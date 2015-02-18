var fields = {};
Template.jobCreate.rendered = function() {
  $('#createWizard input[type=checkbox]').bootstrapToggle();
  $('#form').validator();
  var itemNr = $('#createWizard').wizard('selectedItem').step;
  var item = $(".step-pane[data-step="+itemNr+"]");
  fields = initStepValidation(item);
  setNextButtonState(fields);
};

Template.jobCreate.events({
  'invalid.bs.validator #form': function(e) {
    fields[e.relatedTarget.name] = false;
    setNextButtonState(fields);
  },
  'valid.bs.validator #form': function(e) {
    fields[e.relatedTarget.name] = true;
    setNextButtonState(fields);
  },
  'changed.fu.wizard #createWizard': function(e) {
    $("#next").attr("disabled", "disabled");
  },
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

function initStepValidation(step) {
  var flds = {};
  var mandatoryFields = $(step).find("input[required]");
  if (mandatoryFields.length > 0) {
    $(mandatoryFields).each(function(index) {
      flds[this.name] = false;
    })
  }
  var optionalFields = $(step).find("input[required != required]");
  if (optionalFields.length > 0) {
    $(optionalFields).each(function(index) {
      flds[this.name] = true;
    });
  }
  for (var property in flds) {
    if (flds.hasOwnProperty(property)) {
      console.log(property + ": " + flds[property]);
    }
  }
  return flds;
}

function setNextButtonState(flds) {
  var isValid = true;
  for (var property in flds) {
    if (flds.hasOwnProperty(property) && !(flds[property])) {
      isValid = false;
      break;
    }
  }
  if (isValid) {
    $("#next").removeAttr("disabled");
  } else {
    $("#next").attr("disabled", "disabled");
  }
}
