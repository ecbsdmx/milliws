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
      expect(Jobs.find().count()).toBeGreaterThan(0);
      Meteor.logout(function(error) {
        expect(error).toBeUndefined();
        done();
      });
    });
  });
});
