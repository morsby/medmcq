var randomstring = require('randomstring');
var _ = require('lodash');
const keys = require('../config/keys');

// MODELS
const Feedback = require('../models/feedback.js');
const Comment = require('../models/comment.js');

module.exports = app => {
	// GET: feedback
	app.get('/api/feedback', (req, res) => {
		Feedback.find(function(err, feedback) {
			if (err) res.send(err);

			res.json(feedback);
		});
	});

	// GET: feedback id
	app.get('/api/feedback/:id', (req, res) => {
		Feedback.findById(req.params.id).exec(async (err, feedback) => {
			if (err) res.send(err);

			let comments = await Comment.find({
				feedback_id: req.params.id
			})
				.sort('full_slug')
				.exec();

			let ret = { feedback, comments };
			res.json(ret);
		});
	});

	// POST: feedback
	app.post('/api/feedback', (req, res) => {
		var feedback = new Feedback();
		let q = req.body;

		feedback.text = q.feedback;
		feedback.save(err => {
			feedback.save(err => {
				if (err) res.send(err);

				res.json({ message: 'Question created!' });
			});
		});
	});

	//UPDATE: feedback
	app.put('/api/feedback/:id', (req, res) => {
		Feedback.findById(req.params.id, (err, feedback) => {
			if (err) res.send(err);

			// Opdater noget
			feedback.save(err => {
				if (err) res.send(err);

				res.json({ message: 'Feedback opdateret!' });
			});
		});
	});

	//DELETE: feedback
	app.delete('/api/feedback/:id', (req, res) => {
		Feedback.remove({ _id: req.params.id }, err => {
			if (err) res.send(err);

			Comment.remove({ feedback_id: req.params.id }, err => {
				if (err) res.send(err);
			});

			res.json({ message: 'Feedback (og kommentarer) er slettet!' });
		});
	});
};
