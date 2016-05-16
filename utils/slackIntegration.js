var request = require('request');

module.exports = {
    slackChannel: function(message, callback) {
        var options = {
            uri: process.env.SLACK_ENDPOINT,
            form: '{"text" : "' + message +'"}'
        };

        request.post(options, callback);
    }
};
