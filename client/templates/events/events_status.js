Template.statusCodeCell.helpers({
  class: function(status) {
    switch (status) {
      case 404:
        return "text-warning";
      case 304:
      case 200:
        return "text-primary";
      default:
        return "text-danger";
    }
  }
});
