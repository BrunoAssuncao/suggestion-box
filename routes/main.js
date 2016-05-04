var express = require('express');
var router = express.Router();

var loginOnExchange = require('../utils/loginOnExchange');

//login page by GET
router.get('/login', function (req, res) {
    res.render('login', {title: 'Suggestion Box', title2: 'Please Log In'});
});

//login POST
router.post('/login', function(req, res) {

    var loginData = {
        webmailHost: process.env.WEBMAIL_HOST,
        username: req.body.username,
        password: req.body.password,
        https: true
    };

    loginOnExchange( loginData, function( error, success ) {
        if ( success ) {
            console.log('Login OK');
            req.session.username = req.body.username;
            res.redirect( req.session.destinationUrl || '/' );
        } else {
            req.session.username = undefined;
            res.render('login', {title: 'Suggestion Box', title2: 'Wrong login' });
        }
    });

});

/* GET home/app page. */
router.get('/', function (req, res) {
    res.render('app', {title: 'Suggestion Box'});
});

module.exports = router;
