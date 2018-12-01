const keys = require("../config/keys");

const permit = require("../permission"); // middleware for checking if user's role is permitted to make request

var uniqWith = require("lodash/uniqWith");
var isEqual = require("lodash/isEqual");
var sanitizeHtml = require("sanitize-html");
var _ = require("lodash");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
var cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: keys.cloudinary_cloud_name,
    api_key: keys.cloudinary_api_key,
    api_secret: keys.cloudinary_api_secret
});

// MODELS
const Question = require("../models/question.js");
const User = require("../models/user.js");

module.exports = app => {
    // GET: questions
    app.get("/api/questions", (req, res) => {
        Question.find(function(err, questions) {
            if (err) res.send(err);

            res.json(questions);
        });
    });

    // GET: tilfældige spørgsmål
    app.get("/api/questions/random", (req, res) => {
        let { n, specialer, unique, semester } = req.query;

        let answeredQuestions = [];

        if (req.user && unique) {
            let userAnsweredQuestions = req.user.answeredQuestions;
            _.map(userAnsweredQuestions, s =>
                answeredQuestions.push(Object.keys(s))
            );
            answeredQuestions = _.flatten(answeredQuestions);
        }

        let filter = {
            _id: { $nin: answeredQuestions },
            semester: { $eq: semester }
        };

        if (specialer) {
            filter.specialty = { $in: specialer.split(",") };
        }

        Question.findRandom(filter, {}, { limit: n }, (err, questions) => {
            if (err) res.send(err);

            if (!questions) {
                let filter2 = { ...filter };
                delete filter2._id;
                Question.findRandom(
                    filter2,
                    {},
                    { limit: n },
                    (err, questions) => {
                        if (err) res.send(err);
                        res.json(questions);
                    }
                );
            } else {
                res.json(questions);
            }
        });
    });

    // GET: bestemt spørgsmål
    app.get("/api/questions/:id", (req, res) => {
        let ids = req.params.id.split(",");

        Question.find({ _id: { $in: ids } }, (err, question) => {
            if (err) res.send(err);

            res.json(question);
        });
    });

    // POST: hent bestemt spørgsmål (skal være post af hensyn til URL-længde)
    app.post("/api/questions/ids/", (req, res) => {
        let ids = req.body.ids;
        Question.find({ _id: { $in: ids } }, (err, question) => {
            if (err) res.send(err);

            res.json(question);
        });
    });

    /*// POST: Nyt spørgsmål
    app.post("/api/questions", upload.single("image"), function(req, res) {
        var question = new Question();

        let q = req.body;

        question.question = sanitizeHtml(q.question);
        question.answer1 = sanitizeHtml(q.answer1);
        question.answer2 = sanitizeHtml(q.answer2);
        question.answer3 = sanitizeHtml(q.answer3);
        question.correctAnswer = q.correctAnswer;

        question.semester = q.semester;
        question.examYear = q.examYear;
        question.examSeason = q.examSeason;
        question.specialty = q.specialty.split(",");
        //question.tags = q.tags.toLowerCase();

        if (!req.file) {
            question.save(err => {
                if (err) res.send(err);

                res.json({ message: "Question created!" });
            });
        } else {
            // Uncomment når der skal uploades
            cloudinary.v2.uploader
                .upload_stream({ resource_type: "image" }, function(
                    error,
                    imageResult
                ) {
                    // data er i imageResult

                    question.image = imageResult.url;
                    question.image_id = imageResult.public_id;
                    question.save(err => {
                        if (err) res.send(err);

                        res.json({ message: "Question created!" });
                    });
                })
                .end(req.file.buffer);
        }
    }); */

    // PUT: Opdater et spørgsmål
    //app.put("/api/questions/:id", permit("admin"), (req, res) => { }

    // PUT: kommentar
    app.put("/api/questions/:id/comment", (req, res) => {
        if (!req.user) {
            res.status(403);
            res.send("Not logged in");
        } else {
            let id = req.params.id;
            Question.findById(id, (err, question) => {
                if (err) res.send(err);

                // Opdater spørgsmålet
                // fx question.question = req.params.question;
                if (!Array.isArray(question.comments)) question.comments = [];

                let comment = { ...req.body, user: req.user.username };
                question.comments.push(comment);
                console.log(question);

                question.save(err => {
                    if (err) res.send(err);

                    User.findById(req.user._id, (err, user) => {
                        if (err) return res.send({ type: "error", data: err });
                        if (!Array.isArray(user.comments)) user.comments = [];

                        if (user.comments.indexOf(id) === -1) {
                            user.comments.push(id);

                            user.save(err => {
                                if (err) res.send(err);
                            });
                        }
                    });

                    res.json({
                        message: "Kommentaren er tilføjet!",
                        question
                    });
                });
            });
        }
    });

    // DELETE: Slet et spørgsmål
    app.delete("/api/questions/:id", permit("admin"), (req, res) => {
        Question.remove({ _id: req.params.id }, (err, question) => {
            if (err) res.send(err);

            res.json({ message: "Spørgsmålet er slettet!" });
        });
    });

    // GET: alle spørgsmål fra et semester
    app.get("/api/set/:semester", (req, res) => {
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
    app.get("/api/set/:semester/:examYear/:examSeason", (req, res) => {
        Question.find({
            semester: req.params.semester,
            examYear: req.params.examYear,
            examSeason: req.params.examSeason
        })
            .sort("n")
            .exec((err, questions) => {
                if (err) res.send(err);
                res.json(questions);
            });
    });

    // GET: alle inden for hvert speciale
    app.get("/api/speciale/:semester/:specialty", (req, res) => {
        let specialties = req.params.specialty.split(",");
        let n = Number(req.query.n) || 0;
        Question.find({
            semester: req.params.semester,
            specialty: { $in: specialties }
        })
            .limit(n)
            .exec((err, questions) => {
                if (err) res.send(err);

                res.json(questions);
            });
    });

    /**
     * ======================================================================
     * Fanger kun antal spørgsmål og fordeling af Specialer samt eksamenssæt
     * ======================================================================
     */

    // GET antal på semesteret
    app.get("/api/count/:semester", (req, res) => {
        Question.find({ semester: req.params.semester })
            .select(["specialty", "examSeason", "examYear"])
            .exec((err, questions) => {
                if (err) res.send(err);

                res.json(questions);
            });
    });

    // GET de enkelte sæt på semesteret
    app.get("/api/count/sets/:semester", (req, res) => {
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
            "-_id examSeason examYear",
            (err, questions) => {
                if (err) res.send(err);

                let unique = uniqWith(questions, isEqual);

                res.json(unique);
            }
        );
    });

    // GET antal på semesteret og speciale
    app.get("/api/count/:semester/:specialty", (req, res) => {
        Question.find({
            semester: req.params.semester,
            specialty: req.params.specialty
        })
            .select(["specialty", "examSeason", "examYear"])
            .exec((err, questions) => {
                if (err) res.send(err);

                res.json(questions);
            });
    });

    /**
     * ======================================================================
     * Besvar et spørgsmål
     * ======================================================================
     */

    app.post("/api/questions/answer", (req, res) => {
        if (!req.user) {
            res.status(403);
            res.send("Not logged in");
        } else {
            let { questionId, semester, answer } = req.body;

            if (!questionId || !semester || !answer) {
                res.status(400);
                res.send("Info lacking");
            }
            // Save the question to the user
            User.findById(req.user._id, (err, user) => {
                if (err) res.send(err);

                let answeredQuestions = user.answeredQuestions || {},
                    values = _.get(answeredQuestions, [semester, questionId], {
                        correct: 0,
                        wrong: 0
                    });

                values[answer] = values[answer] + 1;
                _.set(answeredQuestions, [semester, questionId], values);

                user.answeredQuestions = answeredQuestions;

                user.markModified("answeredQuestions");
                user.save(err => {
                    if (err) res.send(err);

                    res.send({
                        message: "Question answered",
                        user: user
                    });
                });
            });
        }
    });
};
