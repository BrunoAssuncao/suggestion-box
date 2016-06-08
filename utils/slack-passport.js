var SlackStrategy = require('passport-slack').Strategy;
var apiInitializer = require('./apiInitializer');
var User = require('../models/user');
var Admin = require('../models/admin');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('slack', new SlackStrategy({
        clientID: process.env.SLACK_CLIENTID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        callbackURL: process.env.SLACK_CALLBACK_URL,
        scope: process.env.SLACK_SCOPE,
        extendedUserProfile: true

    }, function(accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            if(profile._json.team_id !== process.env.SLACK_TEAM_ID){
                return done(null, false);
            }

            User.findOne({'slack.id': profile.id}, function(err, user){
                if(err) {
                    return done(err);
                }

                if(user){
                    return done(null, user);
                }
                else {
                    Admin.findOne({"username": profile.displayName}, function(err, doc) {
                        if(err) {
                            return done(err);
                        }

                        var newUser = new User({
                            slack: {
                                id: profile.id,
                                token: accessToken,
                                username: profile.displayName
                            },
                            isAdmin: doc ? true : false
                        });

                        newUser.save(function(err) {
                            if(err) {
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    });
                }
            });
        });

    }));
};
//
