Template.lastRunItem.helpers({
  isProblematic: function(){
    return this.value.lastProb ? "text-danger" : "text-success";
  }
});
