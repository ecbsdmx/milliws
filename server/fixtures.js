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

// Add default jobs (only for testing)
if (Jobs.find().count() === 0) {

  Meteor.call('jobInsert', {
     _id: "dexr",
     name: "Daily exchange rates",
     url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
     ert: 1000,
     freq: 1,
     deltas: true,
     isCompressed: true,
     isIMS: false,
     format: "sdmx-json-1.0.0"
   });

   Meteor.call('jobInsert', {
    _id: "m1m3",
    name: "Monetary aggregates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/BSI/M.U2.Y.V.M10+M30.X.I.U2.2300.Z01.A+E",
    ert: 1000,
    freq: 1,
    deltas: false,
    isCompressed: true,
    isIMS: false,
    format: "sdmx-json-1.0.0"
  });
}
