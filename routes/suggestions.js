var router = require('express').Router();
var mongo = require('../utils/mongoUtils');
var suggestionHandler = require('../utils/suggestionHandler');
var request = require('request');
var Suggestion = require('../models/suggestion');
var SuggestionState = require('../models/state');
var collection;


//GET ALL SUGGESTIONS
router.get('/', function(req, res) {
    // suggestionHandler.getSuggestions(function(err, docs) {
    //     if(err){
    //         console.log(err);
    //         res.json(err);
    //     }
    //     else {
    //         res.json(docs);
    //     }
    // });

    Suggestion.find({}, function(err, docs) {
        if(err){
            console.log(err);
            res.json(err);
        }

        res.json(docs);

    });
});

//SUBMIT NEW SUGGESTION
router.post('/', function (req, res) {
    var newSuggestion = new Suggestion( {
        creator: req.session.username,
        title: req.body.title,
        body: req.body.body,
        likes: [], dislikes: [],
        createdAt: new Date(),
        state: "open",
        updates: []
    });

    newSuggestion.save(function(err) {
        if(err) {
            console.log(err);
            res.json(err);
        }

        res.json(newSuggestion);
    });

   //  suggestionHandler.createNew({
   //      creator: req.session.username,
   //      title: req.body.title,
   //      body: req.body.body,
   //  }, function(err, result){
   //      if ( err ) {
   //             console.error(err);
   //             res.json(err);
   //     }
   //     else {
   //         if ( result && result.insertedCount === 1 ) {
   //             res.status(200);
   //             res.json( { id: result.insertedIds[0] } );
   //         }
   //         else {
   //             res.json(result);
   //         }
   //     }
   // });
});

router.get('/states', function (req, res)  {
    //Couldn't use the 'getCollection' function, even changing the collectionName to 'suggestionStates'
    //It would query the 'suggestions' collection. Changed the getCollection method to accept collectionName as an argument
    // and still didn't worked
    SuggestionState.find({}, function(err, docs) {
        if(err) {
            console.log(err);
            res.json(err);
        }

        res.json(docs);
    });
});


//GET SPECIFIC SUGGESTION
router.get('/:id', function (req, res) {
    Suggestion.findOne({'_id': req.params.id}, function(err, doc) {
        if(err) {
            console.log(err);
            res.json(err);
        }

        res.json(doc);
    });
});

router.post('/:id', function (req, res)  {
    var suggestion = req.body;
    suggestionHandler[suggestion.action](suggestion, function(err, docs){
        if(err) {
            console.log("error: " + err);
            res.json(err);
        }
        else {
            docs.username = req.session.username;
            res.json(docs);
        }
    });
});

router.delete('/:id', function (req, res) {
    suggestionHandler.delete(req.params.id, function(err, docs) {
        res.json("Suggestion " + req.params.id + " deleted!");
    });
});

module.exports = router;
