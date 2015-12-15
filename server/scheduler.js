//var debug = Meteor.npmRequire("debug")("loki:scheduler");
// vector of new jobs trigger results
var jobsTriggeredRes = [];

// Monitoring function to be called every minute
var monitor = function() {
  // We need to get all monitoring jobs
  var jobs = Jobs.find( { isDeleted: false, isActive: true } );
  jobsTriggeredRes = [];
  jobs.forEach(function(element, index, array) {
    Meteor.call("messageLogError", "Find last: " + element._id + " run...", "scheduler");
    var lastCursor = Events.find({ jobId : element._id},
                                 {sort: { etime : -1}, limit: 1});
    Meteor.call("messageLogError", "Find last: " + element._id + " run done !", "scheduler");
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

// check if stats update is to be performed and initiate
var triggerStatsUpdate = function() {
  var jobsCount = Jobs.find({ isDeleted: false, isActive: true }).count();
  if (jobsTriggeredRes.length < jobsCount) return;

  //-- avoid bug of multiple triggering.
  var jobs = jobsTriggeredRes.slice();
  jobsTriggeredRes = [];

  Meteor.call("updateEventStatsOpt", jobs, function(err, data) {
    if (err) Meteor.call("messageLogError", "updateEventStatsOpt error: " + err, "scheduler");
  });
};

// Unleash a job
var triggerJob = function(job, last) {
  var request = Meteor.npmRequire('request');
  var lastUpdate;
  if (null === last) { //This will be true only the 1st time a job is run
    lastUpdate = "1970-01-01T00:00:00Z";
  } else {
    lastUpdate = moment(last.etime).format();
  }

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
    qs: params,
    headers: {
      "User-Agent": "MilliWS 1.0.0"
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
    options.gzip = true;
  }

  if (job.isIMS && null !== last) {
    options.headers["If-Modified-Since"] = new Date(last.etime).toUTCString();
  }
  var startTime = new Date();
  job.lastRun = startTime;
  //-- request
  options.method = 'GET';
  options.uri = job.url;
  var contentSize = 0;
  request(options, Meteor.bindEnvironment(function (error, response, body) {
    if (body || 304 === response.statusCode) {
      var received = new Date();
      var responseTime = received - startTime;
      processResults(response, job, responseTime, contentSize);
    } else {
      Meteor.call("messageLogError", "Request error: " + JSON.stringify(error), "scheduler");
    }
    jobsTriggeredRes.push({j:job, rt: responseTime, statusCode: response.statusCode});
    triggerStatsUpdate();
  })).on('response', function(response) {
    // unmodified http.IncomingMessage object
    response.on('data', function(data) {
      // (compressed ?) data as it is received
      contentSize += data.length;
    })
  });
};

var processResults = function(result, job, responseTime, contentSize) {
  var status = result.statusCode;
  var serieObs = {nSeries: 0, nObs: 0};
  if (200 === status) {
    switch(job.format){
      case "sdmx-generic-2.1":
        serieObs = parseGenericXML(result.body);
        break;
      case "sdmx-compact-2.1":
        serieObs = parseCompactXML(result.body);
        break;
      case "sdmx-json-1.0.0":
        serieObs = parseJSON(result.body);
        break;
      default:
        serieObs = parseJSON(result.body);
    }
  }
  Meteor.call("eventInsert", job, status, responseTime, serieObs.nSeries, serieObs.nObs, contentSize);
}

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
Meteor.setInterval(monitor, 60 * 1000);

var proxy = process.env.http_proxy;
if (proxy) {
  Meteor.call("messageLogInfo", "Using the existing ENV variable defined for proxy: http_proxy", "scheduler");
}
