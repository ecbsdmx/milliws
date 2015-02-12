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
    var job1 = {
        _id: "dexr",
        name: "Daily exchange rates",
        url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/EXR/D.NOK+CAD+RUB.EUR.SP00.A",
        ert: 1000,
        freq: 1,
        isDeleted: false,
        isActive: true
    };
    var job2 = {
        _id: "m1m3",
        name: "Monetary aggregates",
        url: "http://a-sdw-wsrest.ecb.europa.eu/service/data/BSI/M.U2.Y.V.M10+M30.X.I.U2.2300.Z01.A+E",
        ert: 1000,
        freq: 1,
        isDeleted: false,
        isActive: true
    };
    Jobs.insert(job1);
    Jobs.insert(job2);
}
