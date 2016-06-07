var request = require('request');

module.exports = {
    slackChannel: function(message, attachement, callback) {
        var options = {
            uri: process.env.SLACK_ENDPOINT,
            form:  '{"text" : "' + message +'", "attachments":'+ JSON.stringify(attachement) +'}'
        };

        request.post(options, callback);
    }
};
