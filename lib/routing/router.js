Router.configure({
    layoutTemplate: 'layout', //Default template for all routes.
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() { return Meteor.subscribe('events'); }
});

Router.route('/', {name: 'eventsList'});
Router.route('/queries', {name: 'queriesList', waitOn: function() { return Meteor.subscribe('queries')}, data: function() { return Queries.find(); }});
Router.route('/queries/submit', {name: 'querySubmit'});
Router.route('/queries/:_id', {name: 'queryPage', waitOn: function() { return Meteor.subscribe('queries', this.params._id)}, data: function() { return Queries.findOne(this.params._id);}});
Router.route('/queries/:_id/edit', {name: 'queryEdit', waitOn: function() { return Meteor.subscribe('queries', this.params._id)}, data: function() { return Queries.findOne(this.params._id);}});

var checkPermissions = function(pause) {
    if(! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else if (! Meteor.user().profile.isAdmin) {
        this.render('accessDenied');
    } else {
        this.next();
    }
}

Router.onBeforeAction('loading');
Router.onBeforeAction('dataNotFound', {only: 'queryPage'}); //Returns 404
Router.onBeforeAction(checkPermissions, {only: 'querySubmit'}); //Returns 403
Router.onBeforeAction(checkPermissions, {only: 'queryEdit'});