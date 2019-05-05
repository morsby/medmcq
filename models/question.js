const mongoose = require('mongoose');
const random = require('mongoose-simple-random');

const Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  // Spørgsmålet
  question: String,
  answer1: String,
  answer2: String,
  answer3: String,
  correctAnswer: {},

  // Metadata, til filtrering
  semester: Number, // hvilket kandidatsemester?
  examYear: Number, // hvornår blev spørgsmålet stillet?
  examSeason: String, // forår el. efterår?
  specialty: [String],
  tags: [],
  image: String,
  image_id: String,
  comments: [
    {
      user: String,
      user_id: mongoose.Schema.Types.ObjectId,
      date: { type: Date, default: Date.now },
      comment: String,
      private: { type: Boolean, default: false },
      anonymous: { type: Boolean, default: false }
    }
  ],
  votes: [{ specialty: String, users: [String] }],
  tagVotes: [{ tag: String, users: [String] }],
  disclaimer: String
});

QuestionSchema.plugin(random);

module.exports = mongoose.model('Question', QuestionSchema);
