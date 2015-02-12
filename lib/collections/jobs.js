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
            freq: Number
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
            isActive: Boolean
        });

        var urlExists = Jobs.findOne({url: jobAttributes.url,
            _id: { $ne: jobAttributes._id}});
        if (urlExists) {
            return {
                urlExists: true,
                _id: urlExists._id
            }
        }

        Jobs.update({_id: jobAttributes._id}, jobAttributes);
        return {
            _id: jobAttributes._id
        }
    }
});

Jobs.allow({
    remove: function(userId, job) {
        return !! userId;
    }
});