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
  job.lastRun = startTime;
  var params = {};
  if (job.deltas) {
    params.updatedAfter = lastUpdate;
  }

  //-- request options
  var options = {
    strictSSL: false,
    agentOptions: {
      secureProtocol: 'TLSv1_method',
      /*rejectUnauthorized: false*/
    },
    params: params, 
    headers: {
      "User-Agent": "Heimdallr 1.0.0",
    }
  };

  if (job.format === "SDMX-ML 2.1 Generic") {
    options.headers.Accept = "application/vnd.sdmx.genericdata+xml;version=2.1";
  } else if (job.format === "SDMX-ML 2.1 Structure") {
    options.headers.Accept = "application/vnd.sdmx.structurespecificdata+xml;version=2.1";
  } else if (job.format === "SDMX-JSON") {
    options.headers.Accept = "application/vnd.sdmx.data+json;version=1.0.0-wd";
  } else { // default/unknown is SDMX-JSON
    options.headers.Accept =  "application/vnd.sdmx.data+json;version=1.0.0-wd"
  }

  if (job.isCompressed) {
    options.gzip = true;//headers["Accept-Encoding"] = "gzip"
  }

  if (job.isIMS && null !== last) {
    options.headers["If-Modified-Since"] = new Date(last.etime).toUTCString();
  }
  
  //-- request
  HTTP.call("GET", job.url, options , function (error, result) {
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
    var serieObs = {nSeries: 0, nObs: 0};
    if (!error) {
      // ATT result.header['content-type'] does not return the proper type...
      switch(job.format){
        case "SDMX-ML 2.1 Generic":
        case "SDMX-ML 2.1 Structure":
          serieObs = parseXML(result.content);
          break;
        case "SDMX-JSON":
          serieObs = parseJSON(result.content);
          break;
        default:
          serieObs = parseJSON(result.content);
      }
    }
    event.series = serieObs.nSeries;
    event.observations = serieObs.nObs;
    Events.insert(event);
  });
};

var parseXML = function(content) {
  console.log("In parseXML... TODO");
}

var parseJSON = function(content) {
  var ret = {nSeries: 0, nObs: 0};
  var response = JSON.parse(content);
  response.dataSets.forEach(function (element, index, array) {
    var series = element.series;
    for (var property in series) {
      if (series.hasOwnProperty(property)) {
        ret.nSeries++;
        var obs = series[property]["observations"];
        for (var obsProp in obs) {
          if (obs.hasOwnProperty(obsProp)) {
            ret.nObs++;
          }
        }
      }
    }
  });
  return ret;
}
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
SyncedCron.start();
