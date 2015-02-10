// Create basic users
if (Meteor.users.find().count() === 0) {
    Accounts.createUser({
        username: 'admin',
        password: 'testadmin',
        profile: {
            login: 'admin',
            isAdmin: true
        }
    });

    Accounts.createUser({
        username: 'user',
        password: 'testuser',
        profile: {
            login: 'user',
            isAdmin: false
        }
    });
}

// Monitoring function to be called every minute
var monitor = function() {
    // We need to get all monitoring queries
    var monitoringQueries = Queries.find();
    monitoringQueries.forEach(function(element, index, array) {
        var lastCursor = Jobs.find({ queryId : element._id},
            {sort: { etime : -1}, limit: 1});
        if (0 === lastCursor.count()) {
            triggerQuery(element, null);
        } else {
            var last = lastCursor.fetch()[0];
            if (isDue(element, last)) {
                triggerQuery(element, last);
            }
        }
    });
}

// Checks whether a job needs to run
var isDue = function(query, last) {
    var lastRun = last.etime;
    var due  = new Date(lastRun.setMinutes(lastRun.getMinutes() + query.freq));
    var current = new Date();
    return current >= due;
    //return false; // useful when there is no network connection
}

// Unleash a monitoring query
var triggerQuery = function(query, last) {
    var lastUpdate;
    if (null === last) { //This will be true only the 1st time a job is run
        lastUpdate = "1970-01-01T00:00:00Z";
    } else {
        lastUpdate = moment(last.etime).format();
    }
    var startTime = new Date();
    HTTP.get(query.url, {params:{updatedAfter: lastUpdate}, headers: {
            "Accept": "application/vnd.sdmx.data+json;version=1.0.0-wd",
            "User-Agent": "Milliways 1.0.0"
        }}, function (error, result) {
            var job = {};
            var received = new Date();
            job.responseTime = received - startTime;
            job.queryId = query._id;
            job.etime = startTime;
            job.status = result.statusCode;
            job.ert = query.ert;
            var nSeries = 0;
            var nObs = 0;
            if (!error) {
                var response = JSON.parse(result.content)
                response.dataSets.forEach(function(element, index, array) {
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
            job.series = nSeries;
            job.observations = nObs;
            Jobs.insert(job);
        }
    );
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

