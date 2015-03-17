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
     _id: "dexr-gen",
     name: "Daily exchange rates (Generic)",
     url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
     ert: 1000,
     freq: 1,
     deltas: true,
     isCompressed: false,
     isIMS: false,
     format: "sdmx-generic-2.1"
  });

  Meteor.call('jobInsert', {
     _id: "dexr-json",
     name: "Daily exchange rates (JSON)",
     url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
     ert: 1000,
     freq: 1,
     deltas: true,
     isCompressed: false,
     isIMS: false,
     format: "sdmx-json-1.0.0"
  });

  Meteor.call('jobInsert', {
     _id: "dexr-comp",
     name: "Daily exchange rates (Compact)",
     url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
     ert: 1000,
     freq: 1,
     deltas: true,
     isCompressed: false,
     isIMS: false,
     format: "sdmx-compact-2.1"
  });

  Meteor.call('jobInsert', {
    _id: "m1m3",
    name: "Monetary aggregates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/BSI/M.U2.Y.V.M10+M30.X.I.U2.2300.Z01.A+E",
    ert: 1000,
    freq: 1,
    deltas: false,
    isCompressed: false,
    isIMS: false,
    format: "sdmx-json-1.0.0"
  });

  Meteor.call('jobInsert', {
     _id: "icp-gz",
     name: "Overall inflation in the euro area (Compressed)",
     url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/ICP/M.U2.N.000000.4.ANR",
     ert: 1000,
     freq: 1,
     deltas: false,
     isCompressed: false,
     isIMS: false,
     format: "sdmx-compact-2.1"
  });

  Meteor.call('jobInsert', {
     _id: "icp-fat",
     name: "Overall inflation in the euro area (Uncompressed)",
     url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/ICP/M.U2.N.000000.4.ANR",
     ert: 1000,
     freq: 1,
     deltas: false,
     isCompressed: false,
     isIMS: false,
     format: "sdmx-compact-2.1"
  });

  Meteor.call('jobInsert', {
     _id: "mna",
     name: "GDP in prices of the previous year (IMS)",
     url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/MNA/Q.Y.I7.W2.S1.S1.B.B1GQ._Z._Z._Z.EUR.LR.GY",
     ert: 1000,
     freq: 1,
     deltas: false,
     isCompressed: false,
     isIMS: true,
     format: "sdmx-generic-2.1"
  });
}
