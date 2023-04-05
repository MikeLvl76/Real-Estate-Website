const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comments').schema;

const Advertisement = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  publication_status: {
    type: String,
    required: true,
  },
  publication_property: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  pictures: [String],
  comments: [Comment],
});

module.exports = mongoose.model('Advertisement', Advertisement);
