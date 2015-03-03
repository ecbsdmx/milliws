// Example toggle master detail
TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Events = new Tabular.Table({
  name: "Events",
  collection: Events,
  "dom": '<"#eventList"<if><rt><lp>>',
  "autoWidth": true, //REVIEW: Set to true or pass the desired width via column.width
  "deferRender": true,
  "processing": true,
  "stateSave": true,
  "scrollCollapse": false,
  "pagingType": "full_numbers",
  "order": [[1, 'desc']],
  columnDefs: [
    { className: "textCell", "targets": [ 0,1 ] },
    { className: "centerCell", "targets": [ 2 ] },
    { className: "numericCell", "targets": [ 3,4,5,6 ] }
  ],
  columns: [
    {data: 'jobId', title: 'Job', tmpl: Meteor.isClient && Template.jobIdCell},
    {data: 'etime', title: 'Executed on', render: function(value, object) {
      return moment(value).format("YYYY-MM-DD [@] HH:mm");
    }},
    {data: 'status', title: 'Status', tmpl: Meteor.isClient && Template.statusCodeCell},
    {data: 'ert', title: 'Expected response time (ms)'},
    {data: 'responseTime', title: 'Response time (ms)'},
    {data: 'series', title: '# of series'},
    {data: 'observations', title: '# of observations'}
  ],
  extraFields: ['isActive', 'url']
});
