Meteor.publish('jobs', function() {
  return Jobs.find({isDeleted: false});
});

Meteor.publish('recycledJobs', function() {
  return Jobs.find({isDeleted: true});
});

Meteor.publish('events', function() {
  var date = new Date();
  date.setDate(date.getDate() - 2);
  return Events.find({etime: {$gte: date}}, {sort:{etime: -1}, fields: {jobId:1,etime:1,series:1,observations:1,ert:1, responseTime:1}});
});

Meteor.publish("eventsCount", function() {
  var self = this;
  var count = 0;
  var initializing = true;
  var handle = Events.find({}).observeChanges({
    added: function (id) {
      count++;
      if (!initializing)
        self.changed("eventsCount", "countId", {count: count});
    },
    removed: function (id) {
      count--;
      self.changed("eventsCount", "countId", {count: count});
    }
  });
  initializing = false;
  self.added("eventsCount", "countId", {count: count});
  self.ready();

  self.onStop(function () {
    handle.stop();
  });
});

Meteor.publish("eventsWithBulletInfo", function(from) {
  var self = this;
  var count = 10;
  var max = Events.find({}).count();
  var actualFrom = Math.min(from, max - count);

  var handle = Events.find({}, {sort:{etime: -1}, skip: actualFrom, limit: count, fields: {jobId:1,etime:1,series:1,observations:1,ert:1, responseTime:1}}).observeChanges({
    added: function (id, fields) {
      var jobStats = EventStats.findOne({_id: fields.jobId}, {fields: {avg:1}});
      fields.avg = jobStats.avg;
      self.added('eventsWithBulletInfo', id, fields);
    }, 
    changed: function (id, fields) {
      self.changed('eventsWithBulletInfo', id, fields);
    },
    removed: function (id) {
      jobStats[id] && jobStats[id].stop();
      self.removed('eventsWithBulletInfo', id);
    }
  });
  self.ready();
  self.onStop(function() { handle.stop(); });
});

Meteor.publish('eventStats', function() {
  return EventStats.find({});
});

