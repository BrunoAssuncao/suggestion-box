var router = require('express').Router();
var mongo = require('../utils/mongoUtils');

var loginOnExchange = require('../utils/loginOnExchange');

//login page by GET
router.get('/login', function (req, res) {
    res.render('login', {title: 'Suggestion Box', title2: 'Please Log In', redirectTo: req.session.destinationUrl || "/" });
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
            res.redirect( req.body.redirectTo || '/' );
        } else {
            req.session.username = undefined;
            res.render('login', {title: 'Suggestion Box', title2: 'Wrong login', redirectTo: req.session.destinationUrl || "/"});
        }
    });

});

router.get('/user', function( req, res ) {
    if(req.session.username !== null )

    res.json(req.session.username || "please login first");
});

router.get ('/logout', function(req, res) {
    req.session.destroy();
    res.redirect( '/' );
});

router.get('/admins', function(req, res) {
    mongo.getDb().collection('admins').find({}).toArray( (err, docs) => {
        if( err) {
            console.log( err );
        }
        else {
            var admins = [];

            //TODO: How to achieve this in MongoDB Query
            for( var i = 0; i < docs.length; i+=1) {
                admins.push(docs[i].username);
            }
            res.json(admins);
        }
    });
});

/* GET home/app page. */
router.get('/', function (req, res) {
    res.render('app', {title: 'Suggestion Box', username: req.session.username || ""});
});

module.exports = router;
