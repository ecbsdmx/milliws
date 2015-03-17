Meteor.publish('jobs', function() {
  return Jobs.find({isDeleted: false});
});

Meteor.publish('recycledJobs', function() {
  return Jobs.find({isDeleted: true});
});


Meteor.publish('events', function(from) {
  var count = 10;
  var max = Events.find({}).count();
  var actualFrom = Math.min(from, max - count);
//  console.log("Max: " + max);
//  console.log("From publish side: " + from);
//  console.log("actualFrom publish side: " + actualFrom);
  return Events.find({}, {sort:{etime: -1}, skip: actualFrom, limit: count});
});

Meteor.publish('eventsStatPerJob', function() {
  return EventsStatPerJob.find();
});