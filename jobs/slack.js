var CronJob = require('cron').CronJob;
var mongo = require('../utils/mongoUtils');
var suggestionHandler = require('../utils/suggestionHandler');
var slack = require('../utils/slackIntegration');


module.exports = {
    startJob: function() {
        new CronJob('0 */5 * * * *', function() {
            suggestionHandler.getMostVoted(function(err, doc){
                var message = "This is the most voted suggestion: " + doc.title + " - " + 'http://localhost:8181/#/suggestion/'+ doc._id;

                slack.slackChannel(message, function(error, response, body){
                    if (!error && response.statusCode == 200) {
                        console.log("success");
                    } else {
                        console.log('error: '+ response.statusCode + ' ' + body);
                    }
                });
            });
        }, null, true);
    }
};
