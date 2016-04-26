var express = require('express');
var router = express.Router();
var mongo = require('../utils/mongoUtils');
var collectionName = 'suggestions';
var request = require('request');
var collection = undefined;

function getCollection() {
    return collection || (collection = mongo.getDb().collection(collectionName));
}


router.get( '/slack', (req, res) => {
    console.log("Hi there!");
    /*getCollection().find().sort({"score":-1}).limit(1).next((err, doc) => {
        var link =  req.protocol + '://' + req.get('host') + '/#/suggestion/'+ doc._id;
        var text = "This is the most voted suggestion: " + doc.title + " - " + link;

        var form = '{"text" : "' + text +'"}';
        var options = {
            uri: process.env.SLACK_ENDPOINT,
            form: form
        };
        request.post(options, function(error, response, body){
            if (!error && response.statusCode == 200) {
                console.log(body.name);
            } else {
                console.log('error: '+ response.statusCode+ ' ' + body);
            }
        });
    });*/
    res.end();
});

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
        doc.username = req.session.username;
        res.json(doc);
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
