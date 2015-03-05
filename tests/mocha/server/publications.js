if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Publications", function(){
      it("Should have 2 users in the database", function(){
        chai.assert(Meteor.users.find().count() === 2);
      });

      it("Should have a few jobs in the database", function(){
        chai.assert(Jobs.find().count() > 0);
      });

      it("Might have a few events in the database", function(){
        chai.assert(Events.find().count() >= 0);
      });
    });
  });
}
