// Example toggle master detail
TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Events = new Tabular.Table({
  name: "Events",
  collection: Events,
  selector: function() {
    var date = new Date();
    date.setDate(date.getDate() - 2);
    return {etime: {$gte: date}};
  },
  "dom": '<"#eventList" <"row"<"col-xs-6"i><"col-xs-4"f><"#tableButton.col-xs-2">r> <"row"<"col-xs-12"t>> <"row"<"col-xs-6"l><"col-xs-6"p>> >',
  "autoWidth": false, 
  "deferRender": true,
  "processing": true,
  "stateSave": true,
  "scrollCollapse": false,
  "pagingType": "full_numbers",
  "order": [[1, 'desc']],
  columnDefs: [
    { className: "textCell", "targets": [ 0,1 ] },
    { className: "centerCell", "targets": [ 2 ] },
    { "width": 400, orderable: false, className: "bulletCell", "targets": [ 3 ] }, // bullet graph
    { className: "numericCell", "targets": [ 4,5 ] }
  ],
  columns: [
    {data: 'jobId', title: 'Job', tmpl: Meteor.isClient && Template.jobIdCell},
    {data: 'etime', title: 'Executed on', render: function(value, object) {
      return moment(value).format("YYYY-MM-DD [@] HH:mm");
    }},
    {data: 'status', title: 'Status', tmpl: Meteor.isClient && Template.statusCodeCell},
    {data: 'responseTime', title: 'Response time (ms)', tmpl: Meteor.isClient && Template.responseTimeChart},
    {data: 'series', title: '# of series'},
    {data: 'observations', title: '# of observations'}
  ],
  createdRow: function(row, data, dataIndex) {
    if (data.isProblematic) {
      $(row).addClass("rowError");
    }
  },
  extraFields: ['isActive', 'url', 'isProblematic', 'deltas', 'ert']
});
