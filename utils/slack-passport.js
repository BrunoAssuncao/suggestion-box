var SlackStrategy = require('passport-slack').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //TODO: losing session after refreshing page
    passport.use('slack', new SlackStrategy({
        // TODO: save this information in a config file
        clientID: "4173363215.47618547495",
        clientSecret: "3673e6d751c486f23cff36654f13cb1f",
        callbackURL: 'http://localhost:8181/auth/slack/callback',
        scope: "users:read"

    }, function(accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'slack.id': profile.id}, function(err, user){
                if(err) {
                    return done(err);
                }

                if(user){
                    return done(null, user);
                }
                else {
                    var newUser = new User({
                        slack: {
                            id: profile.id,
                            token: accessToken,
                            username: profile.displayName
                        },
                        isAdmin: false
                    });

                    newUser.save(function(err) {
                        if(err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });

    }));
};
//
