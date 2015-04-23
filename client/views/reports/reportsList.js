Template.reportsList.helpers({
  eventStats: function() {
    return EventStats.find({}, {sort: {_id: 1}});
  },

  filteredEventStats: function() {
    if (!Session.get("SelectedEventsStats")) {
      var events = EventStats.find({}, {sort: {_id: 1}, fields: {_id: 1}});
      var selectedEvents = [];
      events.forEach(function(element){
        selectedEvents.push(element._id);
      });
      Session.set("SelectedEventsStats", selectedEvents);
    }
    
    if(!Session.get("SelectedBreakdown")){
      Session.set("SelectedBreakdown","rtBreakdown");
    }

    return EventStats.find({_id: {$in: Session.get("SelectedEventsStats")}}, {sort: {_id: 1}});
  },

  breakDownIsChecked: function(breakdown){
    return isSelectedBreakDown(breakdown) ? "checked" : "";
  },
  breakDownIsActive: function(breakdown){
    return isSelectedBreakDown(breakdown) ? "active" : "";
  },
});


Template.reportsList.events({
   'click .breakdown .btn': function(e){
      e.preventDefault();
      Session.set("SelectedBreakdown", e.currentTarget.id);
   }
});



var isSelectedBreakDown = function(breakdown) {
  return Session.equals("SelectedBreakdown", breakdown);
}


