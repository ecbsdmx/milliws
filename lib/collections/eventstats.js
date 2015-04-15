EventStats = new Mongo.Collection('eventStats');

Meteor.methods({
  updateEventStats: function () {
    var results = Events.aggregate([
      { $sort: {etime: 1} },
      { $match: {} },
      {
        $group: {
          _id: "$jobId",
          max: {$max: "$responseTime"},
          avg: {$avg: "$responseTime"},
          count: {$sum: 1},
          min: {$min: "$responseTime"},
          last: {$last: "$etime"},
          first: {$first: "$etime"},
          lastProb: {$last: "$isProblematic"}
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
