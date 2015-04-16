Template.errorItem.helpers({
  isProblematic: function(){
    return this.countProb / this.count > 0.07 ? "problematicCell" : "okCell";
  },

  errorInfo: function() {
    return this.countProb + " out of " + this.count;
  },

  cellWidth: function() {
    return Math.round((this.countProb / this.count) * 100);
  }
});
