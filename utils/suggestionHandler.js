var mongo = require('../utils/mongoUtils');
var slack = require('../utils/slackIntegration');

var handler = {
    getSuggestions: function(callback) {
        return mongo.getDb().collection('suggestions').aggregate([
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
                ]).toArray(callback);

    },
    createNew: function(options, callback) {
        mongo.getDb().collection('suggestions').insert({
            creator: options.creator,
            title: options.title,
            body: options.body,
            likes: [], dislikes: [],
            createdAt: new Date(),
            state: "open",
            updates: []
        }, callback );
    },
    getSuggestion: function(id, callback) {
        return mongo.getDb().collection('suggestions').find({_id: mongo.getObjectID(id)}).limit(1).next(callback);
    },
    vote: function(suggestion, callback) {
        var like = suggestion.vote === 'like',
        //TODO:
        // toPush = like ? "likes" : "dislikes",  //This is commented out because when this logical was applied to check what array should be pushed,
                                                  //mongo would create a new array called 'toPush' rather than updating thje like or dislike array.
        pushQuery = like ?  {"likes": suggestion.username} : {"dislikes": suggestion.username}, //This is not 'DRY' because of the reason described above.
        pullQuery = like ? {"dislikes": suggestion.username} : {"likes": suggestion.username};

        mongo.getDb().collection('suggestions').update(
            {_id: mongo.getObjectID(suggestion._id)},
            {
                $addToSet: pushQuery,
                $pull: pullQuery
            }
        );

        //TODO: is this right? Saving it and the retriving the updated item
        //Why not update it in the frontend and then just saving it
        this.getSuggestion(suggestion._id, callback);

    },
    state: function(suggestion, callback) {
        mongo.getDb().collection('suggestions').update(
            {_id: mongo.getObjectID(suggestion._id)},
            {
                $set: {
                    state: suggestion.state
                }
            }
        );

        this.getSuggestion(suggestion._id, callback);

    },
    update: function(suggestion, callback) {
        mongo.getDb().collection('suggestions').update(
            {_id: mongo.getObjectID(suggestion._id)},
            {
                $push: {"updates": suggestion.update}
            },
            function(err, doc) {
                if(err) {
                    console.log(err);
                }
                else {
                    slack.slackChannel("Suggestion: " + suggestion.title + " has been updated - http://localhost:8181/#/suggestion/"+ suggestion._id, function(error, response, body){
                        if (!error && response.statusCode == 200) {
                            console.log("success");
                        } else {
                            console.log('error: '+ response.statusCode + ' ' + body);
                        }
                    });
                }
            }
        );

        this.getSuggestion(suggestion._id, callback);
    },
    delete: function(id) {
        mongo.getDb().collection('suggestions').remove({
            _id: mongo.getObjectID(id)
        });
    },
    getMostVoted: function(callback) {
        mongo.getDb().collection('suggestions').aggregate([
        {
              $project : {
                  title: "$title",
                  body: "$body",
                  creator: "$creator",
                  score: { $subtract: [
                      { $size: { "$ifNull": [ "$likes", [] ] } },
                      { $size: { "$ifNull": [ "$dislikes", [] ] } }
                  ] }
              }
          },
          {
              $sort: { "score":-1 }
          }
      ])
      .limit(1).next(callback);
    }
};

module.exports = handler;
