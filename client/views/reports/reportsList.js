Template.reportsList.onCreated(function(){
  if (!Session.get("SelectedEventsStats")) {
    var events = EventStats.find({}, {sort: {_id: 1}, fields: {_id: 1}});
    var selectedEvents = [];
    events.forEach(function(element){
      selectedEvents.push(element._id);
    });
    Session.set("SelectedEventsStats", selectedEvents);
  }
});


Template.reportsList.helpers({
  eventStats: function() {
    return EventStats.find({}, {sort: {_id: 1}});
  },

  filteredEventStats: function() {
    return EventStats.find({_id: {$in: Session.get("SelectedEventsStats")}}, {sort: {_id: 1}});
  }
});


Template.reportsList.events({
});
