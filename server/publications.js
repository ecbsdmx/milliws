Meteor.publish('jobs', function() {
  return Jobs.find({isDeleted: false});
});

Meteor.publish('recycledJobs', function() {
  if (Roles.userIsInRole(this.userId, ['job-creator'])) {
    return Jobs.find({$and: [{isDeleted: true}, {owner: this.userId}]});
  } else {
    // user not authorized.
    this.stop();
    return;
  }
});


var numLPad = function(number, length){
  var ns = number.toString();
  if (typeof length == 'undefined') length = 2;
  while(ns.length < length)
    ns = "0" + ns;
  return ns;
}

Meteor.publish("events", function(from, sortOptions, filterOptions) {
  Meteor.call("messageLogDebug", "publish events, from:" + JSON.stringify(from) + ", sortOptions: " + JSON.stringify(sortOptions) + ", filterOptions: " + JSON.stringify(filterOptions), "publication");
  //FIXME do some checks on the parameters
  var self = this;
  var count = 10;
  var filterOpt = {};
  filterOpt = parseFilterOptions(filterOptions);
  //fixme use defaultEventRowCount 'global' (currently client side only) variable
  var max = Events.find(filterOpt, {fields: {'_id':1}}).count();
  var actualFrom = max > count?Math.min(from, max - count):from;

  return Events.find(
    filterOpt,
    {
      sort: sortOptions,
      limit: count,
      skip: actualFrom, //FIXME this might be the expensive bit : see doc
      fields: {jobId:1,etime:1,deltas:1,isProblematic:1,status:1,series:1,observations:1,ert:1,responseTime:1,size:1}
    }
  );
});

Meteor.publish('eventStats', function() {
  return EventStats.find({});
});

Meteor.publish('usersRoles', function() {
  if (Roles.userIsInRole(this.userId, ['bofh'])) {
    return Meteor.users.find({}, {fields: {'_id': 1, 'roles': 1, 'username': 1, 'profile.name': 1, 'createdAt': 1}});
  } else {
    // user not authorized.
    this.stop();
    return;
  }
});
