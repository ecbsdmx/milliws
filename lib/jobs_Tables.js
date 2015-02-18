// Example toggle master detail
TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Events = new Tabular.Table({
  name: "Events",
  collection: Events,
  "dom": '<"#eventList"<if><rt><lp>>',
  "autoWidth": false,
  "deferRender": true,
  "processing": true,
  "stateSave": true,
  "scrollY": "450px",
  "scrollCollapse": false,
  "lengthMenu": [[20, 30, 50, 100, 200], [20, 30, 50, 100, 200]],
  "pagingType": "full_numbers",
  "order": [[1, 'desc']],
  columnDefs: [
    { className: "cellPadding text-center", "targets": [ 0,1,2 ] },
    { className: "cellPadding text-right", "targets": [ 3,4,5,6 ] }
  ],
  columns: [
    {data: 'jobId', title: 'Job'},
    {data: 'etime', title: 'etimems', visible: false},
    {data: 'etime', title: 'Executed on', orderable: false, render: function(value, object) {
      return moment(value).fromNow();
    }},
    {data: 'status', title: 'Status'},
    {data: 'ert', title: 'Expected response time (ms)'},
    
    {data: 'responseTime', title: 'Response time (ms)'},
    {data: 'series', title: '# of series'},
    {data: 'observations', title: '# of observations'}
  ],
  createdRow: function( row, data, dataIndex ) {
    var status = data.status;
    if (status != 200 && status != 404) {
      return 'btn-danger';
    } else if ( data.responseTime > data.ert ) {
      return 'btn-danger';
    } else {
      return '';
    }
  },
  extraFields: ['isActive', 'ert']
});

TabularTables.ExistingJobs = new Tabular.Table({
  name: "ExistingJobs",
  "autoWidth": false,
  "deferRender": true,
  "processing": true,
  collection: Jobs,
  selector:  function() {
    return {isDeleted: false};
  },
  columns: [
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {
      tmpl: Meteor.isClient && Template.JobItemActions
    }
  ],
  extraFields: ['deltas', 'url', 'ert', 'freq', 'isDeleted','isActive']
});

TabularTables.RecycledJobs = new Tabular.Table({
  "autoWidth": false,
  "deferRender": true,
  "processing": true,
  name: "RecycledJobs",
  collection: Jobs,
  selector:  function() {
    return {isDeleted: true};
  },
  columns: [
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {
      tmpl: Meteor.isClient && Template.JobRecycledItemActions
    }
  ],
  extraFields: ['deltas', 'url', 'ert', 'freq', 'isDeleted','isActive']
});


