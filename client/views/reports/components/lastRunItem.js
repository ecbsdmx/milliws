Template.lastRunItem.helpers({
  isProblematic: function(){
    return this.lastProb ? "text-danger" : "text-success";
  },

  jobName: function(id){
    return Jobs.findOne({_id: id}).name;
  }
});
