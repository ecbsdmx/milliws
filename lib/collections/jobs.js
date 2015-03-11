Jobs = new Mongo.Collection('jobs');

Meteor.methods({
  jobInsert: function(jobAttributes) {
    if (Meteor.isClient &&
      (!Meteor.user() || !Meteor.user().profile.isAdmin)) {
      throw new Meteor.Error(403);
    }

    check(jobAttributes, {
      _id: NonEmptyString,
      name: NonEmptyString,
      ert: IsGreaterThanZero,
      freq: IsGreaterThanZero,
      deltas: Boolean,
      isCompressed: Boolean,
      isIMS: Boolean,
      format: IsSdmxFormat,
      url: IsUrl
    });

    var idTaken = Jobs.findOne({_id: jobAttributes._id});
    if (idTaken) {
      throw new Meteor.Error("job-id-taken", jobAttributes._id + " is already taken");
    }

    jobAttributes.creationDate = new Date();
    jobAttributes.isDeleted = false;
    jobAttributes.isActive = true;
    var jobId = Jobs.insert(jobAttributes);
    return {
      _id: jobId
    };
  },
  jobUpdate: function(jobAttributes) {
    if (!Meteor.user() || !Meteor.user().profile.isAdmin) {
      throw new Meteor.Error(403);
    }
    check(Meteor.userId(), String);
    check(jobAttributes, {
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

    /*
    check(jobAttributes, {
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
    */

    Jobs.update({_id: jobAttributes._id}, jobAttributes);
    return {
      _id: jobAttributes._id
    }
  },
  jobRecoverDeleted: function(jobAttributes) {
    Meteor.call('jobUpdate', jobAttributes);
    Events.update({jobId: jobAttributes._id}, {$set:{isActive: true}}, { multi: true });
  },
  jobVirtualDelete: function(jobAttributes) {
    Meteor.call('jobUpdate', jobAttributes);
    Events.update({jobId: jobAttributes._id}, {$set:{isActive: false}}, { multi: true });
  },
  jobPhysicalDelete: function(jobAttributes) {
    if (!Meteor.user() || !Meteor.user().profile.isAdmin) {
      throw new Meteor.Error(403);
    }
    Jobs.remove(jobAttributes._id);
    Events.remove({jobId: jobAttributes._id});
  }
});

Jobs.allow({
  remove: function(userId, job) {
    return !! userId;
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
