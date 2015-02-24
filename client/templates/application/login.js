Template.login.events({

    'submit #login-form' : function(e, t){
        e.preventDefault();
        // retrieve the input field values
        var username = t.find('#login-uid').value,
            password = t.find('#login-password').value;

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(username, password, function(err){
            if (err) {
                alert("Could not login");
            }
        });
        return false;
    }
});