Router.configure({
  layoutTemplate: 'layout', //Default template for all routes.
  loadingTemplate: 'loading', //Template to be displayed while the subscriptions are being fetched.
  notFoundTemplate: 'notFound'
});

Router.route('/', {name: 'welcome'});

Router.route('/reports', {
  name: 'reportsList',
  waitOn: function() {
    return Meteor.subscribe('eventstats');
  },
  data: function() { return EventStats.find(); }
});

Router.route('/jobs', {
  name: 'jobsList',
  template: "jobsList",
  waitOn: function() { return [Meteor.subscribe('jobs'), Meteor.subscribe('eventstats')]; },
  data: function() { return Jobs.find(); }
});

Router.route('/jobs/recycle', {
  name: 'jobsRecycle',
  template: "jobsList",
  waitOn: function() { return [Meteor.subscribe('recycledJobs'), Meteor.subscribe('eventstats')]; },
  data: function() { return Jobs.find(); }
});

Router.route('/events/:fromCount?', {
  name: 'eventsList',
  waitOn: function() {
    var l = parseInt(this.params.fromCount) || 0;
    return [Meteor.subscribe('events', l), Meteor.subscribe('eventstats')];
  },
  data: function() {
    return Events.find();
  }
});

Router.onBeforeAction('loading');
