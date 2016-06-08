var mongo = require('../utils/mongoUtils');
var slack = require('../utils/slackIntegration');
var Suggestion = require('../models/suggestion');

var handler = {
    getSuggestion: function(id, callback) {
        Suggestion.findOne({'_id': mongo.getObjectID(id)}, callback);
    },
    vote: function(suggestion, user, res) {
        var like = suggestion.vote === 'like',
        pushQuery = like ?  {"likes": user} : {"dislikes": user},
        pullQuery = like ? {"dislikes": user} : {"likes": user};

        Suggestion.findOneAndUpdate(
            {_id: mongo.getObjectID(suggestion._id)},
            {
                $push: pushQuery,
                $pull: pullQuery
            },
            {new: true},
            function(err, doc) {
                if(err){
                    console.log(err);
                    res.json(err);
                }
                res.json(doc);
            }
        );
    },
    state: function(suggestion, user, res) {
        Suggestion.findOneAndUpdate(
            {_id: mongo.getObjectID(suggestion._id)},
            {
                $set: {
                    state: suggestion.state
                }
            },
            {new: true},
            function(err, doc) {
                if(err){
                    console.log(err);
                    res.json(err);
                }

                res.json(doc);
            }
        );
    },
    update: function(suggestion, user, res) {
        Suggestion.findOneAndUpdate(
            {_id: mongo.getObjectID(suggestion._id)},
            {
                $push: {"updates": suggestion.update}
            },
            {new: true},
            function(err, doc) {
                if(err) {
                    console.log(err);
                }
                else {
                    slack.slackChannel("Suggestion: " + suggestion.title + " has been updated - " + process.env.APP_ADDRESS + "/#/suggestion/"+ suggestion._id, {},  function(error, response, body){
                        if (!error && response.statusCode == 200) {
                            console.log("success");
                        } else {
                            console.log('error: '+ response.statusCode + ' ' + body);
                        }
                    });

                    res.json(doc);
                }
            }
        );
    },
    delete: function(id) {
        Suggestion.findOneAndRemove({
            _id: mongo.getObjectID(id)
        });
    },
    getMostVoted: function(callback) {
        Suggestion.findOne({})
        .sort('-score')
        .exec(callback);
    }
};

module.exports = handler;
