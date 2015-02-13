Template.jobItem.events({
  'click #chevron': function(e) {
    var id = "#chevron_" + this._id;
    if($(id).hasClass( "fa-chevron-down" )) {
      $(id).removeClass("fa-chevron-down").addClass("fa-chevron-up");
    } else {
      $(id).removeClass("fa-chevron-up").addClass("fa-chevron-down");
    }
  }
});