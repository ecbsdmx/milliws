// Example toggle master detail
TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

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
  extraFields: ['url', 'ert', 'freq', 'isDeleted','isActive']
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
  extraFields: ['url', 'ert', 'freq', 'isDeleted','isActive']
});


