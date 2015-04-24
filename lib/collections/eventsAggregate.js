EvtPerJobPerDate = new Mongo.Collection('evtPerJobPerDate');

Meteor.methods({
  compileYearTotal: function (breakdownType, selectedJobs, period) {
    var response;
    var today = new Date();
    var oneYearAgo = new Date(today.getFullYear() -1, today.getMonth(), today.getDate());
    switch(breakdownType) {
      case "rtBreakdown":
        var agg = Events.aggregate(
          [
            {$match: {jobId : {$in: selectedJobs}}},
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
            $lte: today, 
            $gt: oneYearAgo
          }
        }).count();
      break;
    }
    return response;
  }
});
