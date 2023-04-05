const express = require('express');
const router = new express.Router();
const Account = require('../../models/account');

// Admin page
router.get('/', function(req, res, next) {
  res.render('account/admin', {user: req.user, allow: false});
}) // Register if account doesn't exist
    .post('/register', function(req, res) {
      Account.register(new Account({
        admin: true,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
      }), req.body.password, function(err) {
        if (err) {
          console.log(err);
          return res.render('account/admin', {user: req.user, allow: false});
        }

        res.redirect('/');
      });
    });

module.exports = router;
