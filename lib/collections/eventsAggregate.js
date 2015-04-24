EvtPerJobPerDate = new Mongo.Collection('evtPerJobPerDate');

Meteor.methods({
  compileYearTotal: function (breakdownType, selectedJobs, period) {
    return compileTotal(breakdownType, selectedJobs, period, "P1Y");
  },
  compileMonthTotal: function (breakdownType, selectedJobs, period) {
    return compileTotal(breakdownType, selectedJobs, period, "P1M");
  },
  compileDayTotal: function (breakdownType, selectedJobs, period) {
    return compileTotal(breakdownType, selectedJobs, period, "P1D");
  }

});


function compileTotal(breakdownType, selectedJobs, period, range) {
  var response;
  var periodEnd = period;
  var periodStart;

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
                $gt: periodStart,
                $lte: periodEnd
              }
            }
          },
          {$group: {
              _id:  0,
              avgRT: {$avg: "$responseTime"}
              }
          }
        ]
      );
      response = agg[0].avgRT;
      break;
    case "errorBreakdown":
      response = Events.find({
        jobId : {$in: selectedJobs}, 
        isProblematic: true, 
        etime: {
          $gt: periodStart,
          $lte: periodEnd
        }
      }).count();
      break;
  }
  return response;

}