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
/*
if (Meteor.queries.find() === 0) {
  q = {
    name: "Demo query 1",
    url: "http://sdw-wsrest.ecb.europa.eu/service/data/EXR/M.USD.EUR.SP00.A",
    subscribed: false,
    ert: 2000,
    ent: 2000,
    freq: 1000
  }
  Meteor.call('queryInsert', q, function(error, result) {
    // display the error to the user and abort
    if (error)
      return alert(error.reason);
    Router.go('postPage', {_id: result._id});
  });
}
*/
