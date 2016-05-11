var router = require('express').Router();
var mongo = require('../utils/mongoUtils');
var request = require('request');
var collection = undefined;


//GET ALL SUGGESTIONS
router.get('/', (req, res) => {
    mongo.getDb().collection('suggestions').aggregate([
    {
        $project : {
            title: "$title",
            body: "$body",
            creator: "$creator",
            createdAt:  "$createdAt",
            score: { $subtract: [
                { $size: { "$ifNull": [ "$likes", [] ] } },
                { $size: { "$ifNull": [ "$dislikes", [] ] } }
            ] },
            state: "$state"
        }
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

router.get('/states', (req, res) => {
    //Couldn't use the 'getCollection' function, even changing the collectionName to 'suggestionStates'
    //It would query the 'suggestions' collection. Changed the getCollection method to accept collectionName as an argument
    // and still didn't worked
    mongo.getDb().collection('suggestionStates').find({}).toArray( (err, docs) => {
        if( err) {
            console.log( err );
        }
        else {
            res.json(docs);
        }
    });
});

router.post('/states', (req, res) => {
    var suggestion = req.body;

    mongo.getDb().collection('suggestions').update(
        {_id: mongo.getObjectID(suggestion._id)},
        {
            $set: {
                state: suggestion.state
            }
        }
    );
});

//GET SPECIFIC SUGGESTION
router.get('/:id', (req, res) => {
    var id = mongo.getObjectID(req.params.id);
    mongo.getDb().collection('suggestions').find({_id: id}).limit(1).next((err, doc) => {
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
    mongo.getDb().collection('suggestions').insert({
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
