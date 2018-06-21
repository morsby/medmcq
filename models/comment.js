const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var CommentSchema = new Schema({
	feedback_id: { type: Schema.Types.ObjectId, ref: 'Feedback' },
	parent_id: Schema.Types.ObjectId, // hvis svar på anden kommentar
	slug: String,
	full_slug: String,
	date: { type: Date, default: Date.now },
	votes: { type: Number, default: 0 },
	author: String,
	text: String
});

CommentSchema.index({ feedback_id: 1, date: 1 }); // schema level
CommentSchema.index({ feedback_id: 1, full_slug: 1 }); // schema level
module.exports = mongoose.model('Comment', CommentSchema);
