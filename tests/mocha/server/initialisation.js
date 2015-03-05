if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Server initialization", function(){
      it("Should have a Meteor version defined", function(){
        chai.assert(Meteor.release);
      });
    });
  });
}
