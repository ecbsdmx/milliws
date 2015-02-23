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
  'click .jobs .suspend': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.isActive = false;
    Meteor.call('jobUpdate', this, function(error, result) {
      if (error) {
        return alert(error.reason);
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
    });
  },
  'click .jobs .edit': function(e) {
    e.preventDefault();
    var $detailRow = $('#jobEditRow_' + this._id);
    $detailRow.toggleClass("displayRow");
  },
  
  'click tr.jobHeaderRow': function (e) {
    e.preventDefault();
    var $detailRow = $('#jobDetailRow_' + this._id);
    $detailRow.toggleClass("displayRow");

    //-- toggle chevron class
    var chevronId = "#chevron_" + this._id;
    if($(chevronId).hasClass( "fa-chevron-down")) {
      $(chevronId).removeClass("fa-chevron-down").addClass("fa-chevron-up");
    } else {
      $(chevronId).removeClass("fa-chevron-up").addClass("fa-chevron-down");
    }
  },

  'click #jobModifSubmit': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var dataTable = $(e.target).closest('table').DataTable();
    var tr = $(e.target).closest('tr').prev();
    var row = dataTable.row(tr);
    var rowData =row.data();
    var formId = "#editForm_" + rowData._id;
    Router.go('jobsList');
    var valid = true;
    $(formId).find('input').each(function(){
      if (!this.checkValidity()) {
        valid = false;
      }
    });
    console.log(valid);
    if (valid) {
      var job = {
        _id: rowData._id,
        //TODO: add name prop again
        //name: $("#inputName").val(),
        name: rowData.name,
        url: $(formId + " #inputURL").val(),
        ert: parseInt($(formId + " #inputERT").val()),
        freq: parseInt($(formId + " #inputFreq").val()),
        isDeleted: rowData.isDeleted,
        isActive: rowData.isActive,
        deltas: rowData.deltas,
        isCompressed: rowData.isCompressed,
        isIMS: rowData.isIMS,
        format: rowData.format
      };
      Meteor.call('jobUpdate', job, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        Router.go('jobsList');
      });
    }
  },

  'click #jobModifCancel': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    // reset values to rowData !!!
    var dataTable = $(e.target).closest('table').DataTable();
    var tr = $(e.target).closest('tr').prev();
    var row = dataTable.row(tr);
    var rowData =row.data();
    $("#inputURL").val(rowData.url);
    $("#inputERT").val(rowData.ert);
    $("#inputFreq").val(rowData.freq);

    $(e.target).closest('.jobsDetail').toggleClass("edit");
  },

  'click .jobs .delete': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (confirm("Are you sure you want to delete this monitoring job? It can still be recovered later, if you change your mind. This will also hide the events related to that job in the events view.")) {
      this.isDeleted = true;
      Meteor.call('jobVirtualDelete', this, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        Router.go('jobsList');
      });
    }
  }  
});

function toggleChevron(e) {
  // update the chevron icon
  var chevronId = "#chevron_" + rowData._id;
  if($(chevronId).hasClass( "fa-chevron-down")) {
    $(chevronId).removeClass("fa-chevron-down").addClass("fa-chevron-up");
  } else {
    $(chevronId).removeClass("fa-chevron-up").addClass("fa-chevron-down");
  }
}


function trimUrl(url, size) {
  var curLen = url.length;
  if (size < curLen) {
    shortUrl = url.substr(0, size);
    return shortUrl + "...";
  }
  return url;
}