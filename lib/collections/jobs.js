Jobs = new Mongo.Collection('jobs');

Meteor.methods({
  jobInsert: function(jobAttributes) {
    if (Meteor.isClient &&
      (!Meteor.user() || !Meteor.user().profile.isAdmin)) {
      throw new Meteor.Error(403);
    }

    check(jobAttributes, {
      _id: String,
      name: String,
      url: IsUrl,
      ert: Number,
      freq: Number,
      deltas: Boolean,
      isCompressed: Boolean,
      isIMS: Boolean,
      format: String
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
      _id: String,
      name: String,
      url: IsUrl,
      ert: Number,
      freq: Number,
      isDeleted: Boolean,
      isActive: Boolean,
      deltas: Boolean,
      isCompressed: Boolean,
      isIMS: Boolean,
      format: String,
      creationDate: Date
    });

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

var validUrl = /^(https?:\/\/)?([a-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})([\/\w\.-]*)*\/.*data\/(([A-Za-z0-9_@$\-]+)|(([A-Za-z][A-Za-z0-9_\-]*(\.[A-Za-z][A-Za-z0-9_\-]*)*)(\,[A-Za-z0-9_@$\-]+)(\,(latest|([0-9]+(\.[0-9]+)*)))?))\/?(([A-Za-z0-9_@$\-]+([+][A-Za-z0-9_@$\-]+)*)?([.]([A-Za-z0-9_@$\-]+([+][A-Za-z0-9_@$\-]+)*)?)*)\/?(([A-Za-z][A-Za-z0-9_\-]*(\.[A-Za-z][A-Za-z0-9_\-]*)*\,)?([A-Za-z0-9_@$\-]+))\/?[\?]?(.*)/g;

var IsUrl = Match.Where(function(x) {
  check(x, String);
  return validUrl.test(x);
});
