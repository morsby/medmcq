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

// TODO: Før statistik over get("/api/questions"), post("/api/questions/ids/"), post("/api/questions/answer")

module.exports = app => {
    // GET: spørgsmål
    app.get("/api/questions", (req, res) => {
        let {
            n,
            specialer,
            unique,
            semester,
            examSeason,
            examYear
        } = req.query;

        /* 
            Nedenfor er nogle lidt vilde if-else statements.     
            De omhandler hvilke spørgsmål der ønskes
        */

        if (!n && !semester) {
            // Hent alle spørgsmål hvis der ikke er query params
            Question.find(function(err, questions) {
                if (err) res.send(err);

                res.json(questions);
            });
        } else if (semester && examSeason && examYear) {
            // Hent det eksamenssæt der bedes om
            Question.find({
                semester: semester,
                examYear: examYear,
                examSeason: examSeason
            })
                .sort("n")
                .exec((err, questions) => {
                    if (err) res.send(err);
                    res.json(questions);
                });
        } else {
            /* Der ønskes hverken alle spg. eller et sæt; så vi skal udregne
                hvilke, vi vil have, ud fra diverse parametre
            */

            // Er der ikke givet ønske om antal? Så hent max 9999 spørgsmål
            if (!n) n = 9999;

            let answeredQuestions = []; // skal initieres tomt pga. filter

            // Hvis logget ind OG beder om "kun nye spørgsmål"
            if (req.user && unique) {
                let userAnsweredQuestions = req.user.answeredQuestions;
                _.map(userAnsweredQuestions, s =>
                    answeredQuestions.push(Object.keys(s))
                );
                answeredQuestions = _.flatten(answeredQuestions);
            }

            // Mongoose filter
            let filter = {
                _id: { $nin: answeredQuestions },
                semester: { $eq: semester }
            };

            if (specialer) {
                filter.specialty = { $in: specialer.split(",") };
            }

            // Find spørgsmål baseret på filteret
            Question.findRandom(filter, {}, { limit: n }, (err, questions) => {
                if (err) res.send(err);

                // Hvis der ikke er nogen spørgsmål ud fra filteret
                // (pga. alle spørgsmål der opfylder kriterierne ER besvarede)
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
        }
    });

    // GET: bestemte spørgsmål (kan kun håndtere få spg)
    app.get("/api/questions/:id", (req, res) => {
        let ids = req.params.id.split(",");

        Question.find({ _id: { $in: ids } }, (err, question) => {
            if (err) res.send(err);

            res.json(question);
        });
    });

    // POST: hent bestemt spørgsmål (skal være post af hensyn til URL-længde;)
    // kan håndtere højt antal spg.
    app.post("/api/questions/ids/", (req, res) => {
        let ids = req.body.ids;
        Question.find({ _id: { $in: ids } }, (err, question) => {
            if (err) res.send(err);

            res.json(question);
        });
    });

    // Bliver p.t. ikke brugt, da spørgsmål tilføjes direkte til databasen
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

    // PUT: kommentar til spørgsmål
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

    app.put(
        "/api/questions/:question_id/comment/:comment_id",
        async (req, res) => {
            let question = await Question.findById(req.params.question_id);

            let comment = await question.comments;

            index = _.findIndex(comment, { id: req.params.comment_id });

            if (req.user.username === question.comments[index].user) {
                question.comments[index].comment = req.body.comment;
                question.save(err => {
                    if (err) res.send(new Error(err));

                    res.json("kommentar ændret");
                });
            } else {
                res.json("ikke din kommentar");
            }
        }
    );

    app.delete(
        "/api/questions/:question_id/comment/:comment_id",
        async (req, res) => {
            let question = await Question.findById(req.params.question_id);

            let comment = await question.comments;

            index = _.findIndex(comment, { id: req.params.comment_id });

            if (req.user.username === question.comments[index].user) {
                question.comments.splice(index, 1);
                question.save(err => {
                    if (err) res.send(new Error(err));

                    res.json("kommentar slettet");
                });
            } else {
                res.json("ikke din kommentar");
            }
        }
    );

    // DELETE: Slet et spørgsmål
    app.delete("/api/questions/:id", permit("admin"), (req, res) => {
        Question.remove({ _id: req.params.id }, (err, question) => {
            if (err) res.send(err);

            res.json({ message: "Spørgsmålet er slettet!" });
        });
    });

    /**
     * ======================================================================
     * Fanger kun antal spørgsmål og fordeling af Specialer samt eksamenssæt
     * ======================================================================
     */

    // GET antal på semesteret
    // Bruges på quiz-vælger-siden til at vise hvor mange spørgsmål der er for hvert semester
    app.get("/api/count/:semester", (req, res) => {
        Question.find({ semester: req.params.semester })
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
