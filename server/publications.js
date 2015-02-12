Meteor.publish('queries', function() {
    return Queries.find();
});

Meteor.publish('comments', function(queryId) {
    check(queryId, String);
    return Queries.find({_id: queryId});
});

Meteor.publish('events', function() {
    var date = new Date();
    date.setDate(date.getDate() - 2);
    return Events.find({etime: {$gte: date}});
});