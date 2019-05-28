/* eslint-disable no-console */
// Route for /api/questions

const express = require('express');
const router = express.Router();
const permit = require('../middleware/permission'); // middleware for checking if user's role is permitted to make request
const _ = require('lodash');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
const urls = require('../config/urls');
// Middleware
const auth = require('../middleware/auth');
// MODELS
const Question = require('../models/question.js');
const User = require('../models/user.js');
const mongoose = require('mongoose');

// TODO: Før statistik over get("/api/questions"), post("/api/questions/ids/"), post("/api/questions/answer")

// Subroutes
router.use('/metadata', require('./Question/metadata'));

router.get('/', async (req, res) => {
  let { n, specialer, tags, unique, semester, examSeason, examYear } = req.query;

  /* 
            Nedenfor er nogle lidt vilde if-else statements.     
            De omhandler hvilke spørgsmål der ønskes
        */

  if (!n && !semester) {
    res.status(400).send('Status 400: Bad request');
  } else if (semester && examSeason && examYear) {
    // Hent det eksamenssæt der bedes om
    try {
      const questions = await Question.find({
        semester: semester,
        examYear: examYear,
        examSeason: examSeason
      }).sort('n');
      res.json(questions);
    } catch (err) {
      res.send(err);
    }
  } else {
    /* Der ønskes hverken alle spg. eller et sæt; så vi skal udregne hvilke, vi vil have, ud fra diverse parametre
     */

    // Er der ikke givet ønske om antal? Så hent max 9999 spørgsmål
    if (!n) n = 9999;

    let answeredQuestions = []; // skal initieres tomt pga. filter

    // Hvis logget ind OG beder om "kun nye spørgsmål"
    if (req.user && unique) {
      let userAnsweredQuestions = req.user.answeredQuestions;
      _.map(userAnsweredQuestions, (s) => answeredQuestions.push(Object.keys(s)));
      answeredQuestions = _.flatten(answeredQuestions);
    }

    // Mongoose filter
    let filter = {
      _id: { $nin: answeredQuestions },
      semester: { $eq: semester }
    };

    if (specialer) {
      const specialtyArray = specialer.split(',');
      let specFilter = [];

      for (let spec of specialtyArray) {
        specFilter.push(mongoose.Types.ObjectId(spec));
      }

      Object.assign(filter, { 'newSpecialties.specialty': { $in: specFilter } });
    }

    if (tags) {
      const tagArray = tags.split(',');
      let tagFilter = [];

      for (let tag of tagArray) {
        tagFilter.push(mongoose.Types.ObjectId(tag));
      }

      Object.assign(filter, { 'newTags.tag': { $in: tagFilter } });
    }

    Question.findRandom(filter, {}, { limit: n }, (err, questions) => {
      if (err) res.send(err);

      // Hvis der ikke er nogen spørgsmål ud fra filteret
      // (pga. alle spørgsmål der opfylder kriterierne ER besvarede)
      if (!questions && (!tags || !specialer)) {
        let filter2 = { ...filter };
        delete filter2._id;
        Question.findRandom(filter2, {}, { limit: n }, (err, questions) => {
          if (err) res.send(err);
          res.json(questions);
        });
      } else {
        res.json(questions);
      }
    });
  }
});

// Specifikt spørgsmål (post bruges ved større mængde spørgsmål)
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.find({ _id: req.params.id });
    res.json(question);
  } catch (err) {
    res.send(err);
  }
});

router.post('/search', async (req, res) => {
  const regex = new RegExp('(' + req.body.search + ')', 'i');
  try {
    const questions = await Question.find({
      $and: [
        {
          $or: [
            { question: { $in: [regex] } },
            { answer1: { $in: [regex] } },
            { answer2: { $in: [regex] } },
            { answer3: { $in: [regex] } }
          ]
        },
        { semester: req.body.semester }
      ]
    });
    res.status(200).send(questions);
  } catch (err) {
    console.log('Error in question search', new Error(err));
    res.send(err);
  }
});

// POST: hent bestemt spørgsmål (skal være post af hensyn til URL-længde)
// kan håndtere højt antal spg.
router.post('/ids', async (req, res) => {
  const ids = req.body.ids;
  try {
    const question = await Question.find({ _id: { $in: ids } });
    res.json(question);
  } catch (err) {
    res.send(err);
  }
});

