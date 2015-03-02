Template.jobsListActions.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobsListActions.helpers({
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
  }
});

Template.jobsListActions.events({
  'click #toggleJobDetails': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var totalCount = this.count();
    var visibleCount = 0;
    this.forEach(function(item) {
      var currentItem = item._id;
      var currentItemState = Session.get("jobDetailState"+ currentItem);
      if (typeof(currentItem) != 'undefined') {
        if (currentItemState === "details") visibleCount++;
      }
    });//for each
    if (visibleCount < totalCount/2) {
      this.forEach(function(item) {
        var currentItem = item._id;
        Session.set("jobDetailStateItem", currentItem);
        Session.set("jobDetailState"+ currentItem, "details");
        var $panels = $(".jobs .panel");
        $panels.each(function(index) {
          $($panels[index]).removeClass("collapsed").addClass("details");
        });
      });
    }
    else {
      this.forEach(function(item) {
        var currentItem = item._id;
        Session.set("jobDetailStateItem", currentItem);
        Session.set("jobDetailState"+ currentItem, "");
        var $panels = $(".jobs .panel");
        $panels.each(function(index) {
          $($panels[index]).removeClass("details").addClass("collapsed");
        });
      });

    }
  },

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
  }
});
