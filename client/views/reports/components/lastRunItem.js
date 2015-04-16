Template.lastRunItem.helpers({
  isProblematic: function(){
    return this.lastProb ? "text-danger" : "text-success";
  }
});
