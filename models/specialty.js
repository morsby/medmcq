const mongoose = require('mongoose');

const specialtySchema = mongoose.Schema({
  votes: Number,
  value: String,
  text: String,
  semester: Number,
  category: String,
  users: [String]
});

const Specialty = mongoose.model('Specialty', specialtySchema);

module.exports = Specialty;
