Jasmine.onTest(function () {

  var getTestJob = function() {
    var job = {
      _id: "testjob",
      name: "Test job",
      url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
      ert: 200,
      freq: 2,
      deltas: true,
      isCompressed: true,
      isIMS: false,
      format: "sdmx-json-1.0.0"
    };
    return job;
  }

  var getTestNoDeltasJob = function() {
    var job = {
      _id: "testjob",
      name: "Test job",
      url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
      ert: 200,
      freq: 2,
      deltas: false,
      isCompressed: true,
      isIMS: false,
      format: "sdmx-json-1.0.0"
    };
    return job;
  }

  describe("Publications: Events", function() {

    it("Might have a few events in the database", function() {
      expect(Events.find().count() >= 0).toBe(true);
    });

    it("Valid insertion via server method works", function() {
      var start = new Date();
      var job = getTestJob();
      var result = Meteor.call("eventInsert", job, 200, 123, 1, 2);
      expect(result._id).toBeDefined();
      var createdEvent = Events.findOne({_id: result._id});
      expect(createdEvent.jobId).toBe(job._id);
      expect(createdEvent.url).toBe(job.url);
      expect(createdEvent.ert).toBe(job.ert);
      expect(createdEvent.deltas).toBe(job.deltas);
      expect(createdEvent.isActive).toBe(true);
      expect(createdEvent.isProblematic).toBe(false);
      expect(createdEvent.status).toBe(200);
      expect(createdEvent.responseTime).toBe(123);
      expect(createdEvent.series).toBe(1);
      expect(createdEvent.observations).toBe(2);
      expect(createdEvent.etime >= start).toBe(true);
    });


    it("Should be able to guess if an event is problematic", function() {
      var job = getTestJob();
      var result1 = Meteor.call("eventInsert", job, 406, 123, 1, 2);
      expect(result1._id).toBeDefined();
      var prob1 = Events.findOne({_id: result1._id});
      expect(prob1.isProblematic).toBe(true);

      var result2 = Meteor.call("eventInsert", job, 200, 201, 1, 2);
      expect(result2._id).toBeDefined();
      var prob2 = Events.findOne({_id: result2._id});
      expect(prob2.isProblematic).toBe(true);

      var result3 = Meteor.call("eventInsert", getTestNoDeltasJob(), 404, 123, 1, 2);
      expect(result3._id).toBeDefined();
      var prob3 = Events.findOne({_id: result3._id});
      expect(prob3.isProblematic).toBe(true);
    });
  });
});
