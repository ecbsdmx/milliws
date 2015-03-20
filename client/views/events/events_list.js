Template.eventsList.rendered = function() {
  $('#problematicToggle').bootstrapToggle();
}

Template.eventsList.helpers({
  totalEventCount: function() {
    return EventsCount.findOne().count;
  },
  eventsStart: function() {
    var from = Session.get("EventsFromCount");
    return from;
  },
  eventsEnd: function() {
    var from = Session.get("EventsFromCount");
    return from + Events.find().count();
  },
  isLastPage: function() {
    var from = Session.get("EventsFromCount");
    var max = EventsCount.findOne().count;
    return from === (max - 10)?{class: "disabled"}:{};
  },

  isFirstPage: function() {
    var from = Session.get("EventsFromCount");
    return from === 0?{class: "disabled"}:{};
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
  },
  isSorted: function(sortFieldName) {
    var sortingClass="sorting_poss";
    var sorting = Session.get("eventsSorting");
    if ((typeof sorting != 'undefined') && (sortFieldName === sorting.by)) {
      sortingClass = sorting.order === -1?"sorting_desc":"sorting_asc";
    }
    return sortingClass;
  },
  showProblematicOnly: function() {
    var tog = Session.get("showProblematicOnly");
    if (typeof tog == 'undefined'){
      tog = false;
    }
    return tog?{checked:"checked"}:"";
  }
});

Template.eventsList.events({
  'change #problematicToggle': function(e) {
    var isProblematic = $(e.currentTarget).prop('checked');
    console.log("showProblematicOnly: " + isProblematic);
    Session.set("showProblematicOnly", isProblematic);
  },
  'click .sortByJobId': function(e) {
    e.preventDefault();
    triggerSort("jobId");
  },
  'click .sortByETime': function(e) {
    e.preventDefault();
    triggerSort("etime");
  },
  'click .sortByStatus': function(e) {
    e.preventDefault();
    triggerSort("status");
  },
  'click .sortByResponseTime': function(e) {
    e.preventDefault();
    triggerSort("responseTime");
  },
  'click .sortBySeries': function(e) {
    e.preventDefault();
    triggerSort("series");
  },
  'click .sortByObservations': function(e) {
    e.preventDefault();
    triggerSort("observations");
  },
  'click .sortBySize': function(e) {
    e.preventDefault();
    triggerSort("size");
  },
  'click .firstEvents': function (e) {
    e.preventDefault();
    Router.go("eventsList" , {fromCount: 0});
  },
  'click .previousEvents': function (e) {
    e.preventDefault();
    var from = Session.get("EventsFromCount");
    Router.go("eventsList" , {fromCount: (from >= 10)?(from-10):0});
  },
  'click .nextEvents': function (e) {
    e.preventDefault();
    var from = Session.get("EventsFromCount");
    var max = EventsCount.findOne().count;
    Router.go("eventsList" , {fromCount: (from + 10 <= max-10)?(from+10):(max-10)});
  },
  'click .lastEvents': function (e) {
    e.preventDefault();
    Router.go("eventsList" , {fromCount: (EventsCount.findOne().count - 10 )});
  }
});

var triggerSort = function(sortField) {
  var sorting = Session.get("eventsSorting");
  if (typeof sorting == 'undefined') {
    sorting = {by: sortField, order: 1};
    Session.set("eventsSorting", sorting);
  }
  if (sorting.by === sortField) {
    sorting.order === 1?sorting.order=-1:sorting.order=1;
  }
  else {
    sorting.by = sortField
  }
  Session.set("eventsSorting", sorting);
};
