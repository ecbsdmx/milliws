Template.errorItem.helpers({
  isProblematic: function(){
    return this.value.countProb / this.value.count > 0.07 ? "problematicCell" : "okCell";
  },

  errorInfo: function() {
    return this.value.countProb + " out of " + this.value.count;
  },

  cellWidth: function() {
    return Math.round((this.value.countProb / this.value.count) * 100);
  }
});
