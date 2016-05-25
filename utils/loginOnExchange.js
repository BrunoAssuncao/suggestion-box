var https = require('https');
var http = require('http');
var querystring = require('querystring');

module.exports = function doLogin( options, callback ) {
    var jsonPostData = {
        'destination': 'https://' + options.webmailHost + '/owa',
        'flags': 4,
        'forcedownlevel': 0,
        'username': options.username,
        'password': options.password,
        'passwordText': '',
        'isUtf8': 1
    };
    var postData = querystring.stringify(jsonPostData);

    var requestOptions = {
        hostname: options.webmailHost,
        port: options.https ? 443 : 80,
        path: '/owa/auth.owa',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    var req = (options.https ? https : http).request( requestOptions, function(res) {
        if (res.headers.location === jsonPostData.destination) {
            callback( undefined, true );
        } else {
            callback( undefined, false );
        }
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        callback( e, false );
    });

    // write data to request body
    req.write(postData);

    req.end();
};
