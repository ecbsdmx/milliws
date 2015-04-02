Template.jobsItemActions.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
  $('#editForm_' + this._id).validator();
};

Template.jobsItemActions.helpers({
  isRecycle: function() {
    return Router.current().route.getName() === "jobsRecycle";
  },
  isEdit: function() {
    var currentItem = this._id;
    return "edit" === Session.get("jobDetailState" + currentItem);
  },
  isActiveOwner: function() {
    return this.owner === Meteor.userId() && Roles.userIsInRole(Meteor.user(), ['job-creator']);
  }
});

Template.jobsItemActions.events({

  'click .suspend': function(e) {
    Meteor.call('jobToggleActiveFlag', this._id, false, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },

  'click .resume': function(e) {
    Meteor.call('jobToggleActiveFlag', this._id, true, function(error, result) {
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

  'click .save': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var formId = "#editForm_" + this._id;

    var valid = true;
    $(formId).find('input').each(function(){
      if (!this.checkValidity()) { //-- HTML5
        console.log("Invalid: " + this.id);
        valid = false;
      }
    });

    if (valid) {
      var job = {
        _id: this._id,
        name: this.name,
        url: $("#inputEntryPoint_" + this._id).val() + $("#inputPathParams_" + this._id).val() + ($("#inputQueryParams_" + this._id).val().indexOf('=') === -1 ? "" : "?" + $("#inputQueryParams_" + this._id).val()),
        ert: parseInt($("#inputERT_" + this._id).val()),
        freq: parseInt($("#inputFreq_" + this._id).val()),
        isDeleted: this.isDeleted,
        isActive: this.isActive,
        deltas: $("#inputDeltas_" + this._id).prop('checked'),
        isCompressed: $("#inputCompressed_" + this._id).prop('checked'),
        isIMS: $("#inputIMS_" + this._id).prop('checked'),
        format: $("#inputFormat_" + this._id).val(),
        creationDate: this.creationDate,
        owner: this.owner
      };
      Meteor.call('jobUpdate', job, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        Router.go('jobsList');
      });

      // restore view state
      Session.set("jobDetailStateItem", this._id);
      Session.set("jobDetailState" + this._id, "details");
    }
  },

  'click .cancel': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    // reset values to this !!!
    $("#inputEntryPoint_" + this._id).val(formatEntrypoint(this.url));
    $("#inputPathParams_" + this._id).val(formatPathParams(this.url));
    $("#inputQueryParams_" + this._id).val(formatFormQueryStringParams(this.url));
    $("#inputERT_" + this._id).val(this.ert);
    $("#inputFreq_" + this._id).val(this.freq);
    $("#inputDeltas_" + this._id).val(this.inputDeltas);
    $("#inputCompressed_" + this._id).val(this.inputCompressed);
    $("#inputIMS_" + this._id).val(this.inputIMS);
    $("#inputFormat_" + this._id).val(this.inputFormat);

    Session.set("jobDetailStateItem", this._id);
    Session.set("jobDetailState" + this._id, "details");
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
            Meteor.call('jobVirtualDelete', job._id, function(error, result) {
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
    Meteor.call('jobRecoverDeleted', this._id, function(error, result) {
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
            Meteor.call('jobPhysicalDelete', job._id, function(error, result) {
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
