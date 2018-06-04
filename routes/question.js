var uniqWith = require('lodash/uniqWith');
var isEqual = require('lodash/isEqual');

// MODELS
const Question = require('../models/question.js');

module.exports = app => {
	// GET: questions
	app.get('/api/questions', (req, res) => {
		Question.find(function(err, questions) {
			if (err) res.send(err);

			res.json(questions);
		});
	});

	// GET: bestemt spørgsmål
	app.get('/api/questions/:id', (req, res) => {
		let ids = req.params.id.split(',');

		Question.find({ _id: { $in: ids } }, (err, question) => {
			if (err) res.send(err);

			res.json(question);
		});
	});

	// POST: Nyt spørgsmål
	app.post('/api/questions', (req, res) => {
		var question = new Question();

		let q = req.body;

		question.question = q.question;
		question.answer1 = q.answer1;
		question.answer2 = q.answer2;
		question.answer3 = q.answer3;
		question.correctAnswer = q.correctAnswer;

		question.semester = q.semester;
		question.examYear = q.examYear;
		question.examSeason = q.examSeason;
		question.specialty = q.specialty.toLowerCase();
		//question.tags = q.tags.toLowerCase();

		question.save(err => {
			if (err) res.send(err);

			res.json({ message: 'Question created!' });
		});
	});

	// PUT: Opdater et spørgsmål
	app.put('/api/questions/:id', (req, res) => {
		Question.findById(req.params.id, (err, question) => {
			if (err) res.send(err);

			// Opdater spørgsmålet
			// fx question.question = req.params.question;

			question.save(err => {
				if (err) res.send(err);

				res.json({ message: 'Spørgsmålet er opdateret!' });
			});
		});
	});

	// DELETE: Slet et spørgsmål
	app.delete('/api/questions/:id', (req, res) => {
		Question.remove({ _id: req.params.id }, (err, question) => {
			if (err) res.send(err);

			res.json({ message: 'Spørgsmålet er slettet!' });
		});
	});

	// GET: alle spørgsmål fra et semester
	app.get('/api/set/:semester', (req, res) => {
		Question.find(
			{
				semester: req.params.semester
			},
			(err, questions) => {
				if (err) res.send(err);

				res.json(questions);
			}
		);
	});

	// GET: alle spørgsmål fra et bestemt sæt
	app.get('/api/set/:semester/:examYear/:examSeason', (req, res) => {
		Question.find(
			{
				semester: req.params.semester,
				examYear: req.params.examYear,
				examSeason: req.params.examSeason
			},
			(err, questions) => {
				if (err) res.send(err);
				res.json(questions);
			}
		);
	});

	// GET: alle inden for hvert speciale
	app.get('/api/speciale/:semester/:specialty', (req, res) => {
		Question.find(
			{
				semester: req.params.semester,
				specialty: req.params.specialty
			},
			(err, questions) => {
				if (err) res.send(err);

				res.json(questions);
			}
		);
	});

	/**
	 * ======================================================================
	 * Fanger kun antal spørgsmål og fordeling af Specialer samt eksamenssæt
	 * ======================================================================
	 */

	// GET antal på semesteret
	app.get('/api/count/:semester', (req, res) => {
		Question.find({ semester: req.params.semester })
			.select(['specialty', 'examSeason', 'examYear'])
			.exec((err, questions) => {
				if (err) res.send(err);

				res.json(questions);
			});
	});

	// GET de enkelte sæt på semesteret
	app.get('/api/count/sets/:semester', (req, res) => {
		/*Question.aggregate(
			[
				{ $match: { semester: Number(req.params.semester) } },
				{
					$project: {
						eksamensdato: {
							$concat: [
								{ $substrBytes: ['$examYear', 0, 4] },
								' - ',
								'$examSeason'
							]
						}
					}
				}
			],*/
		Question.find(
			{ semester: req.params.semester },
			'-_id examSeason examYear',
			(err, questions) => {
				if (err) res.send(err);

				let unique = uniqWith(questions, isEqual);

				res.json(unique);
			}
		);
	});

	// GET antal på semesteret og speciale
	app.get('/api/count/:semester/:specialty', (req, res) => {
		Question.find({
			semester: req.params.semester,
			specialty: req.params.specialty
		})
			.select(['specialty', 'examSeason', 'examYear'])
			.exec((err, questions) => {
				if (err) res.send(err);

				res.json(questions);
			});
	});
};
