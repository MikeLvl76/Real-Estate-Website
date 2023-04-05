const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comments = new Schema({
  author: {
    type: String
  },
  content: {
    type: String,
  },
  date: {
    type: String,
  },
});

module.exports = mongoose.model('Comments', Comments);
