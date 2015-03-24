var debug = Meteor.npmRequire("debug")("loki:publication");

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

Meteor.publish("eventsCount", function(filterOptions) {
  var self = this;
  var count = 0;
  var initializing = true;
  var handle = Events.find(parseFilterOptions(filterOptions)).observeChanges({
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


Meteor.publish("events", function(from, sortOptions, filterOptions) {
  //FIXME do some checks on the parameters
  var self = this;
  var count = 10;
  var max = Events.find({}).count();
  var actualFrom = max > count?Math.min(from, max - count):from;
  
  // //FIXME remove - for DEBUG only
  // filterOptions = {
  //   jobId: {op: "nin", val: "fat"},
  //   status: {op: "in", val: "200"},
  //   observations: {op: "rg", val: "100 1000"}
  // };

  var filterOpt = {};
  filterOpt = parseFilterOptions(filterOptions);
  debug("filterOpt: %j", filterOpt);

  var handle = Events.find(
    filterOpt, 
    {
      sort: sortOptions, 
      limit: count, 
      skip: actualFrom, 
      fields: {jobId:1,etime:1,deltas:1,isProblematic:1,status:1,series:1,observations:1,ert:1,responseTime:1,size:1}
    }
  ).observeChanges({
    added: function (id, fields) {
      var jobStats = EventStats.findOne({_id: fields.jobId}, {fields: {avg:1}});
      fields.avg = jobStats?jobStats.avg:0;
      self.added('events', id, fields);
    },
    changed: function (id, fields) {
      self.changed('events', id, fields);
    },
    removed: function (id) {
      var theEventJobId = Events.findOne({_id: id}, {fields: {jobId:1}}).jobId;
      var jobStats = EventStats.findOne({_id: theEventJobId}, {fields: {avg:1}});
      if (jobStats) {
        jobStats[id] && jobStats[id].stop();
      }
      self.removed('events', id);
    }
  });
  self.ready();
  self.onStop(function() { handle.stop(); });
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

var parseFilterOptions = function(filterOptions) {
  var andArr = [];
  if (typeof filterOptions != "undefined") {
    _.each(filterOptions, function(value, key, list) {
      if (key !== "isProblematic") {
        _.each(getFiltersForOp(key, value), function(value, key, list) {
          andArr.push(value);
        });
      }
      else {
        andArr.push({key:value});
      }
    });//each
    return {$and: andArr};
  }
  return {};
};

var getFiltersForOp = function(field, filterObj) {
  var op = filterObj.op;
  var val = filterObj.val;
  var filters = [];
  switch(op) {
    case "nin":
      if (field === 'status') {
        var filt = {};
        var valArr = _.map(val.split(" "), function(v) {return parseInt(v);});
        filt[field] = {$nin: valArr};
        filters.push(filt);
      }
      else {
        // NB : "value",  $nin cannot be used since w want do partial matches of strings
        // ATT: Furthermore $not does not work with $regex... /xxx/ should be used instead 
        // @see http://docs.mongodb.org/manual/reference/operator/query/not/
        // e.g.: {jobId: {$nin: ['dexr','m1']}} => {"$and":[{"jobId":{"$not":/dexr/,"$options":"i"}},{"jobId":{"$not":/m1/,"$options":"i"}}
        var grp = [];
        var valArr = val.split(" ");
        _.each(valArr, function(value, key, list) {
          var filt = {};
          filt[field] = {"$not": new RegExp(value)};
          grp.push(filt);
        });
        filters.push({$and: grp});      
      }
      debug("nin: %j", filters);
    break;
    case "in":
      if (field === 'status') {
        var filt = {};
        var valArr = _.map(val.split(" "), function(v) {return parseInt(v);});
        filt[field] = {$in: valArr};
        filters.push(filt);
      }
      else {
        // NB $in cannot be used since w want do partial matches of strings
        // e.g.: {jobId: {$in: ['dexr','m1']}} => {"$or":[{"jobId":{"$regex":"dexr","$options":"i"}},{"jobId":{"$regex":"m1","$options":"i"}}
        var grp = [];
        var valArr = val.split(" ");
        _.each(valArr, function(value, key, list) {
          var filt = {};
          filt[field] = {$regex: value, $options: 'i'};
          grp.push(filt);
        });
        filters.push({$or: grp});    
      }  
      debug("in: %j", filters);
    break;
    case "gte":
      // e.g.:  {observations: {$gte: 1500}}
      var obj = {};
      obj[field] ={$gte: parseInt(val)};
      filters.push(obj);
      debug("gte: %j", filters);
    break;
    case "lte":
      // e.g.:  {observations: {$lte: 1500}}
      var obj = {};
      obj[field] ={$lte: parseInt(val)};
      filters.push(obj);
      debug("lte: %j", filters);
    break;
    case "rg":
      // e.g.:  {observations: {$gte: 1500}}
      // e.g.:  {observations: {$lte: 1500}}
      valArr = val.split(" ");
      var obj = {};
      obj[field] ={$gte: parseInt(valArr[0])};
      filters.push(obj);
      obj = {};
      obj[field] ={$lte: parseInt(valArr[1])};
      filters.push(obj);
      debug("rg: %j", filters);
    break;
  }
  return filters;
};

/**
 * events filter
// NB for ALL: pas besoin de equal, not equal because we have the in/not in !!!
var jobIdContains = db.events.find({jobId: {$regex: 'exr', $options: 'i'}}).sort({etime: 1});
var jobIdIn = db.events.find({jobId: {$in: ['dexr-comp','icp-fat']}}).sort({etime: 1});
var jobIdNotIn = db.events.find({jobId: {$nin: ['dexr-comp','icp-fat']}}).sort({etime: 1});

var statusEqual = db.events.find({status: 404}).sort({etime: 1});
var statusNotEqual = db.events.find({status: {$ne: 404}}).sort({etime: 1});
var statusIn = db.events.find({status: {$in: [404,200]}}).sort({etime: 1});
var statusNotIn = db.events.find({status: {$nin: [200]}}).sort({etime: 1});

var etimeRange = db.events.find({$and: [
    {etime: {$gte: new ISODate("2015-03-19 22:00:00.000+01:00")}},
    {etime: {$lte: new ISODate("2015-03-19 23:00:00.000+01:00")}}
]}).sort({etime: -1});

var responseTimeBetween = db.events.find({$and: [
    {responseTime: {$gte: 250}},
    {responseTime: {$lte: 300}}
]}).sort({responseTime: 1},{etime: -1});

var seriesBetween = db.events.find({$and: [
    {series: {$gte: 1}},
    {series: {$lte: 3}}
]}).sort({etime: -1});

var observationsBetween = db.events.find({$and: [
    {observations: {$gte: 2000}},
    {observations: {$lte: 15000}}
]}).sort({etime: -1});
observationsBetween



var comb = db.events.find({$and: [
    {observations: {$gte: 1500}},
    {observations: {$lte: 15000}},
    {jobId: {$in: ['dexr-comp','dexr-json','m1m3']}},
    {responseTime: {$gte: 500}},
    {responseTime: {$lte: 550}},
    {series: {$gte: 4}},
]}).sort({etime: -1});
comb


 */