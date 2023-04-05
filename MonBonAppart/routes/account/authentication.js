const express = require('express');
const passport = require('passport');
const router = new express.Router();
const Account = require('../../models/account');

// Page for logging in or signing up
router.get('/', function(req, res) {
  res.render('account/authentication', {user: req.user});
});

// Login
router.post('/login',
    passport.authenticate('local', {failureRedirect: '/authentication',
      failureMessage: true}), function(req, res) {
      res.redirect('/');
    });

// Logout
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Register if account doesn't exist
router.post('/register', function(req, res) {
  Account.register(new Account({
    admin: false,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
  }), req.body.password, function(err) {
    if (err) {
      console.log(err);
      return res.render('account/authentication', {user: req.user});
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
});

module.exports = router;
