Jasmine.onTest(function () {
  "use strict";
  describe("Publications: Users", function() {
    it("Should have 2 users in the database", function() {
      expect(Meteor.users.find().count()).toEqual(2);
    });
  });
});
