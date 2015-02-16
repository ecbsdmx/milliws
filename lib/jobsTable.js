TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.ExistingJobs = new Tabular.Table({
  name: "ExistingJobs",
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
  ]
});

TabularTables.RecycledJobs = new Tabular.Table({
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
  ]
});

