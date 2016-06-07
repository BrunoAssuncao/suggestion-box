var router = require('express').Router();
var mongo = require('../utils/mongoUtils');
var Admin = require('../models/admin');
var apiInitializer = require('../utils/apiInitializer');
var loginOnExchange = require('../utils/loginOnExchange');

module.exports = function(app, passport) {
    app.get('/login', function (req, res) {
        res.render('login', {title: 'Suggestion Box', title2: 'Please Log In', redirectTo: req.session.destinationUrl || "/" });
    });

    // app.post('/login', function(req, res) {
    //     var loginData = {
    //         webmailHost: process.env.WEBMAIL_HOST,
    //         username: req.body.username,
    //         password: req.body.password,
    //         https: true
    //     };
    //
    //     loginOnExchange( loginData, function( error, success ) {
    //         if ( success ) {
    //             console.log('Login OK');
    //             req.session.username = req.body.username;
    //             res.redirect( req.body.redirectTo || '/' );
    //         } else {
    //             req.session.username = undefined;
    //             res.render('login', {title: 'Suggestion Box', title2: 'Wrong login', redirectTo: req.session.destinationUrl || "/"});
    //         }
    //     });
    //
    // });

	app.get('/auth/slack', passport.authenticate('slack'));

    app.get('/auth/slack/callback', passport.authenticate('slack', {failureRedirect: '/login' }), function(req, res) {
        res.redirect('/');
    });

    app.get('/user', function( req, res ) {
        res.json(req.session.username || "please login first");
    });

    app.get ('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/admins', function(req, res) {
        Admin.find({}, function(err, docs) {
            if(err) {
                console.log(err);
                res.json(err);
            }

            res.json(docs);
        });
    });

    /* GET home/app page. */
    app.get('/', isLoggedIn, function (req, res) {
        res.render('app', {title: 'Suggestion Box', username: req.user.slack.username || ""});
    });
};

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
