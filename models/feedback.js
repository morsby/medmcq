const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
	// Spørgsmålet
	text: String,
	date: { type: Date, default: Date.now },
	votes: { type: Number, default: 0 },
	solved: { type: Boolean, default: 0 }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
