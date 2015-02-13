Template.jobsList.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};

Template.jobsList.helpers({
  isActive: function() {
    var active = 0;
    var suspended = 0;
    this.forEach(function(item) {
      if (item.isActive) {
        active++;
      } else {
        suspended++;
      }
    });
    return active >= suspended;
  },
  settings: function () {
    return {
      rowsPerPage: 15, 
      showNavigation: "auto",
      fields: [
        {key: '_id', label: 'Id'},
        {key: 'name', label: 'Name'},
        {key: "actions", label: 'Actions', tmpl: Template.jobActions}
      ]
    }
  }
});

Template.jobsList.events({
  'click #suspend': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.forEach(function(item) {
      item.isActive = false;
      Meteor.call('jobUpdate', item, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        if (result.urlExists) {
          return alert('There is already a monitoring job for the supplied URL.');
        }
      });
    });

  },
  'click #resume': function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.forEach(function(item) {
      item.isActive = true;
      Meteor.call('jobUpdate', item, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        if (result.urlExists) {
          return alert('There is already a monitoring job for the supplied URL.');
        }
      });
    });
  }
});