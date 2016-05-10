var router = require('express').Router();
var mongo = require('../utils/mongoUtils');
var collectionName = 'suggestions';
var request = require('request');
var collection = undefined;

function getCollection() {
    return collection || (collection = mongo.getDb().collection(collectionName));
}

//GET ALL SUGGESTIONS
router.get('/', (req, res) => {
    getCollection().aggregate([
    {
        $project : {
            title: "$title",
            body: "$body",
            creator: "$creator",
            createdAt:  "$createdAt",
            score: { $subtract: [
                { $size: { "$ifNull": [ "$likes", [] ] } },
                { $size: { "$ifNull": [ "$dislikes", [] ] } }
            ] }
        }
    },
    {
        $sort: { "score":-1 }
    }
    ]).toArray( (err, docs) => {
        if ( err ) {
            console.error(err);
            res.json(err);
        } else {
            res.json(docs);
        }
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
    getCollection().insert({
        creator: req.session.username,
        title: req.body.title,
        body: req.body.body,
        likes: [], dislikes: [],
        createdAt: new Date()
    }, (err, result) => {
        if ( err ) {
            console.error(err);
            res.json(err);
        } else {
            if ( result && result.insertedCount === 1 ) {
                res.status(200);
                res.json( { id: result.insertedIds[0] } );
            } else {
                res.json(result);
            }
        }
    });
});

module.exports = router;
