Jasmine.onTest(function () {
  "use strict";
  describe("Publications: Users", function() {
    it("Should have 1 user in the database", function() {
      expect(Meteor.users.find().count()).toEqual(1);
    });
  });
});
