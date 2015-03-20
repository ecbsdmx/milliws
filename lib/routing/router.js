Router.configure({
  layoutTemplate: 'layout', //Default template for all routes.
  loadingTemplate: 'loading', //Template to be displayed while the subscriptions are being fetched.
  notFoundTemplate: 'notFound'
});

Router.route('/reports', {
  name: 'reportsList',
  waitOn: function() {
    return Meteor.subscribe('eventStats');
  },
  data: function() { return EventStats.find(); }
});

Router.route('/jobs', {
  name: 'jobsList',
  template: "jobsList",
  waitOn: function() { return [Meteor.subscribe('jobs'), Meteor.subscribe('eventStats')]; },
  data: function() { return Jobs.find(); }
});

Router.route('/jobs/recycle', {
  name: 'jobsRecycle',
  template: "jobsList",
  waitOn: function() { return [Meteor.subscribe('recycledJobs'), Meteor.subscribe('eventStats')]; },
  data: function() { return Jobs.find(); }
});

Router.route('/users', {
  name: 'users',
  template: "usersList",
  waitOn: function() {
    return Meteor.subscribe('usersRoles');
  },
  data: function() {
    return Meteor.users.find();
  }
});

/**
 *  HAS to be last in the list of Routes ! 
 *  @see meteor documentation for root route optional parameter
 */
Router.route('/:fromCount?', {
  name: 'eventsList',
  waitOn: function() {
    var l = parseInt(this.params.fromCount) || 0;
    Session.set("EventsFromCount", l);
    return [Meteor.subscribe('events', l, getSortOptions()), Meteor.subscribe('eventsCount')];
  },
  data: function() {
    return Events.find({}, {sort: getSortOptions()});
  }
});


Router.onBeforeAction('loading');

var getSortOptions = function(){
  var sorting = Session.get("eventsSorting");
  var sortOptions = {};
  if (typeof sorting == 'undefined') {
    sortOptions = {etime: -1};
  }
  else {
    sortOptions[sorting.by] = sorting.order;
  }
  return sortOptions;
};
