const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var QuestionSchema = new Schema({
	// Spørgsmålet
	question: String,
	answer1: String,
	answer2: String,
	answer3: String,
	correctAnswer: Number,

	// Metadata, til filtrering
	semester: Number, // hvilket kandidatsemester?
	examYear: Number, // hvornår blev spørgsmålet stillet?
	examSeason: String, // forår el. efterår?
	specialty: [
		{
			type: String
		}
	],
	tags: [
		{
			type: String
		}
	],
	image: String,
	image_id: String
});

module.exports = mongoose.model('Question', QuestionSchema);
