/**
 * Jobs represent the monitoring queries run by Heimdallr on a regular basis.
 *
 * The queries must comply with the SDMX 2.1 RESTful API.
 */
Jobs = new Mongo.Collection('jobs');

Meteor.methods({
  jobInsert: function(job) {
    checkPermissions();
    enrichJob(job);
    checkOwnership(job);
    validateJob(job);
    checkUniqueness(job);
    Jobs.insert(job);
    return {
      _id: job._id
    };
  },
  jobUpdate: function(job) {
    checkPermissions();
    checkOwnership(job);
    validateJob(job);
    checkReadOnlyFields(job);
    Jobs.update({_id: job._id}, job);
    return {
      _id: job._id
    }
  },
  jobRecoverDeleted: function(jobId) {
    checkPermissions();
    check(jobId, String);
    var result = Jobs.update({_id: jobId, owner: this.userId}, {$set:{isDeleted: false}});
    if (0 < result) {
      Events.update({jobId: jobId}, {$set:{isActive: true}}, { multi: true });
    }
  },
  jobVirtualDelete: function(jobId) {
    checkPermissions();
    check(jobId, String);
    var result = Jobs.update({_id: jobId, owner: this.userId}, {$set:{isDeleted: true}});
    if (0 < result) {
      Events.update({jobId: jobId}, {$set:{isActive: false}}, { multi: true });
    }
  },
  jobPhysicalDelete: function(jobId) {
    checkPermissions();
    check(jobId, String);
    var result = Jobs.remove({_id: jobId, owner: this.userId});
    if (0 < result) {
      Events.remove({jobId: jobId});
    }
  }
});

// Validators
var validUrl = new RegExp("^(https?:\/\/)?([a-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/.*data\/(([a-z0-9_@$\-]+)|(([a-z][a-z0-9_\-]*(\.[a-z][a-z0-9_\-]*)*)(\,[a-z0-9_@$\-]+)(\,(latest|([0-9]+(\.[0-9]+)*)))?))\/?(([a-z0-9_@$\-]+([+][a-z0-9_@$\-]+)*)?([.]([a-z0-9_@$\-]+([+][a-z0-9_@$\-]+)*)?)*)\/?(([a-z][a-z0-9_\-]*(\.[a-z][a-z0-9_\-]*)*\,)?([a-z0-9_@$\-]+))\/?[\?]?(.*)$","gi");

var nCNameIDType = new RegExp("[A-Za-z][A-Za-z0-9_\-]*");

var IsUrl = Match.Where(function(x) {
  check(x, String);
  validUrl.lastIndex = 0;
  return validUrl.test(x);
});

var validFormats = ["sdmx-compact-2.1", "sdmx-generic-2.1", "sdmx-json-1.0.0"];
var IsSdmxFormat = Match.Where(function(x) {
  check(x, String);
  return -1 < validFormats.indexOf(x);
});

var IsGreaterThanZero = Match.Where(function(x) {
  check(x, Number);
  return 0 < x;
});

var NonEmptyString = Match.Where(function(x) {
  check(x, String);
  return 0 < x.length;
});

var IsNCNameIDType = Match.Where(function(x) {
  check(x, String);
  nCNameIDType.lastIndex = 0;
  return nCNameIDType.test(x);
});

var validateJob = function(job) {
  check(job, {
    _id: IsNCNameIDType,
    name: NonEmptyString,
    ert: IsGreaterThanZero,
    freq: IsGreaterThanZero,
    isDeleted: Boolean,
    isActive: Boolean,
    deltas: Boolean,
    isCompressed: Boolean,
    isIMS: Boolean,
    format: IsSdmxFormat,
    creationDate: Date,
    url: IsUrl,
    owner: String
  });
};

var checkPermissions = function() {
  if (!(Roles.userIsInRole(Meteor.user(), 'job-creator'))) {
    throw new Meteor.Error(403);
  }
};

var checkOwnership = function(job) {
  if (job.owner !== Meteor.userId()) {
    throw new Meteor.Error(403);
  }
};

var enrichJob = function(job) {
  job.creationDate = new Date();
  job.isDeleted = false;
  job.isActive = true;
  job.owner = Meteor.userId();
};

var checkUniqueness = function(job) {
  var idTaken = Jobs.findOne({_id: job._id});
  if (idTaken) {
    throw new Meteor.Error("job-id-taken", job._id + " is already taken");
  }
};

var checkReadOnlyFields = function(job) {
  var storedJob = Jobs.findOne({_id: job._id});
  if (storedJob.creationDate.toISOString() !== job.creationDate.toISOString()) {
    throw new Meteor.Error("read-only-field", "creationDate cannot be updated");
  }
}
