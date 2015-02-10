Queries = new Mongo.Collection('queries');

Meteor.methods({
    queryInsert: function(queryAttributes) {
        if (!Meteor.user() || !Meteor.user().profile.isAdmin) {
            throw new Meteor.Error(403);
        }

        check(Meteor.userId(), String);
        check(queryAttributes, {
            _id: String,
            name: String,
            url: String,
            subscribed: Boolean,
            ert: Number,
            ent: Number,
            freq: Number
        });

        var idTaken = Queries.findOne({_id: queryAttributes._id});
        if (idTaken) {
            return {
                idTaken: true,
                _id: idTaken._id
            }
        }

        var urlExists = Queries.findOne({url: queryAttributes.url});
        if (urlExists) {
            return {
                urlExists: true,
                _id: urlExists._id
            }
        }

        var queryId = Queries.insert(queryAttributes);
        return {
            _id: queryId
        };
    },
    queryUpdate: function(queryAttributes) {
        if (!Meteor.user() || !Meteor.user().profile.isAdmin) {
            throw new Meteor.Error(403);
        }
        check(Meteor.userId(), String);
        check(queryAttributes, {
            _id: String,
            name: String,
            url: String,
            subscribed: Boolean,
            ert: Number,
            ent: Number,
            freq:Number
        });

        var urlExists = Queries.findOne({url: queryAttributes.url,
            _id: { $ne: queryAttributes._id}});
        if (urlExists) {
            return {
                urlExists: true,
                _id: urlExists._id
            }
        }

        Queries.update({_id: queryAttributes._id}, queryAttributes);
        return {
            _id: queryAttributes._id
        }
    }
});

Queries.allow({
    remove: function(userId, query) {
        return !! userId;
    }
});