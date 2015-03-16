Events = new Mongo.Collection('events');

Meteor.methods({
  eventInsert: function(job, status, rt, series, obs) {
    checkPermissions();
    var event = {
      jobId: job._id,
      url: job.url,
      etime: new Date(),
      status: status,
      responseTime: rt,
      ert: job.ert,
      deltas: job.deltas,
      isActive: true,
      isProblematic: !((status === 200 || status === 304 || (status === 404 && job.deltas)) && rt <= job.ert),
      series: series,
      observations: obs
    };
    var id = Events.insert(event);
    return {
      _id: id
    };
  }
});

var checkPermissions = function() {
  if (Meteor.isClient) {
    throw new Meteor.Error(403);
  }
};
