var CronJob = require('cron').CronJob;
var mongo = require('../utils/mongoUtils');
var suggestionHandler = require('../utils/suggestionHandler');
var slack = require('../utils/slackIntegration');


module.exports = {
    startJob: function() {
        new CronJob(process.env.SLACK_TIME_HOOK, function() {
            suggestionHandler.getMostVoted(function(err, doc){
                if(doc && doc.score > 0) {
                    var message = "This is the top voted suggestion from last week: ";
                    var attachement = [{
                        "title": doc.title,
                        "text": process.env.APP_ADDRESS + "#/suggestion/" + doc._id ,
                        "pretext": "Score: " + doc.score
                    }];

                    slack.slackChannel(message, attachement, function(error, response, body){
                        if (!error && response.statusCode == 200) {
                            console.log("success");
                        } else {
                            console.log('error: '+ response.statusCode + ' ' + body);
                        }
                    });
                }
            });
        }, null, true);
    }
};
