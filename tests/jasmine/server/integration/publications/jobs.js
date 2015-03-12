var jobFields = ["_id", "name", "url", "ert", "freq", "isDeleted", "isActive", "deltas", "isCompressed", "isIMS", "format", "creationDate"];

var checkJobDefinition = function(job){
  // Checks that all job properties are known
  for (var prop in job) {
    if (job.hasOwnProperty(prop)) {
      if (-1 === jobFields.indexOf(prop)) {
        return false;
      }
    }
  }

  // Checks that the job contains all expected properties
  jobFields.forEach(function(element, index, array) {
    if (!job.hasOwnProperty(element)) {
      return false;
    }
  });

  return true;
};

Jasmine.onTest(function () {
  describe("Publications: Jobs", function(){

    it("Should have a few jobs in the database", function(){
      expect(Jobs.find().count()).toBeGreaterThan(0);
    });

    it("Jobs should only have known properties", function(){
      var jobs = Jobs.find().fetch();
      expect(jobs.length > 0).toBeGreaterThan(0);
      jobs.forEach(function(element, index, array){
        expect(checkJobDefinition(element)).toBe(true);
      });
    });

    it("Valid insertion via server method works", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var date = new Date();
      var newJob = {
        _id: jobId,
        name: "Test job",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      var result = Meteor.call("jobInsert", newJob);
      expect(result._id).toEqual(jobId);
      expect(result.idTaken).toBeUndefined();
      var createdJob = Jobs.findOne({_id: jobId});
      checkJobDefinition(createdJob);
      expect(createdJob._id).toEqual(jobId);
      expect(createdJob.name).toEqual("Test job");
      expect(createdJob.url).toEqual("http://test.com/data/EXR/M.NOK.EUR.SP00.A");
      expect(createdJob.ert).toEqual(200);
      expect(createdJob.freq).toEqual(2);
      expect(createdJob.deltas).toBe(true);
      expect(createdJob.isCompressed).toBe(true);
      expect(createdJob.isActive).toBe(true);
      expect(createdJob.isIMS).toBe(false);
      expect(createdJob.format).toEqual("sdmx-json-1.0.0");
      expect(createdJob.isDeleted).toBe(false);
      expect(createdJob.creationDate >= date).toBe(true);
    });

    it("URL must be valid", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "Test job",
        url: "not a url",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      try {
        Meteor.call("jobInsert", newJob);
        throw new Error("'" + newJob.url + "' is not valid!");
      } catch (e) {
        expect(e.message).toEqual("Match error: Failed Match.Where validation in field url");
      }
    });

    it("Format must be valid", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "Test job",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "test"
      };
      try {
        Meteor.call("jobInsert", newJob);
        throw new Error("'" + newJob.format + "' is not valid!");
      } catch (e) {
        expect(e.message).toEqual("Match error: Failed Match.Where validation in field format");
      }
    });

    it("ERT must be valid", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "Test job",
        ert: 0,
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      try {
        Meteor.call("jobInsert", newJob);
        throw new Error("'" + newJob.ert + "' is not valid!");
      } catch (e) {
        expect(e.message).toEqual("Match error: Failed Match.Where validation in field ert");
      }
    });

    it("Frequency must be valid", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "Test job",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 0,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      try {
        Meteor.call("jobInsert", newJob);
        throw new Error("'" + newJob.freq + "' is not valid!");
      } catch (e) {
        expect(e.message).toEqual("Match error: Failed Match.Where validation in field freq");
      }
    });

    it("ID must be valid", function(){
      var newJob = {
        _id: "",
        name: "Test job",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 1,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      try {
        Meteor.call("jobInsert", newJob);
        throw new Error("'" + newJob._id + "' is not valid!");
      } catch (e) {
        expect(e.message).toEqual("Match error: Failed Match.Where validation in field _id");
      }
    });

    it("Name must be valid", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      try {
        Meteor.call("jobInsert", newJob);
        throw new Error("'" + newJob.name + "' is not valid!");
      } catch (e) {
        expect(e.message).toEqual("Match error: Failed Match.Where validation in field name");
      }
    });

    it("Cannot use existing ID", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "test 1",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      Meteor.call("jobInsert", newJob);
      try {
        Meteor.call("jobInsert", newJob);
        throw new Error("Should not be able to reuse IDs!");
      } catch (e) {
        expect(e.message).toEqual("test is already taken [job-id-taken]");
      }
    });

    it("Jobs are updatable", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "Test",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      Meteor.call("jobInsert", newJob);
      expect(Jobs.find({_id: jobId}).count()).toEqual(1);
      var insertedJob = Jobs.findOne({_id: jobId});
      insertedJob.name = "Test 2";
      Meteor.call("jobUpdate", insertedJob);
      expect(Jobs.find({_id: jobId}).count()).toEqual(1);
      var returnedJob = Jobs.findOne({_id: jobId});
      expect(returnedJob.name).toEqual("Test 2");
    });

    it("Jobs can be Virtually deleted and recovered", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "Test",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      Meteor.call("jobInsert", newJob);
      expect(Jobs.find({_id: jobId}).count()).toEqual(1);

      var insertedJob = Jobs.findOne({_id: jobId});
      expect(insertedJob.isDeleted).toBe(false);
      Meteor.call("jobVirtualDelete", jobId);
      expect(Jobs.find({_id: jobId}).count()).toEqual(1);

      var deletedJob = Jobs.findOne({_id: jobId});
      expect(deletedJob.isDeleted).toBe(true);
      Meteor.call("jobRecoverDeleted", jobId);
      expect(Jobs.find({_id: jobId}).count()).toEqual(1);

      var recoveredJob = Jobs.findOne({_id: jobId});
      expect(recoveredJob.isDeleted).toBe(false);
    });

    it("Jobs can be physically deleted", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "Test",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      Meteor.call("jobInsert", newJob);
      expect(Jobs.find({_id: jobId}).count()).toEqual(1);

      var insertedJob = Jobs.findOne({_id: jobId});
      Meteor.call("jobPhysicalDelete", jobId);
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
    });

    it("Should not be possible to update creationDate", function(){
      var jobId = "test";
      Jobs.remove({_id: jobId});
      expect(Jobs.find({_id: jobId}).count()).toEqual(0);
      var newJob = {
        _id: jobId,
        name: "Test",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };
      Meteor.call("jobInsert", newJob);
      expect(Jobs.find({_id: jobId}).count()).toEqual(1);

      var insertedJob = Jobs.findOne({_id: jobId});
      insertedJob.creationDate = new Date();
      try {
        Meteor.call("jobUpdate", insertedJob);
        throw new Error("Should not be able to update creationDate!");
      } catch (e) {
        expect(e.message).toEqual("creationDate cannot be updated [read-only-field]");
      }
    });
  });
});
