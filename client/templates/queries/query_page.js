Template.queryPage.helpers({
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

Template.queryPage.events({
    'click #edit': function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Router.go('queryEdit', {_id: this._id});
    },
    'click #delete': function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (confirm("Are you sure you want to delete this monitoring query?")) {
            Queries.remove(this._id);
            Router.go('queryList');
        }
    }
});