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
      //Would be better to do the work below using the aggregation pipeline
      element.countProb = Events.find({jobId: element._id, isProblematic: true}).count();
      EventStats.insert(element);
    });
  }
});
