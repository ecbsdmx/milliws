Template.jobPage.events({
    'click #edit': function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Router.go('jobEdit', {_id: this._id});
    },
    'click #delete': function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (confirm("Are you sure you want to delete this monitoring job?")) {
            this.isDeleted = true;
            Meteor.call('jobUpdate', this, function(error, result) {
                if (error) {
                    return alert(error.reason);
                }
                Router.go('jobsList');
            });
        }
    }
});