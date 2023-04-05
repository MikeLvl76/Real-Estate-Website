const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Prevent redundant lines with require()
// If file inside folder is a folder : recursive call
// Dict stores require() return value with files
const requireDirectory = (dir, res) => {
  fs.readdirSync(dir, {withFileTypes: true}).forEach((file) => {
    if (file.isDirectory()) {
      requireDirectory(`${dir}/${file.name}`, res);
      return;
    }
    const filename = file.name.substring(0, file.name.indexOf('.'));
    res[filename] = require(`${dir}/${filename}`);
  });
  return res;
};

const files = requireDirectory('./routes', {});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', files['index']);
app.use('/admin', files['admin']);
app.use('/authentication', files['authentication']);
app.use('/ad', files['ad']);
app.use('*', files['error']);

const Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/mon_bon_appart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((err) => console.log('CONNECT', err))
    .finally(console.log('Database connected !'));

module.exports = app;
