Template.jobPage.helpers({
    isActive: function () {
        var response;
        if (this.subscribed) {
            response = "Yes";
        } else {
            response = "No";
        }
        return response;
    }
});

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
            Jobs.remove(this._id);
            Router.go('jobsList');
        }
    }
});