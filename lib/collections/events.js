Events = new Mongo.Collection('events');

Events.allow({
  remove: function(userId, job) {
    return !! userId;
  }
});