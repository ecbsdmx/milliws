Events = new Mongo.Collection('events');

Meteor.methods({
  countFilteredEvents: function(filterOptions) {
    return Events.find(parseFilterOptions(filterOptions)).count();
  },
  eventInsert: function(job, status, rt, series, obs, contentSize) {
    checkPermissions();
    var event = {
      jobId: job._id,
      url: job.url,
      etime: new Date(),
      status: status,
      responseTime: rt,
      ert: job.ert,
      deltas: job.deltas,
      isActive: true,
      isProblematic: !((status === 200 || status === 304 || (status === 404 && job.deltas)) && rt <= job.ert),
      series: series,
      observations: obs,
      size: contentSize
    };
    var id = Events.insert(event);
    return {
      _id: id
    };
  }
});

var checkPermissions = function() {
  if (Meteor.isClient) {
    throw new Meteor.Error(403);
  }
};

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