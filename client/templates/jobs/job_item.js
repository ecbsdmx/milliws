Template.jobItem.rendered = function() {
  $('.detail_'+ this._id).on('shown.bs.collapse', function () {
    $(".chevron").removeClass("fa-chevron-down").addClass("fa-chevron-up");
  });

  $('.detail_'+ this._id).on('hidden.bs.collapse', function () {
    $(".chevron").removeClass("fa-chevron-up").addClass("fa-chevron-down");
  });
};