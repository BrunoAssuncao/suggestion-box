var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongo = require('./utils/mongoUtils');
var passport = require('passport');
var suggestionsRouter = require('./routes/suggestions');
var usersRouter = require('./routes/users');
var slack = require('./jobs/slack');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var app = express();
require('./config');

mongoose.connect(process.env.MONGO_CONNECTION_STRING);

require('./utils/slack-passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('node-compass')({mode: 'expanded'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//session setup
app.use(session({ secret: 'suggestion_$£cr3T' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/suggestions', suggestionsRouter);
app.use('/users', usersRouter);

require('./routes/main')(app, passport);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
