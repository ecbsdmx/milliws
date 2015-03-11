Events = new Mongo.Collection('events');
EventsStatPerJob = new Mongo.Collection('eventsStatPerJob');

Events.allow({
  remove: function(userId, job) {
    return !! userId;
  }
});

/* Aggregation & map reduce */
/*
// @see http://www.infoq.com/articles/implementing-aggregation-functions-in-mongodb
db.system.js.save( { _id : "Variance" ,
value : function(key,values)
{
    var squared_Diff = 0;
    var mean = Avg(key,values);
    for(var i = 0; i < values.length; i++)
    {
        var deviation = values[i] - mean;
        squared_Diff += deviation * deviation;
    }
    var variance = squared_Diff/(values.length);
    return variance;
  }});*/



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
    };
    EventsStatPerJob.remove({});
    results.forEach(function(element, index, array) {
      EventsStatPerJob.insert(element);
    });
  }
});
