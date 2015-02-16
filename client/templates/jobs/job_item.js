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

Template.jobItem.events({
  'click .jobItemRow': function(e) {
    e.preventDefault();
    toggleChevron(this._id);
  },
  'click .jobItemRow .edit': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    Router.go('jobEdit', {_id: this._id});
  },
  'click .jobItemRow .delete': function(e) {
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