Template.jobsList.helpers({
    jobs: function() {
        return Jobs.find();
    },
    settings: function () {
        return {
            fields: [
                {key: 'queryId', label: 'Query'},
                {key: 'etime', label: 'Executed on', sort: 'descending'},
                {key: 'status', label: 'Status'},
                {key: 'responseTime', label: 'Response time (ms)'},
                {key: 'series', label: '# of series'},
                {key: 'observations', label: '# of observations'}
            ], rowsPerPage: 30, rowClass: function (item) {
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
