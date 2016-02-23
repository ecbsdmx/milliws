Template.statusCodeCell.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
};

Template.statusCodeCell.helpers({
  statusClass: function(status, deltas) {
    switch (status) {
      case 404:
        return  deltas ? "text-primary" : "text-danger";
      case 304:
      case 200:
        return "text-primary";
      default:
        return "text-danger";
    }
  },


  statusText: function(status) {
    switch (status) {
      case 200:
        return "Life is good.";
      case 304:
        return "No change since the timestamp supplied in the If-Modified-Since header.";
      case 400:
        return "Syntax error. Your query checking you must.";
      case 401:
        return "Only available on a need to know basis. Login needed.";
      case 403:
        return "Semantic error. The syntax of the query is OK but it makes no sense anyway. Tolerated only on April Fools.";
      case 404:
        return "No results. Mostly harmless, especially if you used updatedAfter.";
      case 406:
        return "Not a supported format. No worries, SDMX is all you need.";
      case 413:
        return "Results too large. You know greed is a sin, right?";
      case 500:
        return "Server error. Someone somewhere is having a bad day.";
      case 501:
        return "Not implemented. Feature coming soon in a web service near you.";
      case 503:
        return "Service unavailable. Try again later.";
      default:
        return "Unknown error code.";
    }
  }
});
