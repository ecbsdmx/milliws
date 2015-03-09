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

  Meteor.call("updateEventsStats", function(err, data) {
    if (err) console.log("updateEventsStats error: " + err);
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
      secureProtocol: 'TLSv1_method'
      /*rejectUnauthorized: false*/
    },
    params: params,
    headers: {
      "User-Agent": "Heimdallr 1.0.0"
    }
  };

  if (proxy){
    options.proxy = proxy;
  }
  if (job.format === "sdmx-generic-2.1") {
    options.headers.Accept = "application/vnd.sdmx.genericdata+xml;version=2.1";
  } else if (job.format === "sdmx-compact-2.1") {
    options.headers.Accept = "application/vnd.sdmx.structurespecificdata+xml;version=2.1";
  } else if (job.format === "sdmx-json-1.0.0") {
    options.headers.Accept = "application/vnd.sdmx.data+json;version=1.0.0-wd";
  } else { // default/unknown is SDMX-JSON
    options.headers.Accept =  "application/vnd.sdmx.data+json;version=1.0.0-wd"
  }

  if (job.isCompressed) {
    options.headers['Accept-Encoding'] = "gzip";
    //options.gzip = true;
  }

  if (job.isIMS && null !== last) {
    options.headers["If-Modified-Since"] = new Date(last.etime).toUTCString();
  }

  //-- request
  HTTP.call("GET", job.url, options , function (error, result) {
    //console.log("result from HTTP.call(..., function(error, result)) for job (" + job.name + ") : ");
    //console.dir(result);
    var event = {};
    var received = new Date();

    event.responseTime = received - startTime;
    event.jobId = job._id;
    event.isActive = true;
    event.etime = startTime;
    event.url = job.url;
    event.isProblematic = false;
    event.deltas = job.deltas;
    event.ert = job.ert;
    /*
    var responseSize = result.headers['content-length']
    if (responseSize)
      event.responseSize = responseSize;
    */
    if (result) {
      event.status = result.statusCode;
    } else {
      // alert should be raised?
      event.isProblematic = true;
      console.log(error);
    }

    switch (event.status) {
      case 404:
        event.isProblematic = !event.deltas;
        break;
      case 304:
      case 200:
        event.isProblematic = event.responseTime > event.ert;
        break;
      default:
        event.isProblematic = true;
    }
    
    var serieObs = {nSeries: 0, nObs: 0};
    if (200 === event.status) {
      // ATT result.headers['content-type'] does not return the proper type...
      switch(job.format){
        case "sdmx-generic-2.1":
          serieObs = parseGenericXML(result.content);
          break;
        case "sdmx-compact-2.1":
          serieObs = parseCompactXML(result.content);
          break;
        case "sdmx-json-1.0.0":
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

var parseCompactXML = function(content) {
  var ret = {nSeries: 0, nObs: 0};
  xml2js.parseString(content, function (err, result) {
    result['message:StructureSpecificData']['message:DataSet'].forEach(function (dataset, index, array) {
      var dsSeries = dataset.Series;
      dsSeries.forEach(function (series, index, array) {
        ret.nSeries++;
        var obs = series.Obs;
        ret.nObs = ret.nObs + obs.length;
      });
    });
  });
  return ret;
};

var parseGenericXML = function(content) {
  var ret = {nSeries: 0, nObs: 0};
  xml2js.parseString(content, function (err, result) {
    result['message:GenericData']['message:DataSet'].forEach(function (dataset, index, array) {
      var dsSeries = dataset['generic:Series'];
      dsSeries.forEach(function (series, index, array) {
        ret.nSeries++;
        var obs = series['generic:Obs'];
        ret.nObs = ret.nObs + obs.length;
      });
    });
  });
  return ret;
};


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

var proxy = process.env.http_proxy;
if (proxy) {
  console.log("Using the env variable proxy: http_proxy");
}
SyncedCron.start();





