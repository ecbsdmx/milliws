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
    { className: "textCell", "targets": [ 0,1,2 ] },
    { className: "numericCell", "targets": [ 3,4,5,6 ] }
  ],
  columns: [
    {data: 'jobId', title: 'Job'},
    {data: 'etime', title: 'etimems', visible: false},
    {data: 'etime', title: 'Executed on', orderable: false, render: function(value, object) {
      return moment(value).format('llll');
    }},
    {data: 'status', title: 'Status'},
    {data: 'ert', title: 'Expected response time (ms)'},
    {data: 'responseTime', title: 'Response time (ms)'},
    {data: 'series', title: '# of series'},
    {data: 'observations', title: '# of observations'}
  ],
  createdRow: function(row, data, dataIndex) {
    if (dataIndex == 4) { // status col
      var status = data[4];
      if (status != 200 && status != 404) {
        $(row).addClass('btn-danger');
      } else if ( data.responseTime > data.ert ) {
        $(row).addClass('btn-danger');
      } else {
        return '';
      }
    }
  },
  extraFields: ['isActive', 'ert']
});


