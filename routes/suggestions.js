var router = require('express').Router();
var mongo = require('../utils/mongoUtils');
var suggestionHandler = require('../utils/suggestionHandler');
var request = require('request');
var collection = undefined;


//GET ALL SUGGESTIONS
router.get('/', function(req, res) {
    suggestionHandler.getSuggestions(function(err, docs) {
        if(err){
            console.log(err);
            res.json(err);
        }
        else {
            res.json(docs);
        }
    })
});

//SUBMIT NEW SUGGESTION
router.post('/', function (req, res) {

    suggestionHandler.createNew({
        creator: req.session.username,
        title: req.body.title,
        body: req.body.body,
    }, function(err, result){
        if ( err ) {
               console.error(err);
               res.json(err);
       }
       else {
           if ( result && result.insertedCount === 1 ) {
               res.status(200);
               res.json( { id: result.insertedIds[0] } );
           }
           else {
               res.json(result);
           }
       }
    })
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
    suggestionHandler.getSuggestion(req.params.id, function(err, doc) {
        if ( err ) {
            console.error( err );
        } else {
            doc.username = req.session.username;
            res.json(doc);
        }
    });
});

router.post('/:id', (req, res) => {
    console.log(req.body);

    var suggestion = req.body;
    suggestionHandler[suggestion.action](suggestion, function(err, docs){
        if(err) {
            console.log("error: " + err);
            res.json(err);
        }
        else {
            console.log(docs);
            docs.username = req.session.username;
            res.json(docs);
        }
    });
});

router.delete('/:id', (req, res) => {
    suggestionHandler.delete(req.params.id, function(err, docs) {
        res.json("Suggestion " + req.params.id + " deleted!");
    });
});

module.exports = router;
