EvtPerJobPerDate = new Mongo.Collection('evtPerJobPerDate');

var numLPad = function(number, length){
  var ns = number.toString();
  if (typeof length == 'undefined') length = 2;
  while(ns.length < length)
    ns = "0" + ns;
  return ns;
}


Meteor.methods({
  updateEvtPerJobPerDate: function () {
    // console.log("updateEvtPerJobPerDate - Start");
    var all = Events.aggregate(
      [
        {$match: {}},
        {$group: {
            _id:  {
                "jobId": "$jobId", 
                "year": { $year:"$etime"},
                "month": { $month:"$etime"},
                "day": { $dayOfMonth:"$etime"}
            },
            count: {$sum: 1},
            minRT: {$min: "$responseTime"},
            maxRT: {$max: "$responseTime"},
            avgRT: {$avg: "$responseTime"}
            }
        }
      ]
    );
    var out = {};

    var jobs = Jobs.find({}); 
    jobs.forEach(function(jobElem){
      out[jobElem._id] = [];
    });

    all.forEach(function(elem){
      out[elem._id.jobId].push({
        date: elem._id.year + "-" + numLPad(elem._id.month) + "-" + numLPad(elem._id.day),
        count: elem.count,
        minRT: elem.minRT,
        maxRT: elem.maxRT,
        avgRT: elem.avgRT//,
      })
    });

    console.dir(out);
    return out;

    // jobs.forEach(function(jobElem) {
      //   added(collection, id, fields)
      //later in publication: self.added("evtPerJobPerDate", jobElem._id, out[jobElem._id]);
    // });

    // EvtPerJobPerDate.remove({});
    // results.forEach(function(element, index, array) {
    //   EvtPerJobPerDate.insert(element);
    // });
  }

});
