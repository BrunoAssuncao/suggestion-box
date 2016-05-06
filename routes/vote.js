var router = require('express').Router();
var mongo = require('../utils/mongoUtils');
var collectionName = 'suggestions';
var request = require('request');
var collection;

router.post('/', function(req, res) {
    function getCollection() {
        return collection || (collection = mongo.getDb().collection(collectionName));
    }

    var options = req.body,
    id = mongo.getObjectID(options.id),
    like = options.vote === 'like',
    // toPush = like ? "likes" : "dislikes",  //This is commented out because when this logical was applied to check what array should be pushed,
                                              //mongo would create a new array called 'toPush' rather than updating thje like or dislike array.
    pushQuery = like ?  {"likes": options.username} : {"dislikes": options.username}, //This is not 'DRY' because of the reason described above.
    pullQuery = like ? {"dislikes": options.username} : {"likes": options.username};

    getCollection().update(
        {_id: id},
        {
            $addToSet: pushQuery,
            $pull: pullQuery
        }
    );

    getCollection()
    .find({_id: id})
    .toArray( (err, doc) => {
        if(err) {
            console.log(err);
            res.json(err);
        }
        else {
            res.json(doc);
        }
    });
});

module.exports = router;
