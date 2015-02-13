Router.configure({
    layoutTemplate: 'layout', //Default template for all routes.
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() { return Meteor.subscribe('events'); }
});

Router.route('/', {name: 'eventsList'});
Router.route('/reports', {name: 'reportsList'});
Router.route('/jobs', {name: 'jobsList', waitOn: function() { return Meteor.subscribe('jobs')}, data: function() { return Jobs.find({isDeleted: false}); }});
Router.route('/jobs/submit', {name: 'jobSubmit'});
Router.route('/jobs/:_id', {name: 'jobPage', waitOn: function() { return Meteor.subscribe('jobs', this.params._id)}, data: function() { return Jobs.findOne({_id: this.params._id, isDeleted: false});}});
Router.route('/jobs/:_id/edit', {name: 'jobEdit', waitOn: function() { return Meteor.subscribe('jobs', this.params._id)}, data: function() { return Jobs.findOne({_id: this.params._id, isDeleted: false});}});

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
Router.onBeforeAction('dataNotFound', {only: 'jobPage'}); //Returns 404
Router.onBeforeAction(checkPermissions, {only: 'jobSubmit'}); //Returns 403
Router.onBeforeAction(checkPermissions, {only: 'jobEdit'});