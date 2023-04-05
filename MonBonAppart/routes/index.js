const express = require('express');
const router = new express.Router();
const Account = require('../models/account');

// Home page
router.get('/', function(req, res, next) {
  Account.find({admin: true}).
      exec((err, result) => {
        if (err) console.log(err);
        if (result.length === 0) {
          return res.render('account/admin', {user: req.user, allow: true});
        }
        res.render('index', {user: req.user});
      });
});

module.exports = router;
