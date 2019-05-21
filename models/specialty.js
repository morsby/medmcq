const mongoose = require('mongoose');

const specialtySchema = mongoose.Schema({
  value: String,
  text: String,
  semester: Number,
  category: String
});

const Specialty = mongoose.model('Specialty', specialtySchema);

module.exports = Specialty;
