var fields;
Template.jobCreate.rendered = function() {
  $('#createWizard input[type=checkbox]').bootstrapToggle();
  $('.required-icon').tooltip({
    placement: 'left',
    title: 'Required field'
  });
  $('#form').validator();
  $('[data-toggle="popover"]').popover()
  initStep();
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
    initStep();
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
      deltas: $('#inputDeltas').prop('checked'),
      isCompressed: $('#inputCompress').prop('checked'),
      isIMS:  $('#inputIMS').prop('checked'),
      format: $("#inputFormat").val()
    };
    Meteor.call('jobInsert', job, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
      if (result.idTaken) {
        return alert('There is already a monitoring job with that id.');
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

// Initializes the validation rules and navigation for the selected step
function initStep() {
  fields = {};
  var itemNr = $('#createWizard').wizard('selectedItem').step;
  var item = $(".step-pane[data-step="+itemNr+"]");
  fields = setValidationRules(item);
  setNextButtonState(fields);
}

// Defines the validation rules for the current step.
function setValidationRules(step) {
  var flds = {};
  var mandatoryFields = $(step).find("input[required]");
  if (mandatoryFields.length > 0) {
    $(mandatoryFields).each(function(index) {
      if (this.value.length === 0) {
        flds[this.name] = false;
      }
    })
  }
  var optionalFields = $(step).find("input[required != required]");
  if (optionalFields.length > 0) {
    $(optionalFields).each(function(index) {
      flds[this.name] = true;
    });
  }
  /*
  for (var property in flds) {
    if (flds.hasOwnProperty(property)) {
      console.log(property + ": " + flds[property]);
    }
  }
  */
  return flds;
}

// Sets the state of the next button, based on whether validation is succesfull for the current step
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
