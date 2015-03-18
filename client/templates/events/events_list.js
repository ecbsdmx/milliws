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
  totalEventCount: function() {
    return EventsCount.findOne().count;
  },
  eventsStart: function() {
    var from = Session.get("EventsFromCount");
    return from;
  },
  eventsEnd: function() {
    var from = Session.get("EventsFromCount");
    return from + 10;
  },
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

Template.eventsList.events({
  'click .firstEvents': function (e) {
    e.preventDefault();
    Router.go("eventsList" , {fromCount: 0});
  },
  'click .previousEvents': function (e) {
    e.preventDefault();
    var from = Session.get("EventsFromCount");
    if (from >= 10) {
      Router.go("eventsList" , {fromCount: (from - 10)});
    }
  },
  'click .nextEvents': function (e) {
    e.preventDefault();
    var from = Session.get("EventsFromCount");
    if (from+10 < EventsCount.findOne().count) {
      Router.go("eventsList" , {fromCount: (from + 10)});
    }
  },
  'click .lastEvents': function (e) {
    e.preventDefault();
    Router.go("eventsList" , {fromCount: (EventsCount.findOne().count - 10 )});
  }
});