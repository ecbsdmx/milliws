Template.errorItem.helpers({
  isProblematic: function(){
    return this.countProb / this.count > 0.07 ? "problematicCell" : "okCell";
  },

  jobName: function(id){
    return Jobs.findOne({_id: id}).name;
  },

  errorInfo: function() {
    return this.countProb + " out of " + this.count;
  },

  cellWidth: function() {
    return Math.round((this.countProb / this.count) * 100);
  }
});
