describe("Permissions for jobs", function() {

  it("Jobs not accessible if not logged in", function(done) {
    Meteor.logout(function(error) {
      Meteor.subscribe("jobs");
      expect(Meteor.user()).toBeNull();
      expect(Jobs.find().count()).toEqual(0);
      done();
    });
  });

  it("Jobs accessible when logged in", function(done) {
    Meteor.loginWithPassword("user", "testuser", function(error) {
      Meteor.subscribe("jobs");
      expect(error).toBeUndefined();
      expect(Meteor.user()).not.toBeNull();
      expect(Meteor.user().username).toEqual("user");
      expect(Meteor.user().profile.isAdmin).toBe(false);
      expect(Jobs.find().count()).toBeGreaterThan(0);
      Meteor.logout(function(error) {
        expect(error).toBeUndefined();
        done();
      });
    });
  });

  it("Jobs.insert() not accessible to normal users", function(done) {
    Meteor.loginWithPassword("user", "testuser", function(error) {
      Meteor.subscribe("jobs");
      expect(error).toBeUndefined();
      expect(Meteor.user()).not.toBeNull();
      expect(Meteor.user().username).toEqual("user");
      expect(Meteor.user().profile.isAdmin).toBe(false);
      expect(Jobs.find().count()).toBeGreaterThan(0);
      var newJob = {
        _id: "test",
        name: "Test job",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };

      Jobs.insert(newJob, function(error, result) {
        expect(error).toBeDefined();
        expect(error.error).toEqual(403);
        expect(result).toBe(false);
        done();
      });
    });
  });

  it("Jobs.update() not accessible to normal users", function(done) {
    Meteor.loginWithPassword("user", "testuser", function(error) {
      Meteor.subscribe("jobs");
      expect(error).toBeUndefined();
      expect(Meteor.user()).not.toBeNull();
      expect(Meteor.user().username).toEqual("user");
      expect(Meteor.user().profile.isAdmin).toBe(false);
      expect(Jobs.find().count()).toBeGreaterThan(0);
      var job = Jobs.findOne();
      expect(job).toBeDefined();
      Jobs.update({_id: job._id}, {$set: {name: "test"}}, {}, function(error, result) {
        expect(error).toBeDefined();
        expect(error.error).toEqual(403);
        expect(result).toBe(false);
        done();
      });
    });
  });

  it("Jobs.remove() not accessible to normal users", function(done) {
    Meteor.loginWithPassword("user", "testuser", function(error) {
      Meteor.subscribe("jobs");
      expect(error).toBeUndefined();
      expect(Meteor.user()).not.toBeNull();
      expect(Meteor.user().username).toEqual("user");
      expect(Meteor.user().profile.isAdmin).toBe(false);
      expect(Jobs.find().count()).toBeGreaterThan(0);
      var job = Jobs.findOne();
      expect(job).toBeDefined();
      Jobs.remove({_id: job._id}, function(error, result) {
        expect(error).toBeDefined();
        expect(error.error).toEqual(403);
        expect(result).toBe(false);
        done();
      });
    });
  });

  it("Jobs.insert() not accessible to admin users", function(done) {
    Meteor.loginWithPassword("admin", "testadmin", function(error) {
      Meteor.subscribe("jobs");
      expect(error).toBeUndefined();
      expect(Meteor.user()).not.toBeNull();
      expect(Meteor.user().username).toEqual("admin");
      expect(Meteor.user().profile.isAdmin).toBe(true);
      expect(Jobs.find().count()).toBeGreaterThan(0);
      var newJob = {
        _id: "test",
        name: "Test job",
        url: "http://test.com/data/EXR/M.NOK.EUR.SP00.A",
        ert: 200,
        freq: 2,
        deltas: true,
        isCompressed: true,
        isIMS: false,
        format: "sdmx-json-1.0.0"
      };

      Jobs.insert(newJob, function(error, result) {
        expect(error).toBeDefined();
        expect(error.error).toEqual(403);
        expect(result).toBe(false);
        done();
      });
    });
  });

  it("Jobs.update() not accessible to admin users", function(done) {
    Meteor.loginWithPassword("admin", "testadmin", function(error) {
      Meteor.subscribe("jobs");
      expect(error).toBeUndefined();
      expect(Meteor.user()).not.toBeNull();
      expect(Meteor.user().username).toEqual("admin");
      expect(Meteor.user().profile.isAdmin).toBe(true);
      expect(Jobs.find().count()).toBeGreaterThan(0);
      var job = Jobs.findOne();
      expect(job).toBeDefined();
      Jobs.update({_id: job._id}, {$set: {name: "test"}}, {}, function(error, result) {
        expect(error).toBeDefined();
        expect(error.error).toEqual(403);
        expect(result).toBe(false);
        done();
      });
    });
  });

  it("Jobs.remove() not accessible to admin users", function(done) {
    Meteor.loginWithPassword("admin", "testadmin", function(error) {
      Meteor.subscribe("jobs");
      expect(error).toBeUndefined();
      expect(Meteor.user()).not.toBeNull();
      expect(Meteor.user().username).toEqual("admin");
      expect(Meteor.user().profile.isAdmin).toBe(true);
      expect(Jobs.find().count()).toBeGreaterThan(0);
      var job = Jobs.findOne();
      expect(job).toBeDefined();
      Jobs.remove({_id: job._id}, function(error, result) {
        expect(error).toBeDefined();
        expect(error.error).toEqual(403);
        expect(result).toBe(false);
        done();
      });
    });
  });
});
