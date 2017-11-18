var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

const winston = require('winston');
var bunyan = require('bunyan')
var log = bunyan.createLogger({
    name: 'Load Project',
    streams: [{
        level: 'info',
        path: 'bunyan.log'
    }, {
        level: 'error',
        path: 'bunyan-error.log'
    }
    ]
});
log.info('1st test');
log.info('2nd test');

/*
//  winston exaple
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'shopping.log' })
    ]
});

global.log = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            timestamp: () => {
                return new Date().toString()
            },
            json: true
        }),
    ]
});

logger.log('info', 'Hello distributed log files!');
logger.info('Server',' Started :'+Date());

*/

mongoose.connect('mongodb://localhost:27017/shopping', {useMongoClient: true});
require('./config/passport');


var routes = require('./routes/index');
var userRoutes = require('./routes/user');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layouts', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger());//('dev'));//('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(validator());
app.use(session(
    {
        secret: 'mysupersecret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
        cookie: {maxAge: 180 * 60 * 1000}
    }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});
app.use('/user', userRoutes);
app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    logger.info('Error', +err);
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
