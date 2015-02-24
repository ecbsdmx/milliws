Template.header.events({
    'click #logout' : function(e, t) {
        e.preventDefault();
        // retrieve the input field values
        Meteor.logout();
    }
});
