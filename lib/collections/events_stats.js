EventsStatPerJob = new Mongo.Collection('eventsStatPerJob');

Meteor.methods({
  updateEventsStats: function () {
    //FIXME after upgrade to Mongo 2.6
    var results = Events.aggregate( [
      { $match: {} },
      { $group: {
        _id: "$jobId",
        max: {$max: "$responseTime"},
        avg: {$avg: "$responseTime"},
        count: {$sum: 1},
        min: {$min: "$responseTime"}
      }
      //, { $out: "eventsStatPerJob" }
    }]);
    EventsStatPerJob.remove({});
    results.forEach(function(element, index, array) {
      EventsStatPerJob.insert(element);
    });
  }
});
