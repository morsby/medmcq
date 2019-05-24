const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  text: String,
  semester: Number,
  category: String,
  value: String
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
