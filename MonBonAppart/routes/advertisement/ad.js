const express = require('express');
const router = new express.Router();
const Advertisement = require('../../models/advertisement');
const Comment = require('../../models/comments');
const fs = require('fs');
const {resolve} = require('path');
const multer = require('multer');
const multerStorage = multer.diskStorage({
  destination: `./public/uploads/`,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({storage: multerStorage});

/* Go to ads page */
router.get('/', function(req, res, next) {
  Advertisement.find({}).
      exec((err, result) => {
        if (err) console.log(err);
        const array = result.map((value) => value.toJSON());
        res.render('advertisement/ad', {user: req.user, ads: array});
      });
});

/* Create new object (only admin) */
router.get('/create', function(req, res, next) {
  res.render('advertisement/create', {user: req.user});
}) /* Called by form action in order to store in database form fields value */
    .post('/create', upload.any(), function(req, res) {
      if (!req.session.loggedIn || !req.user.admin) {
        return res.status(400);
      }
      const filespath = req.files.map((file) => {
        const filepath = resolve(file.destination, file.originalname);
        return `.${filepath.substring(filepath.indexOf('/uploads'))}`;
      });
      Advertisement.create(new Advertisement({
        title: req.body.title,
        type: req.body.type,
        publication_status: req.body.publication_status,
        publication_property: req.body.publication_property,
        description: req.body.description,
        price: req.body.price,
        date: req.body.date,
        pictures: filespath.length > 0 ? filespath : [],
      }), function(err) {
        if (err) {
          console.log(err);
          return res.render('advertisement/create', {user: req.user});
        }

        res.redirect('/ad');
      });
    });

/* Update object (only admin) */
router.get('/update/:id', function(req, res, next) {
  Advertisement.find({_id: req.params.id}).
      exec((err, result) => {
        if (err) console.log(err);
        res.render('advertisement/update',
            {user: req.user, id: req.params.id, form: result[0].toJSON()});
      });
}) /* Called by form action in order to store in database form fields value */
    .post('/update/:id', upload.any(), function(req, res) {
      if (!req.session.loggedIn || !req.user.admin) {
        return res.status(400);
      }
      // Inserting new image
      const filespath = req.files.map((file) => {
        const filepath = resolve(file.destination, file.originalname);
        return `.${filepath.substring(filepath.indexOf('/uploads'))}`;
      });
      Advertisement.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        type: req.body.type,
        publication_status: req.body.publication_status,
        publication_property: req.body.publication_property,
        description: req.body.description,
        price: req.body.price,
        date: req.body.date,
        pictures: filespath.length > 0 ? filespath : [],
      }, (err, result) => {
        if (err) {
          console.log(err);
          return res.render('advertisement/update', {user: req.user});
        }
        res.redirect('../');
      });
    });

/* Delete existing object (only admin) */
router.get('/delete/:id', function(req, res, next) {
  if (!req.session.loggedIn || !req.user.admin) {
    return res.status(400);
  }
  Advertisement.findByIdAndDelete({_id: req.params.id}, (err, result) => {
    if (err) {
      console.log(err);
      return res.render('advertisement/ad', {user: req.user});
    }
    if (result['pictures'].length > 0) {
      result['pictures'].forEach((pic) => {
        fs.unlinkSync(`${pic.replace('.', './public')}`);
      });
    }
    Comment.find({})
    .exec((e, res) => {
      if (e) {
        console.log(e);
        return res.render('advertisement/ad', {user: req.user});
      }

      if (res.length > 0) {
        res.forEach(v => {
          v.deleteOne({});
        })
      }
    })
    res.redirect('../');
  });
});

/* Access to comments page */
router.get('/:id', function(req, res, next) {
  Advertisement.find({_id: req.params.id}).
      exec((err, result) => {
        if (err) console.log(err);
        res.render('advertisement/comments',
            {user: req.user, id: req.params.id, ad: result[0].toJSON()});
      });
})
    .post('/:id', (req, res) => {
      const comment = new Comment({
        author: req.user.username,
        content: req.body.comment,
        date: new Date().toLocaleString('fr-FR'),
      });
      Comment.create(comment, function(err) {
        if (err) {
          console.log(err);
          return res.render('advertisement/comments', {user: req.user});
        }
      });
      Advertisement.findByIdAndUpdate(req.params.id, {
        $push: {comments: comment},
      }, (err, result) => {
        if (err) {
          console.log(err);
          return res.render('advertisement/comments', {user: req.user});
        }
        res.redirect(`${req.params.id}`);
      });
    });

module.exports = router;
