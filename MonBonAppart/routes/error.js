const express = require('express');
const router = new express.Router();

/* When route is non-recognized, error page is shown */
router.get('*', function(req, res, next) {
  res.render('error', {message: 'Stop here, wrong way !'});
});

module.exports = router;
