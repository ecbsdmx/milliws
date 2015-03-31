EventStats = new Mongo.Collection('eventStats');

Meteor.methods({
  updateEventStats: function () {
    /*var results = Events.aggregate( [
      { $match: {} },
      {
        $group: {
          _id: "$jobId",
          max: {$max: "$responseTime"},
          avg: {$avg: "$responseTime"},
          count: {$sum: 1},
          min: {$min: "$responseTime"}
        }
      },
      { $out: "eventStats" }
    ]);*/
    var results = Events.aggregate([
      { $match: {} },
      {
        $group: {
          _id: "$jobId",
          max: {$max: "$responseTime"},
          avg: {$avg: "$responseTime"},
          count: {$sum: 1},
          min: {$min: "$responseTime"}
        }
      //, { $out: "eventstats" }
      }
    ]);
    EventStats.remove({});
    results.forEach(function(element, index, array) {
      EventStats.insert(element);
    });
  }
});
