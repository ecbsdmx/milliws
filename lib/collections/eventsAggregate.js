EvtPerJobPerDate = new Mongo.Collection('evtPerJobPerDate');


var numLPad = function(number, length){
  var ns = number.toString();
  if (typeof length == 'undefined') length = 2;
  while(ns.length < length)
    ns = "0" + ns;
  return ns;
}
/*
 * Mongo aggregation is not available in mini-mongo (on client).
 */
if (Meteor.isServer) {
  Meteor.methods({
    compileYearTotal: function (breakdownType, selectedJobs, period) {
      return compileTotal(breakdownType, selectedJobs, period, "P1Y");
    },
    compileMonthTotal: function (breakdownType, selectedJobs, period) {
      return compileTotal(breakdownType, selectedJobs, period, "P1M");
    },
    compileDayTotal: function (breakdownType, selectedJobs, period) {
      return compileTotal(breakdownType, selectedJobs, period, "P1D");
    },
    compileDailyAgg: function(breakdownType, selectedJobs, date, tzOffset) {
      //FIXME 1. date filter (in range date-1y)
      var all;
      var tzOffsetMs = tzOffset * 60 * 1000; //from min to ms
      switch(breakdownType) {
        case "rtBreakdown":
          all = Events.aggregate(
            [
              {$match: {jobId : {$in: selectedJobs}}},
              {$group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: { $subtract: [ "$etime", tzOffsetMs ]} } },
                  val: {$avg: "$responseTime"}
                  }
              }
            ]
          );
        break;
        case "errorBreakdown":
          all = Events.aggregate(
            [
              {$match: {jobId : {$in: selectedJobs}}},
              { $project: {
                jobId: "$jobId",
                etime: "$etime",
                prob: {$cond: [{$eq: ['$isProblematic', true]}, 1, 0]},
              }},
              {$group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: { $subtract: [ "$etime", tzOffsetMs ]} } },
                  valAll: {$sum: 1},
                  valProb: {$sum: "$prob"}
                  }
              }
            ]
          );
        break;
      }

      // [ { _id: { year: 2015, month: 4, day: 23 },
      //   count: 2064,
      //   avgRT: 258.6075581395349 },
      //   ...]
      //   to
      //   {
      //    "2014-04-29": 123.7,
      //    "2014-04-30: 153.4,
      //    ...
      //    }
      var dat = {};
      all.forEach(function(elem){
        var date = elem._id;
        dat[date] = breakdownType === "rtBreakdown"?elem.val:(elem.valProb/elem.valAll)*100;
      });

      return dat;
    }

  });
}

function compileTotal(breakdownType, selectedJobs, period, range) {
  var indicator;
  var periodEnd = period;
  var periodStart;
  var total;

  if (!selectedJobs || selectedJobs.length === 0) {
    return 0;
  }

  switch(range) {
    default:
    case "P1Y":
      periodStart = new Date(periodEnd.getFullYear() -1, periodEnd.getMonth(), periodEnd.getDate());
      break;
    case "P1M":
      periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth()-1, periodEnd.getDate());
      break;
    case "P1D":
      periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), periodEnd.getDate(), 0, 0, 0, 0);
      break;
  }

  switch(breakdownType) {
    case "rtBreakdown":
      var agg = Events.aggregate(
        [
          {
            $match: {
              jobId : {$in: selectedJobs},
              etime: {
                $gte: periodStart
              }
            }
          },
          {$group: {
              _id:  0,
              avgRT: {$avg: "$responseTime"},
              count: {$sum: 1}
            }
          }
        ]
      );
      indicator = 0 < agg.length ? agg[0].avgRT : null;
      total = 0 < agg.length ? agg[0].count : null;
      break;
    case "errorBreakdown":
      indicator = Events.find({
        jobId : {$in: selectedJobs},
        isProblematic: true,
        etime: {
          $gte: periodStart
        }
      }).count();
      total = Events.find({
        jobId: {$in: selectedJobs},
        etime: {
          $gte: periodStart
        }
      }).count();
      break;
  }

  return {val: indicator, total: total};
}
