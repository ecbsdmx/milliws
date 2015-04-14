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

Meteor.publish("evtPerJobPerDate", function() {
  return EvtPerJobPerDate.find({});
});


Meteor.publish("eventsCount", function(filterOptions) {
  debug("in eventsCount pub.");
  var self = this;
  var count = 0;
  var initializing = true;
  var handle = Events.find(parseFilterOptions(filterOptions), {fields: {_id:1}}).observeChanges({
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
  debug("in events pub.");
  //FIXME do some checks on the parameters
  var self = this;
  var count = 10;
  //fixme use defaultEventRowCount 'global' (currently client side only) variable
  var max = Events.find({}).count();
  var actualFrom = max > count?Math.min(from, max - count):from;

  var filterOpt = {};
  filterOpt = parseFilterOptions(filterOptions);

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
  if (typeof filterOptions != "undefined" && Object.keys(filterOptions).length > 0) {
    _.each(filterOptions, function(value, key, list) {
      if (key !== "isProblematic") {
        _.each(getFiltersForOp(key, value), function(value, key, list) {
          andArr.push(value);
        });
      }
      else {
        var filt = {};
        filt[key] = value;
        andArr.push(filt);
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
    break;
    case "gte":
      if (field === 'etime') {
        var obj = {};
        obj[field] ={$gte: moment(val).toDate()};
        filters.push(obj);
      }
      else {
        var obj = {};
        obj[field] ={$gte: parseInt(val)};
        filters.push(obj);
      }
      debug("gte: %j", filters);
    break;
    case "lte":
      if (field === 'etime') {
        var obj = {};
        obj[field] ={$lte: moment(val).toDate()};
        filters.push(obj);
      }
      else {
        var obj = {};
        obj[field] ={$lte: parseInt(val)};
        filters.push(obj);
      }
    break;
    case "rg":
      valArr = val.split(" ");
      if (field === 'etime') {
        var obj = {};
        obj[field] ={$gte: moment(valArr[0]).toDate()};
        filters.push(obj);

        obj = {};
        obj[field] ={$lte: moment(valArr[1]).toDate()};
        filters.push(obj);
      }
      else {
        var obj = {};
        obj[field] ={$gte: parseInt(valArr[0])};
        filters.push(obj);

        obj = {};
        obj[field] ={$lte: parseInt(valArr[1])};
        filters.push(obj);
      }
    break;
  }
  return filters;
};
