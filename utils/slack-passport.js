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
        clientID: process.env.SLACK_CLIENTID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        callbackURL: process.env.SLACK_CALLBACK_URL,
        scope: process.env.SLACK_SCOPE

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
