// Create basic users
if (Meteor.users.find().count() === 0) {
    Accounts.createUser({
        username: 'admin',
        password: 'testadmin',
        profile: {
            login: 'admin',
            isAdmin: true
        }
    });

    Accounts.createUser({
        username: 'user',
        password: 'testuser',
        profile: {
            login: 'user',
            isAdmin: false
        }
    });
}
