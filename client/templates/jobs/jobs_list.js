Template.jobsList.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
  $('.form-horizontal').validator();
  /*
  FIXME: detail row also sorted but should not
    $("#jobsTable").tablesorter({
    headers: {
      2:{sorter: false}
    }
  }); */
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
  /* Actions on all JOBS */
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
    if (confirm("Are you sure you want to delete all monitoring job? They can still be recovered later, if you change your mind. This will also hide all in the events view.")) {
      this.forEach(function(item) {
        item.isDeleted = true;
        Meteor.call('jobUpdate', item, function(error, result) {
          if (error) {
            return alert(error.reason);
          }
        });
      });
    }
  },

  /* Actions on individual JOB (-line) */
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
    var $detailRow = $('#jobDetailRow_' + this._id);
    var $editRow = $('#jobEditRow_' + this._id);
    $detailRow.removeClass("displayRow");
    $editRow.toggleClass("displayRow");
  },

  /* Whole JOB row click to toggle details */
  'click tr.jobHeaderRow': function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var $detailRow = $('#jobDetailRow_' + this._id);

    // prevent showing details when in edit mode and clicking on the job row header
    var $editRow = $('#jobEditRow_' + this._id);
    if ($editRow.hasClass("displayRow")) { return; }

    $detailRow.toggleClass("displayRow");

    //-- toggle chevron class
    var chevronId = "#chevron_" + this._id;
    if($(chevronId).hasClass( "fa-chevron-down")) {
      $(chevronId).removeClass("fa-chevron-down").addClass("fa-chevron-up");
    } else {
      $(chevronId).removeClass("fa-chevron-up").addClass("fa-chevron-down");
    }
  },

  /* JOB edition actions */
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

function trimUrl(url, size) {
  var curLen = url.length;
  if (size < curLen) {
    shortUrl = url.substr(0, size);
    return shortUrl + "...";
  }
  return url;
}