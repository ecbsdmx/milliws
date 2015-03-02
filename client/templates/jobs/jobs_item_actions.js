Template.jobsItemActions.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobsItemActions.helpers({
  isRecycle: function() {
    return Router.current().route.getName() === "jobsRecycle";
  }
});

Template.jobsItemActions.events({

  'click .suspend': function(e) {
    this.isActive = false;
    Meteor.call('jobUpdate', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },

  'click .resume': function(e) {
    this.isActive = true;
    Meteor.call('jobUpdate', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },

  'click .edit': function(e) {
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
      Session.set("jobDetailState" + clickedItem, defaultJobPanelState);
      //FIXME reset fields?
      ////FIXME select default: blanko or details
    }
    else {
      // other cases: toggle on
      Session.set("jobDetailStateItem", clickedItem);
      Session.set("jobDetailState"+ clickedItem, "edit");
    }
  },

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

  'click .delete': function(e) {
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
  },

  'click .undo': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.isDeleted = false;
    Meteor.call('jobRecoverDeleted', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },

  'click .erase': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var job = this;
    bootbox.dialog({
      message: "Are you sure you want to delete this monitoring job? The job cannot be recovered later on. Furthemore, all events recorded for that job will be deleted too!",
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
            Meteor.call('jobPhysicalDelete', job, function(error, result) {
              if (error) {
                return alert(error.reason);
              }
            });
          }
        }
      }
    });
  }
});
