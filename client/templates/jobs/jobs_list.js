Template.jobsList.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
  $('.form-horizontal').validator();
};

Template.jobsList.helpers({
  isAllActive: function() {
    var active = 0;
    var suspended = 0;
    this.forEach(function(item) {
      if (item.isActive) {
        active++;
      } else {
        suspended++;
      }
    });
    return active >= suspended;
  }
});

Template.jobsList.events({
  /* Actions on all JOBS */
  'click #suspendAll': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.forEach(function(item) {
      item.isActive = false;
      Meteor.call('jobUpdate', item, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
      });
    });

  },
  'click #resumeAll': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.forEach(function(item) {
      item.isActive = true;
      Meteor.call('jobUpdate', item, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
      });
    });
  },
  'click #deleteAll': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var jobs = this;
    bootbox.dialog({
      message: "Are you sure you want to delete all monitoring job? They can still be recovered later, if you change your mind. This will also hide all in the events view.",
      title: "Delete all monitoring jobs?",
      buttons: {
        success: {
          label: "Cancel",
          className: "btn-default",
          callback: function() {
            $('.bootbox').modal('hide');
          }
        },
        danger: {
          label: "Delete",
          className: "btn-danger",
          callback: function() {
            jobs.forEach(function(item) {
              item.isDeleted = true;
              Meteor.call('jobUpdate', item, function(error, result) {
                if (error) {
                  return alert(error.reason);
                }
              });
            });
          }
        }
      }
    });
  },

  /* Actions on individual JOB (-line) */
  'click .jobs .suspend': function(e) {
    this.isActive = false;
    Meteor.call('jobUpdate', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },
  'click .jobs .resume': function(e) {
    this.isActive = true;
    Meteor.call('jobUpdate', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },
  'click .jobs .edit': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var clickedItem = this._id;
    var currentItemState = Session.get("jobDetailState" + clickedItem);

    if (typeof(currentItemState) == 'undefined') {
      // not toggled yet : toggle on
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState"+ clickedItem, "edit");
    }
    if (currentItemState === "edit") {
      // in edit mode for that item: toggle off
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState" + clickedItem, "details");
      //FIXME reset fields?
      ////FIXME select default: blanko or details
    }
    else {
      // other cases: toggle on
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState"+ clickedItem, "edit");
    }
    /*
    var $detailRow = $('#jobDetailRow_' + this._id);
    var $editRow = $('#jobEditRow_' + this._id);
    $detailRow.removeClass("displayRow");
    $editRow.toggleClass("displayRow");
    */
  },

  /* Whole JOB row click to toggle details */
  'click .jobsHeader': function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var clickedItem = this._id;
    var currentItemState = Session.get("jobDetailState" + clickedItem);

    if (typeof(currentItemState) == 'undefined') {
      // not toggled yet : toggle on
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState"+ clickedItem, "details");
    }

    if (currentItemState === "details" && currentItemState !== "edit") {
      // not in edit mode for that item and in details mode: toggle off
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState" + clickedItem, "");
    }
    else if (currentItemState !== "edit") {
      // already toggled buit not currently toggled on: toggle on
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState"+ clickedItem, "details");
    }
  },

  /* JOB edition actions */
  'click .jobEditSubmit': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var formId = "#editForm_" + this._id;

    var valid = true;
    $(formId).find('input').each(function(){
      if (!this.checkValidity()) { //-- HTML5
        valid = false;
      }
    });

    if (valid) {
      var job = {
        _id: this._id,
        name: $("#inputName_" + this._id).val(),
        url: $("#inputURL_" + this._id).val(),
        ert: parseInt($("#inputERT_" + this._id).val()),
        freq: parseInt($("#inputFreq_" + this._id).val()),
        isDeleted: this.isDeleted,
        isActive: this.isActive,
        deltas: $("#inputDeltas_" + this._id).prop('checked'),
        isCompressed: $("#inputCompressed_" + this._id).prop('checked'),
        isIMS: $("#inputIMS_" + this._id).prop('checked'),
        format: $("#inputFormat_" + this._id).val(),
        creationDate: this.creationDate
      };
      Meteor.call('jobUpdate', job, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        Router.go('jobsList');
      });

      // restore view state
      var $detailRow = $('#jobDetailRow_' + this._id);
      var $editRow = $('#jobEditRow_' + this._id);
      $editRow.removeClass("displayRow");
      $detailRow.addClass("displayRow");
    }
  },
  'click .jobEditCancel': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    // reset values to this !!!
    $("#inputURL").val(this.url);
    $("#inputERT").val(this.ert);
    $("#inputFreq").val(this.freq);

    var $editRow = $('#jobEditRow_' + this._id);
    $editRow.toggleClass("displayRow");
  },

  'click .jobs .delete': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var job = this;
    bootbox.dialog({
      message: "Are you sure you want to delete this monitoring job? It can still be recovered later, if you change your mind. This will also hide the events related to that job in the events view.",
      title: "Delete monitoring job?",
      buttons: {
        success: {
          label: "Cancel",
          className: "btn-default",
          callback: function() {
            $('.bootbox').modal('hide');
          }
        },
        danger: {
          label: "Delete",
          className: "btn-danger",
          callback: function() {
            job.isDeleted = true;
            Meteor.call('jobVirtualDelete', job, function(error, result) {
              if (error) {
                return alert(error.reason);
              }
              Router.go('jobsList');
            });
          }
        }
      }
    });
  }
});
