// Monitoring function to be called every minute
var monitor = function() {
  // We need to get all monitoring jobs
  var jobs = Jobs.find( { isDeleted: false, isActive: true } );
  jobs.forEach(function(element, index, array) {
    var lastCursor = Events.find({ jobId : element._id},
                                 {sort: { etime : -1}, limit: 1});
    if (0 === lastCursor.count()) {
      triggerJob(element, null);
    } else {
      var last = lastCursor.fetch()[0];
      if (isDue(element, last)) {
        triggerJob(element, last);
      }
    }
  });
};

// Checks whether a job needs to run
var isDue = function(job, last) {
  var lastRun = last.etime;
  var due  = new Date(lastRun.setMinutes(lastRun.getMinutes() + job.freq));
  var current = new Date();
  return current >= due;
};

// Unleash a job
var triggerJob = function(job, last) {
  var lastUpdate;
  if (null === last) { //This will be true only the 1st time a job is run
    lastUpdate = "1970-01-01T00:00:00Z";
  } else {
    lastUpdate = moment(last.etime).format();
  }
  var startTime = new Date();
  HTTP.get(job.url, {params:{updatedAfter: lastUpdate}, headers: {
    "Accept": "application/vnd.sdmx.data+json;version=1.0.0-wd",
    "User-Agent": "Heimdallr 1.0.0"
  }}, function (error, result) {
    var event = {};
    var received = new Date();
    event.responseTime = received - startTime;
    event.jobId = job._id;
    event.isActive = true;
    event.etime = startTime;
    if (result) {
      event.status = result.statusCode;
    } else {
      // alert should be raised?
      console.log(error);
    }
    event.ert = job.ert;
    var nSeries = 0;
    var nObs = 0;
    if (!error) {
      var response = JSON.parse(result.content);
      response.dataSets.forEach(function (element, index, array) {
        var series = element.series;
        for (var property in series) {
          if (series.hasOwnProperty(property)) {
            nSeries++;
            var obs = series[property]["observations"];
            for (var obsProp in obs) {
              if (obs.hasOwnProperty(obsProp)) {
                nObs++;
              }
            }
          }
        }
      });
    }
    event.series = nSeries;
    event.observations = nObs;
    Events.insert(event);
  });
};

// Start cron
SyncedCron.add({
  name: 'Trigger monitoring function',
  schedule: function(parser) {
    return parser.text('every 1 min');
  },
  job: function() {
    monitor();
  }
});
//SyncedCron.start();
