if (!(typeof MochaWeb === 'undefined')){

  MochaWeb.testOnly(function(){
    describe("Publications: Events", function(){

      it("Might have a few events in the database", function(){
        chai.assert(Events.find().count() >= 0);
      });
    });
  });
}
