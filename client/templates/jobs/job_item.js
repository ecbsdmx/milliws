Template.jobItem.events({
    'click #pause': function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.isActive = false;
        Meteor.call('jobUpdate', this, function(error, result) {
            if (error) {
                return alert(error.reason);
            }
            if (result.urlExists) {
                return alert('There is already a monitoring job for the supplied URL.');
            }
        });
    },
    'click #play': function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.isActive = true;
        Meteor.call('jobUpdate', this, function(error, result) {
            if (error) {
                return alert(error.reason);
            }
            if (result.urlExists) {
                return alert('There is already a monitoring job for the supplied URL.');
            }
        });
    }
});