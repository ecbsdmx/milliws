if (!(typeof MochaWeb === 'undefined')){

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

  MochaWeb.testOnly(function(){
    describe("Publications: Jobs", function(){

      it("Should have a few jobs in the database", function(){
        chai.assert(Jobs.find().count() > 0);
      });

      it("Jobs should only have known properties", function(){
        var jobs = Jobs.find().fetch();
        chai.assert(jobs.length > 0);
        jobs.forEach(function(element, index, array){
          chai.assert(checkJobDefinition(element));
        });
      });

      it("Valid insertion via server method works", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
        chai.assert(jobId === result._id);
        chai.assert.isUndefined(result.idTaken, "Job with id '" + jobId + "' already exists");
        var createdJob = Jobs.findOne({_id: jobId});
        checkJobDefinition(createdJob);
        chai.assert.strictEqual(jobId, createdJob._id);
        chai.assert.strictEqual("Test job", createdJob.name);
        chai.assert.strictEqual("http://test.com/data/EXR/M.NOK.EUR.SP00.A", createdJob.url);
        chai.assert.strictEqual(200, createdJob.ert);
        chai.assert.strictEqual(2, createdJob.freq);
        chai.assert.isTrue(createdJob.deltas);
        chai.assert.isTrue(createdJob.isCompressed);
        chai.assert.isTrue(createdJob.isActive);
        chai.assert.isFalse(createdJob.isIMS);
        chai.assert.strictEqual("sdmx-json-1.0.0", createdJob.format);
        chai.assert.isFalse(createdJob.isDeleted);
        chai.assert(createdJob.creationDate >= date, createdJob.creationDate + " should be after " + date);
      });

      it("URL must be valid", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
          chai.assert.equal("Match error: Failed Match.Where validation in field url", e.message);
        }
      });

      it("Format must be valid", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
          chai.assert.equal("Match error: Failed Match.Where validation in field format", e.message);
        }
      });

      it("ERT must be valid", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
          chai.assert.equal("Match error: Failed Match.Where validation in field ert", e.message);
        }
      });

      it("Frequency must be valid", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
          chai.assert.equal("Match error: Failed Match.Where validation in field freq", e.message);
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
          chai.assert.equal("Match error: Failed Match.Where validation in field _id", e.message);
        }
      });

      it("Name must be valid", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
          chai.assert.equal("Match error: Failed Match.Where validation in field name", e.message);
        }
      });

      it("Cannot use existing ID", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
          chai.assert.equal("test is already taken [job-id-taken]", e.message);
        }
      });

      it("Jobs are updatable", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
        chai.assert.strictEqual(1, Jobs.find({_id: jobId}).count());
        var insertedJob = Jobs.findOne({_id: jobId});
        insertedJob.name = "Test 2";
        Meteor.call("jobUpdate", insertedJob);
        chai.assert.strictEqual(1, Jobs.find({_id: jobId}).count());
        var returnedJob = Jobs.findOne({_id: jobId});
        chai.assert.strictEqual("Test 2", returnedJob.name);
      });

      it("Jobs can be Virtually deleted and recovered", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
        chai.assert.strictEqual(1, Jobs.find({_id: jobId}).count());

        var insertedJob = Jobs.findOne({_id: jobId});
        chai.assert.isTrue(insertedJob.isActive);
        Meteor.call("jobVirtualDelete", insertedJob);
        chai.assert.strictEqual(1, Jobs.find({_id: jobId}).count());

        var deletedJob = Jobs.findOne({_id: jobId});
        chai.assert.isFalse(deletedJob.isActive);
        Meteor.call("jobRecoverDeleted", deletedJob);
        chai.assert.strictEqual(1, Jobs.find({_id: jobId}).count());

        var recoveredJob = Jobs.findOne({_id: jobId});
        chai.assert.isTrue(recoveredJob.isActive);
      });

      it("Jobs can be physically deleted", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
        chai.assert.strictEqual(1, Jobs.find({_id: jobId}).count());

        var insertedJob = Jobs.findOne({_id: jobId});
        Meteor.call("jobPhysicalDelete", insertedJob);
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
      });

      it("Should not be possible to update creationDate", function(){
        var jobId = "test";
        Jobs.remove({_id: jobId});
        chai.assert.strictEqual(0, Jobs.find({_id: jobId}).count());
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
        chai.assert.strictEqual(1, Jobs.find({_id: jobId}).count());

        var insertedJob = Jobs.findOne({_id: jobId});
        insertedJob.creationDate = new Date();
        try {
          Meteor.call("jobUpdate", insertedJob);
          throw new Error("Should not be able to update creationDate!");
        } catch (e) {
          chai.assert.equal("creationDate cannot be updated [read-only-field]", e.message);
        }
      });
    });
  });
}
