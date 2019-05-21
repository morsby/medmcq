const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  value: String,
  text: String,
  semester: Number,
  category: String
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
