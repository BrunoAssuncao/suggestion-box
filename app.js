var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var CronJob = require('cron').CronJob;


var mongo = require('./utils/mongoUtils');
var userSession = require('./utils/userSession');

var mainRouter = require('./routes/main');
var suggestionsRouter = require('./routes/suggestions');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongo.connect(( db ) => {

    app.use(logger('dev'));
    app.use(session({
        secret: 'suggestion_$£cr3T',
        name: 'e.near-suggestion-box',
        saveUninitialized: false, // don't create session until something stored
        resave: false, // don't save session if unmodified
        store: new MongoStore( { db } )
    }));
    app.use(userSession); //making sure user is logged in
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(require('node-compass')({mode: 'expanded'}));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/suggestions', suggestionsRouter);
    app.use('/', mainRouter);

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

});


module.exports = app;
