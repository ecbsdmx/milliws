Template.responseTimeCell.helpers({
  ertClass: function(ert, rt) {
    // FIXME use gauge & set percentage threshold in settings
    var percentageMargin = 0.3;
    if (rt > ert) {
      return "text-danger";
    } else if ((rt + rt * percentageMargin) > ert) {
      return "text-warning";
    }
    return "text-primary";
  }
});