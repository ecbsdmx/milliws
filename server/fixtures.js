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
  /*
  Jobs.insert({
    _id: "dexr-json-c",
    name: "Daily exchange rates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: true,
    isIMS: false,
    format: "SDMX-JSON"
  });

  Jobs.insert({
    _id: "dexr-xmlGen-c",
    name: "Daily exchange rates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: true,
    isIMS: false,
    format: "SDMX-ML 2.1 Generic"
  });
  Jobs.insert({
    _id: "dexr-xmlStruct-c",
    name: "Daily exchange rates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: true,
    isIMS: false,
    format: "SDMX-ML 2.1 Structure"
  });

  Jobs.insert({
    _id: "dexr-json-nc",
    name: "Daily exchange rates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: false,
    isIMS: false,
    format: "SDMX-JSON"
  });
  Jobs.insert({
    _id: "dexr-xmlGen-nc",
    name: "Daily exchange rates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: false,
    isIMS: false,
    format: "SDMX-ML 2.1 Generic"
  });
  Jobs.insert({
    _id: "dexr-xmlStruct-nc",
    name: "Daily exchange rates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: false,
    isIMS: false,
    format: "SDMX-ML 2.1 Structure"
  });

  Jobs.insert({
    _id: "m1m3",
    name: "Monetary aggregates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/BSI/M.U2.Y.V.M10+M30.X.I.U2.2300.Z01.A+E",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: false,
    isIMS: false,
    format: "SDMX-JSON"
  });

  Jobs.insert({
    _id: "m1m3-IMS",
    name: "Monetary aggregates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/BSI/M.U2.Y.V.M10+M30.X.I.U2.2300.Z01.A+E",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: false,
    isIMS: true,
    format: "SDMX-JSON"
  });
*/
  Jobs.insert({
    _id: "dexr",
    name: "Daily exchange rates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: true,
    isIMS: false,
    format: "SDMX-JSON"
  });
  Jobs.insert({
    _id: "dexru",
    name: "Daily exchange rates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: false,
    isIMS: false,
    format: "SDMX-JSON"
  });
  Jobs.insert({
    _id: "m1m3",
    name: "Monetary aggregates",
    url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/BSI/M.U2.Y.V.M10+M30.X.I.U2.2300.Z01.A+E",
    ert: 1000,
    freq: 1,
    isDeleted: false,
    isActive: true,
    deltas: true,
    isCompressed: true,
    isIMS: false,
    format: "SDMX-JSON"
  });
}
