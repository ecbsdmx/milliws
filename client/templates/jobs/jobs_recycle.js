Template.jobsRecycle.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
  /*
  FIXME: detail row also sorted but should not
  $("#jobsTable").tablesorter({
    headers: {
      2:{sorter: false}
    }
  });
  */
};

Template.jobsRecycle.helpers({
  isAllDetailsVisible: function() {
    var totalCount = this.count();
    var visibleCount = 0;
    this.forEach(function(item) {
      var currentItem = item._id;
      var currentItemState = Session.get("jobRecycleState"+ currentItem);
      if (typeof(currentItem) != 'undefined') {
        if (currentItemState === "details") visibleCount++;
      }
    });//for each
    if (visibleCount > totalCount/2) return true;
    return false;
  },
  isEmpty: function() {
    return 0 === Jobs.find().count();
  }
});

Template.jobsRecycle.events({
  /* Actions on all JOBS */
   /* Actions on all JOBS */
  'click #toggleJobDetails': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var totalCount = this.count();
    var visibleCount = 0;
    this.forEach(function(item) {
      var currentItem = item._id;
      var currentItemState = Session.get("jobRecycleState"+ currentItem);
      if (typeof(currentItem) != 'undefined') {
        if (currentItemState === "details") visibleCount++;
      }
    });//for each
    if (visibleCount < totalCount/2) {
      this.forEach(function(item) {
        var currentItem = item._id;
        Session.set("jobRecycleStateItem", currentItem);
        Session.set("jobRecycleState"+ currentItem, "details");
        var $panels = $(".jobs .panel");
        $panels.each(function(index) {
          $($panels[index]).removeClass("collapsed").addClass("details");
        });
      });
    }
    else {
      this.forEach(function(item) {
        var currentItem = item._id;
        Session.set("jobRecycleStateItem", currentItem);
        Session.set("jobRecycleState"+ currentItem, "");
        var $panels = $(".jobs .panel");
        $panels.each(function(index) {
          $($panels[index]).removeClass("details").addClass("collapsed");
        });
      });

    }
  },
  'click #undoAll': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.forEach(function(item) {
      item.isDeleted = false;
      Meteor.call('jobRecoverDeleted', item, function(error, result) {
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
              Jobs.remove(item._id);
            });
          }
        }
      }
    });
  },

  /* Actions on individual JOB (-line) */
  'click .jobs .undo': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.isDeleted = false;
    Meteor.call('jobRecoverDeleted', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },
  'click .jobs .delete': function(e) {
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
