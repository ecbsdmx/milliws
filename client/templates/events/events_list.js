
Template.eventsList.rendered = function() {
  // var $chkDiv = $('<div class="checkbox">');
  // var $input = $('<input type="checkbox">');
  
  // $input.attr("data-toggle", "toggle");
  // $input.attr("data-width", 100);
  // $input.attr("data-size", "small");
  // $input.attr("data-offstyle", "primary");
  // $input.attr("data-off", "All");
  // $input.attr("data-onstyle", "danger");
  // $input.attr("data-on", "Errors");

  // $input.attr("id", "problematicToggle");
  // $chkDiv.append($input);

  // var $buttonDiv = $('#tableButton');
  // $buttonDiv.append("Display: ").append($chkDiv);
  // $buttonDiv.addClass("text-right");
  
  // Meteor.defer(function() {
  //   $('input[type=checkbox]').bootstrapToggle();
  //   $input.change(function() {
  //     var isProblematic = $(this).prop('checked');
  //     Session.set("showProblematicOnly", isProblematic);
  //   });
  // })
}

Template.eventsList.helpers({
  // selector: function() {
  //   var isProblematic = Session.get("showProblematicOnly");
  //   return isProblematic? {isProblematic: true} : {};
  // },
  paginationElems: function() {
    var numEvt = EventsCount.findOne().count;
    var elems = [];
    var index = 0;
    for (var i=0;i<numEvt;i+=10) {
      elems[index] = {offset: i, page: index + 1};
      index++;
    }
    return elems;
  }

});

var pos =0;
Template.eventsList.events({
  // 'click .nextEvents': function (e) {
  //   e.preventDefault();
  //   e.stopImmediatePropagation();

  //   //force client-side collection cleanup first than load next block
  //   pos += 10;
  //   Tracker.autorun(function() {
  //     Meteor.subscribe('events', pos);
  //   });
  // }
});