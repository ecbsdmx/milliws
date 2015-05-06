Template.jobsListActions.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobsListActions.helpers({
  isAllActive: function() {
    var active = 0;
    var suspended = 0;
    this.forEach(function(item) {
      if (item.owner === Meteor.userId()) {
        if (item.isActive) {
          active++;
        } else {
          suspended++;
        }
      }
    });
    return active >= suspended;
  },
  isAllDetailsVisible: function() {
    var totalCount = this.count();
    var visibleCount = 0;
    this.forEach(function(item) {
      var currentItem = item._id;
      var currentItemState = Session.get("jobDetailState" + currentItem);
      if (typeof(currentItem) != 'undefined' && currentItemState === "details") {
        visibleCount++;
      }
    });//for each
    return visibleCount > totalCount/2;
  },
  isRecycle: function() {
    return Router.current().route.getName() === "jobsRecycle";
  },
  hasOwnJobs: function() {
    return Roles.userIsInRole(Meteor.user(), ['job-creator']) && 0 < Jobs.find({owner: Meteor.userId()}).count();
  },
  hasJobs: function() {
    return 0 < Jobs.find().count();
  }
});

Template.jobsListActions.events({
  'click #toggleJobDetails': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    // get total actual visible
    var totalCount = this.count();
    var visibleCount = $(".details").length;

    //change all states accordingly
    this.forEach(function(item) {
      var currentItem = item._id;
      Session.set("jobDetailStateItem", currentItem);
      var $panel = $("#jobPanel_" + currentItem);
      if (visibleCount < totalCount/2) {
        Session.set("jobDetailState"+ currentItem, "details");
        updateCollapseMode("details", $panel);
      }
      else {
        Session.set("jobDetailState"+ currentItem, "");
        updateCollapseMode("", $panel);
      }
    });
  },

  'click #suspendAll': function(e) {
    $(e.currentTarget).tooltip('destroy');
    this.forEach(function(item) {
      if (item.owner === Meteor.userId()) {
        Meteor.call('jobToggleActiveFlag', item._id, false, function(error, result) {
          if (error) {
            return alert(error.reason);
          }
        });
      }
    });
  },

  'click #resumeAll': function(e) {
    $(e.currentTarget).tooltip('destroy');
    this.forEach(function(item) {
      if (item.owner === Meteor.userId()) {
        Meteor.call('jobToggleActiveFlag', item._id, true, function(error, result) {
          if (error) {
            return alert(error.reason);
          }
        });
      }
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
              Meteor.call('jobVirtualDelete', item._id, function(error, result) {
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

  'click #undoAll': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.forEach(function(item) {
      item.isDeleted = false;
      Meteor.call('jobRecoverDeleted', item._id, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
      });
    });

  },

  'click #eraseAll': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var jobs = this;
    bootbox.dialog({
      message: "Are you sure you want to delete all these monitoring jobs? They cannot be recovered later on.",
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
              Meteor.call('jobPhysicalDelete', item._id, function(error, result) {
                if (error) {
                  return alert(error.reason);
                }
              });
            });
          }
        }
      }
    });
  }
});
