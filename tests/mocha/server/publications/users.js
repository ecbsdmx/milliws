if (!(typeof MochaWeb === 'undefined')){

  MochaWeb.testOnly(function(){
    describe("Publications: Users", function(){
      it("Should have 2 users in the database", function(){
        chai.assert(Meteor.users.find().count() === 2);
      });
    });
  });
}
