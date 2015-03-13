Template.eventsList.rendered = function() {
  var $chkDiv = $('<div class="checkbox">');
  var $input = $('<input type="checkbox">');
  
  $input.attr("data-toggle", "toggle");
  $input.attr("data-width", 100);
  $input.attr("data-size", "small");
  $input.attr("data-offstyle", "primary");
  $input.attr("data-off", "All");
  $input.attr("data-onstyle", "danger");
  $input.attr("data-on", "Errors");

  $input.attr("id", "problematicToggle");
  $chkDiv.append($input);

  var $buttonDiv = $('#tableButton');
  $buttonDiv.append("Display: ").append($chkDiv);
  $buttonDiv.addClass("text-right");
  
  Meteor.defer(function() {
    $('input[type=checkbox]').bootstrapToggle();
    $input.change(function() {
      var isProblematic = $(this).prop('checked');
      Session.set("showProblematicOnly", isProblematic);
    });
  })
};
Template.eventsList.helpers({
  selector: function() {
    var isProblematic = Session.get("showProblematicOnly");
    return isProblematic? {isProblematic: true} : {};
  },
  singleEvent: function() {
    return Events.findOne({});
  }
});

