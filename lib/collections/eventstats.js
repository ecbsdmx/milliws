EventStats = new Mongo.Collection('eventStats');

Meteor.methods({
  updateEventStats: function () {
    console.log("Aggregating jobs...");
    //FIXME after upgrade to Mongo 2.6
    var results = Events.aggregate( [
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
    ]);
    console.log("Aggregating jobs done !");

    // EventStats.remove({});
    // results.forEach(function(element, index, array) {
    //   EventStats.insert(element);
    // });
  }
});
