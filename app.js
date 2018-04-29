/*=====================================#########################===============================*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*=====================================#########################===============================*/

/*=====================================#########################===============================*/
// custom middlewares
var logger = require('./middlewares/logger');
var routeguard = require('./middlewares/routeguard');

/*=====================================#########################===============================*/
// moogoonse

/*=====================================#########################===============================*/

var conf = require('./config/configuration');
var mongoose = require('mongoose');
var mongoDB = `mongodb://${conf.mongo.host}/${conf.mongo.database}`;
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// moogoonse end
/*=====================================#########################===============================*/

/*=====================================#########################===============================*/

var index = require('./routes/index');
var users = require('./routes/users');
var location = require('./routes/location');

/*=====================================#########################===============================*/


//Set up default mongoose connection

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger.log);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.disable('x-powered-by');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', index);
app.use('/user', users);
app.use('/location', routeguard.secure, location);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // console.log("hofasd");
  console.log(err);

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;