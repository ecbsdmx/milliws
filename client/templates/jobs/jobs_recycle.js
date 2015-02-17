Template.jobsRecycle.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobsRecycle.events({
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
    if (confirm("Are you sure you want to delete all these monitoring jobs? They cannot be recovered later on.")) {
      this.forEach(function(item) {
        Jobs.remove(item._id);
      });
    }
  },

  'click tr': function (e) {
    e.preventDefault();
    toggleChevron(e);
  },

  'click .jobsRecycle .undo': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.isDeleted = false;
    Meteor.call('jobRecoverDeleted', this, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },
  'click .jobsRecycle .delete': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (confirm("Are you sure you want to delete this monitoring job? The job cannot be recovered later on. Furthemore, all events recorded for that job will be deleted too! ")) {
      Meteor.call('jobPhysicalDelete', this, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
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
