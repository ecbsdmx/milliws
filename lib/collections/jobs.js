Jobs = new Mongo.Collection('jobs');

Meteor.methods({
  jobInsert: function(jobAttributes) {
    if (!Meteor.user() || !Meteor.user().profile.isAdmin) {
      throw new Meteor.Error(403);
    }

    check(Meteor.userId(), String);
    check(jobAttributes, {
      _id: String,
      name: String,
      url: String,
      ert: Number,
      freq: Number,
      deltas: Boolean,
      isCompressed: Boolean,
      isIMS: Boolean,
      format: String
    });

    var idTaken = Jobs.findOne({_id: jobAttributes._id});
    if (idTaken) {
      return {
        idTaken: true,
        _id: idTaken._id
      }
    }

    var urlExists = Jobs.findOne({url: jobAttributes.url});
    if (urlExists) {
      return {
        urlExists: true,
        _id: urlExists._id
      }
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
      url: String,
      ert: Number,
      freq: Number,
      isDeleted: Boolean,
      isActive: Boolean,
      deltas: Boolean,
      isCompressed: Boolean,
      isIMS: Boolean,
      format: String
    });

    //FIXME leroyse: for me the url should not be unique. One might want to test same url with diff. params (IMS, ...) !
    /*
    var urlExists = Jobs.findOne({url: jobAttributes.url,
                                  _id: { $ne: jobAttributes._id}});
    if (urlExists) {
      return {
        urlExists: true,
        _id: urlExists._id
      }
    }
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