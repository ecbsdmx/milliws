Template.eventListRow.helpers({
  isProblematicRow: function() {
    return this.isProblematic? {class:"rowError"}:"";
  }
});