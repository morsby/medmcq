const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  votes: Number,
  value: String,
  text: String,
  semester: Number,
  category: String,
  users: [String]
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
