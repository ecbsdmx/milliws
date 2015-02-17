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
    e.preventDefault();
    toggleChevron(e);
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

function toggleChevron(e) {
  var dataTable = $(e.target).closest('table').DataTable();
  var tr = $(e.target).closest('tr');
  var row = dataTable.row(tr);
  var rowData =row.data();

  if (row.child.isShown() ) {
    row.child.hide();
    tr.removeClass('shown');
  }
  else {
    row.child(format(rowData) ).show();
    tr.addClass('shown');
  }

  // update the chevron icon
  var chevronId = "#chevron_" + rowData._id;
  if($(chevronId).hasClass( "fa-chevron-down" )) {
    $(chevronId).removeClass("fa-chevron-down").addClass("fa-chevron-up");
  } else {
    $(chevronId).removeClass("fa-chevron-up").addClass("fa-chevron-down");
  }
}

function format (rowData) {
  return '<div class="jobsDetail row">' + 
    '<div class="jobsDetailHeader col-xs-6 col-sm-4 col-md-2">' + 
    'SDMX 2.1 RESTful query' + 
    '</div>' + 
    '<div class="jobsDetailValue col-xs-6 col-sm-8 col-md-10">' + 
    '<a href="'+rowData.url+'">'+rowData.url+'</a>' + 
    '</div>' + 
    '</div>' + 
    '' + 
    '<div class="row">' + 
    '<div class="jobsDetailHeader col-xs-6 col-sm-4 col-md-2">' + 
    'Expected response time' + 
    '</div>' + 
    '<div class="jobsDetailValue col-xs-6 col-sm-8 col-md-10">' + 
    ''+rowData.ert+' milliseconds' + 
    '</div>' + 
    '</div>' + 
    '' + 
    '<div class="row">' + 
    '<div class="jobsDetailHeader col-xs-6 col-sm-4 col-md-2">' + 
    'Job frequency' + 
    '</div>' + 
    '<div class="jobsDetailValue col-xs-6 col-sm-8 col-md-10">' + 
    'Every '+rowData.freq+' minute(s)' + 
    '</div>' + 
    '</div>';
}
