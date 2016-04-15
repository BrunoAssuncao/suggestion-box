var mongo = require('mongodb');
var client = mongo.MongoClient;
var _db = undefined;

module.exports = {
    connect( callback ) {
        client.connect( process.env.MONGO_CONNECTION_STRING, ( err, db ) => {
            if (err) {
                console.log('Error connecting to mongo!');
                process.exit(1);
            }
            callback( db );
        });
    },
    getDb() {
        return _db;
    }
};