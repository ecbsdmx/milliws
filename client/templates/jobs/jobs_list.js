Template.jobsList.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
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
  'click #suspendAll': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.forEach(function(item) {
      item.isActive = false;
      Meteor.call('jobUpdate', item, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        if (result.urlExists) {
          return alert('There is already a monitoring job for the supplied URL.');
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
        if (result.urlExists) {
          return alert('There is already a monitoring job for the supplied URL.');
        }
      });
    });
  },

  'click tr': function (e) {
    var dataTable = $(e.target).closest('table').DataTable();
    var rowData = dataTable.row(e.currentTarget).data();
    e.preventDefault();
    toggleChevron(rowData._id);
  },

  'click .jobs .suspend': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.isActive = false;
    Meteor.call('jobUpdate', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
      if (result.urlExists) {
        return alert('There is already a monitoring job for the supplied URL.');
      }
    });
  },
  'click .jobs .resume': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.isActive = true;
    Meteor.call('jobUpdate', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
      if (result.urlExists) {
        return alert('There is already a monitoring job for the supplied URL.');
      }
    });
  },
  'click .jobs .edit': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    Router.go('jobEdit', {_id: this._id});
  },
  'click .jobs .delete': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (confirm("Are you sure you want to delete this monitoring job?")) {
      this.isDeleted = true;
      Meteor.call('jobUpdate', this, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        Router.go('jobsList');
      });
    }
  }  
});


function toggleChevron(id) {
  var chevronId = "#chevron_" + id;
  var detailId = "#detail_" + id;

  $(detailId).toggleClass("in");

  if($(chevronId).hasClass( "fa-chevron-down" )) {
    $(chevronId).removeClass("fa-chevron-down").addClass("fa-chevron-up");
  } else {
    $(chevronId).removeClass("fa-chevron-up").addClass("fa-chevron-down");
  }
}

