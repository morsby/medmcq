const mongoose = require('mongoose');

const specialtySchema = mongoose.Schema({
  text: String,
  semester: Number,
  category: String,
  value: String
});

const Specialty = mongoose.model('Specialty', specialtySchema);

module.exports = Specialty;
