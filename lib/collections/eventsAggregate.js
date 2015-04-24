EvtPerJobPerDate = new Mongo.Collection('evtPerJobPerDate');

Meteor.methods({
  compileYearTotal: function (breakdownType, selectedJobs, period) {
    return compileTotal(breakdownType, selectedJobs, period, "P1Y");
  },
  compileMonthTotal: function (breakdownType, selectedJobs, period) {
    return compileTotal(breakdownType, selectedJobs, period, "P1M");
  }
});


function compileTotal(breakdownType, selectedJobs, period, range) {
  var response;
  var periodEnd = new Date();
  var periodStart;

  switch(range) {
    default:
    case "P1Y":
      periodStart = new Date(periodEnd.getFullYear() -1, periodEnd.getMonth(), periodEnd.getDate());
      break;
    case "P1M":
      periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth()-1, periodEnd.getDate());
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
      response = Math.round(agg[0].avgRT) + "ms";
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