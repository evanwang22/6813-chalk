var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var index = require('./routes/index');
var blog = require('./routes/blog');
var users = require('./routes/users');
var signup = require('./routes/signup');
var login = require('./routes/login');
var calendar = require('./routes/calendar');
var favorites = require('./routes/favorites');

var fs = require('fs');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/chalkapp');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

app.use(require('connect-multiparty')());

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/users', users);
app.use('/blog', blog);
app.use('/login', login);
app.use('/signup', signup);
app.use('/calendar', calendar);
app.use('/favorites', favorites);
app.use('/', index);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);r
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
