var CronJob = require('cron').CronJob;
var request = require('request');
var mongo = require('./mongoUtils');
var collectionName = 'suggestions';
var collection;

function getCollection() {
    return collection || (collection = mongo.getDb().collection(collectionName));
}

module.exports = {
    startJob() {
        //TODO: change to a date formate, so that it can print a message in slack every week
        new CronJob('0 */5 * * * *', () => {
           getCollection().aggregate([
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
         .limit(1).next((err, doc) => {
                var link =  'http://localhost:8181/#/suggestion/'+ doc._id;
                var text = "This is the most voted suggestion: " + doc.title + " - " + link;

                var form = '{"text" : "' + text +'"}';
                var options = {
                    uri: process.env.SLACK_ENDPOINT,
                    form: form
                };

                request.post(options, function(error, response, body){
                    if (!error && response.statusCode == 200) {
                        console.log("success");
                    } else {
                        console.log('error: '+ response.statusCode+ ' ' + body);
                    }
                });
            });

        }, null, true);
    }
};
