Router.configure({
  layoutTemplate: 'layout', //Default template for all routes.
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('events'); }
});

Router.route('/', {name: 'eventsList', waitOn: function() { return [Meteor.subscribe('events'), Meteor.subscribe('eventsStatPerJob')]; }, data: function() { return Events.find({isActive: true}); }});
Router.route('/reports', {name: 'reportsList', waitOn: function() { return Meteor.subscribe('eventsStatPerJob'); }, data: function() { return EventsStatPerJob.find(); }});
Router.route('/jobs', {name: 'jobsList', template: "jobsList", waitOn: function() { return Meteor.subscribe('jobs'); }, data: function() { return Jobs.find(); }});
Router.route('/jobs/recycle', {name: 'jobsRecycle', template: "jobsList", waitOn: function() { return Meteor.subscribe('recycledJobs'); }, data: function() { return Jobs.find(); }});

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
};

Router.onBeforeAction('loading');
Router.onBeforeAction(checkPermissions, {only: 'jobsRecycle'});
