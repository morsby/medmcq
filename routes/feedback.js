var randomstring = require('randomstring');
var _ = require('lodash');
const keys = require('../config/keys');

const permit = require('../permission'); // middleware for checking if user's role is permitted to make request

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

		feedback.title = q.title;
		feedback.text = q.text;
		feedback.author = q.author;

		feedback.save(err => {
			if (err) res.send(err);

			res.json({ message: 'Question created!', id: feedback._id });
		});
	});

	//UPDATE: feedback
	app.put('/api/feedback/:id', (req, res) => {
		Feedback.findById(req.params.id, (err, feedback) => {
			if (err) res.send(err);
			let q = req.body;
			// Opdater noget
			feedback.title = q.title;
			feedback.text = q.text;
			feedback.edited = Date.now();

			feedback.save(err => {
				if (err) res.send(err);

				res.json({ message: 'Feedback opdateret!' });
			});
		});
	});

	// VOTE
	app.put('/api/feedback/:id/vote', (req, res) => {
		Feedback.findById(req.params.id, (err, feedback) => {
			feedback.votes = feedback.votes + Number(req.body.val);
			feedback.save(err => {
				if (err) res.send(err);

				res.json({
					message: 'Der er stemt!',
					id: feedback._id,
					val: req.body.val
				});
			});
		});
	});

	//DELETE: feedback
	app.delete('/api/feedback/:id', permit('admin'), (req, res) => {
		Feedback.remove({ _id: req.params.id }, err => {
			if (err) res.send(err);

			Comment.remove({ feedback_id: req.params.id }, err => {
				if (err) res.send(err);
			});

			res.json({ message: 'Feedback (og kommentarer) er slettet!' });
		});
	});
};
