Template.eventListRow.helpers({
  isProblematicRow: function() {
    return this.isProblematic? {class:"rowError"}:"";
  },
  formatNumber: function(number) {
    return number.toLocaleString();
  }
});
