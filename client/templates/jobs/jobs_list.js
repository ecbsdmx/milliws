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
    e.stopImmediatePropagation();

    // check if opened else open
    var clickedRow = $(e.target).closest('tr');
    if (!clickedRow.hasClass("shown")) {
      toggleChevron(e);
    }

    // toggle edit mode
    var detailRow = clickedRow.next();
    var jobDetail = detailRow.find(".jobsDetail");

    jobDetail.toggleClass("edit");
    if (jobDetail.hasClass("edit")) {

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
  var dataTable = $(e.target).closest('table').DataTable();
  var tr = $(e.target).closest('tr');
  var row = dataTable.row(tr);
  var rowData =row.data();

  if (rowData !== undefined) {
    if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass('shown');
    }
    else {
      row.child(format(rowData)).show();
      tr.addClass('shown');
    }

    // update the chevron icon
    var chevronId = "#chevron_" + rowData._id;
    if($(chevronId).hasClass( "fa-chevron-down")) {
      $(chevronId).removeClass("fa-chevron-down").addClass("fa-chevron-up");
    } else {
      $(chevronId).removeClass("fa-chevron-up").addClass("fa-chevron-down");
    }
  }
}

function format (rowData) {
  if (rowData === undefined) {
    return "";
  }
  var u = rowData.url;

  return '' + 
    '  <form id="editForm_'+rowData._id+'" class="form-horizontal" role="form">' + 
    '    <div class="jobsDetail container-fluid">' + 
    '      <div class="row">' + 
    '        <div class="jobsDetailHeader col-xs-6 col-sm-4 col-md-2">' + 
    '          SDMX 2.1 RESTful query' + 
    '        </div>' + 
    '        <div class="jobsDetailValue col-xs-6 col-sm-8 col-md-10">' + 
    '          <a href="' + u + '">' + trimUrl(u, 80) + '</a>' + 
    '          <input type="url" name="inputURL" id="inputURL" required aria-required="true" value="' + u + '" data-error="Please define a valid entry point for the web service." pattern="(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/.*data/(([A-Za-z0-9_@$\-]+)|(([A-Za-z][A-Za-z0-9_\-]*(\.[A-Za-z][A-Za-z0-9_\-]*)*)(\,[A-Za-z0-9_@$\-]+)(\,(latest|([0-9]+(\.[0-9]+)*)))?))\/?(([A-Za-z0-9_@$\-]+([+][A-Za-z0-9_@$\-]+)*)?([.]([A-Za-z0-9_@$\-]+([+][A-Za-z0-9_@$\-]+)*)?)*)\/?(([A-Za-z][A-Za-z0-9_\-]*(\.[A-Za-z][A-Za-z0-9_\-]*)*\,)?([A-Za-z0-9_@$\-]+))\/?[\?]?(.*)"/>' + 
    '          <div class="help-block with-errors"></div>' +
    '        </div>' + 
    '      </div>' + 
    '' +
    '      <div class="row">' + 
    '        <div class="jobsDetailHeader col-xs-6 col-sm-4 col-md-2">' + 
    '          Expected response time' + 
    '        </div>' + 
    '        <div class="jobsDetailValue col-xs-6 col-sm-4 col-md-2">' + 
    '          <span>' + rowData.ert + ' milliseconds</span>' + 
    '          <input type="number" name="inputERT" id="inputERT" required aria-required="true" value="' + rowData.ert + '" min="300" max="5000" step="100">' + 
    '        </div>' + 
    '      </div>' + 
    '' +
    '      <div class="row">' + 
    '        <div class="jobsDetailHeader col-xs-6 col-sm-4 col-md-2">' + 
    '          Job frequency' + 
    '        </div>' + 
    '        <div class="jobsDetailValue col-xs-6 col-sm-4 col-md-2">' + 
    '          <span>Every '+rowData.freq+' minute(s)</span>' + 
    '          <input type="number" name="inputFreq" id="inputFreq" required aria-required="true" value="' + rowData.freq + '" min="1" max="60" step="1">' + 
    '        </div>' + 
    '      </div>' + 
    '' +
    '      <div class="row">' + 
    '        <div class="jobsEditButtons col-xs-10 col-sm-10 col-md-10"></div>' + 
    '        <div class="jobsEditButtons col-xs-2 col-sm-2 col-md-2 text-right">' + 
    '          <button type="submit" id="jobModifSubmit" class="btn btn-default btn-xs">Save</button>' + 
    '          <button type="button" id="jobModifCancel" class="btn btn-default btn-xs">Cancel</button>' +
    '        </div>' + 
    '      </div>' + 
    '    </div>' + 
    '  </form>';
}


function trimUrl(url, size) {
  var curLen = url.length;
  if (size < curLen) {
    shortUrl = url.substr(0, size);
    return shortUrl + "...";
  }
  return url;
}