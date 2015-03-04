Template.responseTimeCell.helpers({
  ertClass: function(ert, rt) {
    // 30% threshold yields warning color
    var percentageMargin = 0.3;
    if (rt > ert) {
      return "text-danger";
    } else if ((rt + rt * percentageMargin) > ert) {
      return "text-warning";
    }
    return "text-primary";
  }
});