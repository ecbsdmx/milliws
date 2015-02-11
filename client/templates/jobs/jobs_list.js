Template.jobsList.helpers({
  jobs: function() {
    return Jobs.find();
  },
  settings: function () {
    return {
      rowsPerPage: 25, 
      showNavigation: "auto",
      fields: [
        {key: 'queryId', label: 'Query'},
        {key: 'etime', label: 'Executed on', sortByValue: true, sort: 'descending', fn: function(value, object) {
          return moment(value).fromNow();
        }},
        {key: 'status', label: 'Status'},
        {key: 'responseTime', label: 'Response time (ms)'},
        {key: 'series', label: '# of series'},
        {key: 'observations', label: '# of observations'}
      ], rowClass: function (item) {
        var status = item.status;
        if (status != 200 && status != 404) {
          return 'btn-danger';
        } else if ( item.responseTime > item.ert ) {
          return 'btn-danger';
        } else {
          return '';
        }
      }
    }
  }
});
