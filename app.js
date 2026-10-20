require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Security stuff
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression');
const rateLimit = require('express-rate-limit')

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Security middleware

app.use(helmet());
app.use(compression());

if(process.env.NODE_ENV == "production"){
  app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }))
} else if (process.env.NODE_ENV == "development") {
  app.use(cors({
    origin: `http://localhost:${process.env.PORT || 3000} `,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }))
}  else {
  console.log("No NODE_ENV found, Skipping CORS!")
}

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:100
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
