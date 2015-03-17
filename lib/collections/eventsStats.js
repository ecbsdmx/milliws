EventsStatPerJob = new Mongo.Collection('eventsStatPerJob');
EventsWithBulletInfo = new Meteor.Collection('eventsWithBulletInfo');
EventsCount = new Meteor.Collection('eventsCount');

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
