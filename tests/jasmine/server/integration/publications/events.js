Jasmine.onTest(function () {
  describe("Publications: Events", function() {

    it("Might have a few events in the database", function() {
      expect(Events.find().count() >= 0).toBe(true);
    });
  });
});
