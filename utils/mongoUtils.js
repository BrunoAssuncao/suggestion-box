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
            _db = db;
            callback( db );
        });
    },
    getDb() {
        return _db;
    },
    findAll( collection, callback ) {
        _db.collection( collection ).find({}).toArray( (err, docs) => {
            if ( err ) {
                console.error('MONGO ERROR');
                callback([]);
            } else {
                callback(docs);
            }
        });
    },
    getObjectID( id ) {
        return new mongo.ObjectID( id );
    }
};