// Bliver p.t. ikke brugt, da spørgsmål tilføjes direkte til databasen
/*// POST: Nyt spørgsmål
    router.post("/", upload.single("image"), function(req, res) {
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

// Opret kommentar til spørgsmål
router.put('/:id/comment', (req, res) => {
  const id = req.params.id;
  Question.findById(id, (err, question) => {
    if (err) res.send(err);

    // Opdater spørgsmålet
    // fx question.question = req.params.question;
    if (!Array.isArray(question.comments)) question.comments = [];

    let comment = {
      ...req.body,
      user: req.user.username,
      private: req.body.isPrivate,
      anonymous: req.body.anonymous
    };
    question.comments.push(comment);

    question.save((err) => {
      if (err) res.send(err);

      User.findById(req.user._id, (err, user) => {
        if (err) return res.send({ type: 'error', data: err });
        if (!Array.isArray(user.comments)) user.comments = [];

        if (user.comments.indexOf(id) === -1) {
          user.comments.push(id);

          user.save((err) => {
            if (err) res.send(err);
          });
        }
      });

      res.json({
        message: 'Kommentaren er tilføjet!',
        question
      });
    });
  });
});

// Rediger kommentar
router.put('/:question_id/comment/:comment_id', auth, async (req, res) => {
  const question = await Question.findById(req.params.question_id);
  if (!question) return res.status(404).send('Spørgsmål blev ikke fundet');

  const comments = await question.comments;
  if (!comments) return res.status(404).send('Kommentar blev ikke fundet');

  const index = _.findIndex(comments, { id: req.params.comment_id });

  // Tjek om brugeren ejer spørgsmålet
  if (req.user.username === question.comments[index].user) {
    question.comments[index].comment = req.body.comment;
    question.comments[index].private = req.body.isPrivate;
    question.comments[index].anonymous = req.body.anonymous;
    try {
      const updatedQuestion = await question.save();
      res.json({ question: updatedQuestion, message: 'Kommentar ændret' });
    } catch (err) {
      res.send(new Error(err));
    }
  } else {
    res.json({ message: 'Ikke din kommentar', question });
  }
});

// Slet kommentar
router.delete('/:question_id/comment/:comment_id', async (req, res) => {
  let { question_id, comment_id } = req.params;

  let question = await Question.findById(question_id);

  let comment = await question.comments;

  let index = _.findIndex(comment, { id: comment_id });

  if (req.user.username === question.comments[index].user) {
    question.comments.splice(index, 1);

    /* Ikke så intuitivt: Hvis der ikke længere er en kommentar på
                spørgsmålet af brugeren, slettes spørgsmåls-id'et fra brugerens
                profil, så det ikke fremgår af listen over kommenterede spørgsmål.
                
                Det er altså vigtigt, at dette komme EFTER at selve kommentaren 
                er fjernet*/
    if (_.findIndex(comment, { user: req.user.username }) === -1) {
      let user = await User.findById(req.user._id);

      let indexProfile = user.comments.indexOf(comment_id);
      user.comments.splice(indexProfile, 1);
      user.save((err) => {
        if (err) res.send(err);
      });
    }

    question.save((err) => {
      if (err) res.send(new Error(err));

      res.json({ message: 'kommentar slettet', question });
    });
  } else {
    res.json({ message: 'ikke din kommentar', question });
  }
});

// Slet et spørgsmål
router.delete('/:id', permit('admin'), (req, res) => {
  Question.remove({ _id: req.params.id }, (err) => {
    if (err) res.send(err);

    res.json({ message: 'Spørgsmålet er slettet!' });
  });
});

// Bruges på quiz-vælger-siden til at vise hvor mange spørgsmål der er for hvert semester
router.get('/count/:semester', (req, res) => {
  Question.find({ semester: req.params.semester }).exec((err, questions) => {
    res.json(questions);
  });
});

// Besvar spørgsmål
router.post('/answer', (req, res) => {
  if (!req.user) {
    res.status(403);
    res.send('Not logged in');
  } else {
    let { questionId, semester, answer } = req.body;

    if (!questionId || !semester || !answer) {
      res.status(400);
      res.send('Info lacking');
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

      user.markModified('answeredQuestions');
      user.save((err) => {
        if (err) res.send(err);

        res.send({
          message: 'Question answered',
          user: user
        });
      });
    });
  }
});

router.post('/report', (req, res) => {
  let { type, data } = req.body,
    msg;
  sgMail.setApiKey(keys.sendgrid_api_key);

  let to = urls.email.issue,
    from = `medMCQ-app <${urls.email.noreply}>`;

  if (type === 'error_report') {
    let { report, question } = data;
    report = report.replace(/(.)\n(.)/g, '$1<br>$2');

    msg = {
      to,
      from,
      subject: `Fejl i spørgsmål med id ${question._id}`,
      text: `
Der er blevet rapporteret en fejl i følgende spørgsmål:

- ID: ${question._id}
- Semester: ${question.semester}
- Sæt: ${question.examYear}/${question.examSeason}
- Spørgsmålnummer: ${question.n}
- Korrekte svar: ${JSON.stringify(question.correctAnswer)}

<hr>

<strong>Indrapporteringen lyder:</strong>

${report}

<hr>

<strong>Spørgsmålet lyder:</strong>

${question.question}

A. ${question.answer1}<br>
B. ${question.answer2}<br>
C. ${question.answer3}
`
    };
  } else if (type === 'suggest_tag') {
    let { tag, question } = data;
    msg = {
      to,
      from,
      subject: `Nyt tag foreslået: ${tag}`,
      text: `
Der er blevet foreslået et nyt tag: ${tag}.

Det blev foreslået til spørgsmålet: 


- ID: ${question._id}
- Semester: ${question.semester}
- Sæt: ${question.examYear}/${question.examSeason}
- Spørgsmålnummer: ${question.n}
- Korrekte svar: ${JSON.stringify(question.correctAnswer)}

${question.question}

A. ${question.answer1}<br>
B. ${question.answer2}<br>
C. ${question.answer3}
`
    };
  } else {
    res.status(400).json({ type: 'error', message: 'missing type' });
  }
  sgMail.send(msg);

  res.status(200).json({ type: 'success', message: 'report_made' });
});

module.exports = router;
