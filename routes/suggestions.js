var router = require('express').Router();
var mongo = require('../utils/mongoUtils');
var suggestionHandler = require('../utils/suggestionHandler');
var request = require('request');
var Suggestion = require('../models/suggestion');
var SuggestionState = require('../models/state');
var collection;


//GET ALL SUGGESTIONS
router.get('/', function(req, res) {
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
        creator: req.user.slack.username,
        title: req.body.title,
        body: req.body.body,
        likes: [], dislikes: [],
        createdAt: new Date(),
        state: "Open",
        updates: []
    });

    newSuggestion.save(function(err) {
        if(err) {
            console.log(err);
            res.json(err);
        }

        res.json(newSuggestion);
    });

});

router.get('/states', function (req, res)  {
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
    suggestionHandler[suggestion.action](suggestion, req.user.slack.username, res);
});

router.delete('/:id', function (req, res) {
    Suggestion.remove({
        _id: mongo.getObjectID(req.params.id)
    }, function(err) {
        if(err) {
            console.log(err);
            res.json(err);
        }

        res.json("item deleted!");
    });
});

module.exports = router;
