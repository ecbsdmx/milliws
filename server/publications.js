Meteor.publish('jobs', function() {
    return Jobs.find( { isDeleted: false } );
});

Meteor.publish('events', function() {
    var date = new Date();
    date.setDate(date.getDate() - 2);
    return Events.find({etime: {$gte: date}});
});