EventStats = new Mongo.Collection('eventstats');

Meteor.methods({
  updateEventStats: function () {
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
      //, { $out: "eventstats" }
    }]);
    EventStats.remove({});
    results.forEach(function(element, index, array) {
      EventStats.insert(element);
    });
  }
});
