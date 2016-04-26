var express = require('express');
var router = express.Router();
var mongo = require('../utils/mongoUtils');
var collectionName = 'suggestions';
var collection = undefined;

function getCollection() {
    return collection || (collection = mongo.getDb().collection(collectionName));
}

//GET ALL SUGGESTIONS
router.get('/', (req, res) => {
    mongo.findAll(collectionName, (docs) => {
        docs.username = req.session.username;
        res.json(docs);
    });
});

//GET SPECIFIC SUGGESTION
router.get('/:id', (req, res) => {
    var id = mongo.getObjectID(req.params.id);
    getCollection().find({_id: id}).limit(1).next((err, doc) => {
        if ( err ) {
            console.error( err );
        } else {
            doc.username = req.session.username;
            res.json(doc);
        }
    });
});

//SUBMIT NEW SUGGESTION
router.post('/', (req, res) => {
    mongo.findAll('suggestions', (docs) => {
        console.log(docs);
        res.json(docs);
    });
});

module.exports = router;
