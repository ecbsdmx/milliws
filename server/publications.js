Meteor.publish('jobs', function() {
    return Jobs.find();
});

Meteor.publish('comments', function(jobId) {
    check(jobId, String);
    return Jobs.find({_id: jobId});
});

Meteor.publish('events', function() {
    var date = new Date();
    date.setDate(date.getDate() - 2);
    return Events.find({etime: {$gte: date}});
});