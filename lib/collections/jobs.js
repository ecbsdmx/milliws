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
    validateJob(job);
    checkUniqueness(job);
    Jobs.insert(job);
    return {
      _id: job._id
    };
  },
  jobUpdate: function(job) {
    checkPermissions();
    validateJob(job);
    checkReadOnlyFields(job);
    Jobs.update({_id: job._id}, job);
    return {
      _id: job._id
    }
  },
  jobRecoverDeleted: function(job) {
    job.isActive = true;
    Meteor.call('jobUpdate', job);
    Events.update({jobId: job._id}, {$set:{isActive: true}}, { multi: true });
  },
  jobVirtualDelete: function(job) {
    job.isActive = false;
    Meteor.call('jobUpdate', job);
    Events.update({jobId: job._id}, {$set:{isActive: false}}, { multi: true });
  },
  jobPhysicalDelete: function(job) {
    checkPermissions();
    Jobs.remove(job._id);
    Events.remove({jobId: job._id});
  }
});

// Validators
var validUrl = new RegExp("^(https?:\/\/)?([a-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/.*data\/(([a-z0-9_@$\-]+)|(([a-z][a-z0-9_\-]*(\.[a-z][a-z0-9_\-]*)*)(\,[a-z0-9_@$\-]+)(\,(latest|([0-9]+(\.[0-9]+)*)))?))\/?(([a-z0-9_@$\-]+([+][a-z0-9_@$\-]+)*)?([.]([a-z0-9_@$\-]+([+][a-z0-9_@$\-]+)*)?)*)\/?(([a-z][a-z0-9_\-]*(\.[a-z][a-z0-9_\-]*)*\,)?([a-z0-9_@$\-]+))\/?[\?]?(.*)$","gi");

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

var validateJob = function(job) {
  check(job, {
    _id: NonEmptyString,
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
    url: IsUrl
  });
};

var checkPermissions = function() {
  if (Meteor.isClient &&
    (!Meteor.user() || !Meteor.user().profile.isAdmin)) {
    throw new Meteor.Error(403);
  }
};

var enrichJob = function(job) {
  job.creationDate = new Date();
  job.isDeleted = false;
  job.isActive = true;
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
