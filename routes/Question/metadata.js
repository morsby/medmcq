const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Question = require('../../models/question');
const Specialty = require('../../models/specialty');
const Tag = require('../../models/tag');
const mongoose = require('mongoose');
const User = require('../../models/user');

String.prototype.toObjectId = function() {
  var ObjectId = require('mongoose').Types.ObjectId;
  return new ObjectId(this.toString());
};

router.post('/question/:id', async (req, res) => {
  const { user, value, type } = req.body;
  if ((!user, !value, !type)) return res.status(404).send('Missing parameters');
  const question = await Question.findById(req.params.id);

  if (type === 'specialty') {
    const specialty = await Specialty.findOne({ value: value });
    question.newSpecialties.push({
      specialty: specialty,
      votes: 1,
      users: [{ user: user, vote: 1 }]
    });
  }
  if (type === 'tag') {
    const tag = await Tag.findOne({ value: value });
    question.newTags.push({ tag: tag, votes: 1, users: [{ user: user, vote: 1 }] });
  }

  const result = await question.save();
  res.status(200).send(result);
});

// Opret nyt speciale eller tag
router.post('/', async (req, res) => {
  try {
    const { type, text, value, semester, category } = req.body; // Disse parametre skal alle opgives i post requesten
    if (!type || !text || !semester || !value) {
      return res.status(400).send('Du mangler at opgive alle parametre');
    }

    if (type === 'specialty') {
      let specialty = await Specialty.findOne({ semester: semester, text: text });
      if (specialty) return res.status(404).send('Speciale findes allerede');

      specialty = new Specialty();

      specialty.text = text;
      specialty.value = value;
      specialty.semester = semester;
      specialty.category = category;

      await specialty.save();
      res.status(200).send({ message: 'Oprettet speciale', specialty: specialty });
    }

    if (type === 'tag') {
      let tag = await Tag.findOne({ text: text, semester: semester });
      if (tag) return res.status(404).send('Tag findes allerede');

      tag = new Tag();

      tag.text = text;
      tag.value = value;
      tag.semester = semester;
      tag.category = category;

      await tag.save();
      res.status(200).send({ message: 'Oprettet tag', tag: tag });
    }
  } catch (error) {
    console.log(new Error(error));
  }
});

router.get('/', async (req, res) => {
  const { sem } = req.query;

  const tags = await Tag.find({ semester: sem });
  const specialties = await Specialty.find({ semester: sem });

  console.log(JSON.stringify(specialties, null, 2));

  res.status(200).send({ tags, specialties });
});

router.get('/count', async (req, res) => {
  const tags = await Tag.find({ semester: req.query.sem });
  const specialities = await Specialty.find({ semester: req.query.sem });
  let tagCount = [];
  let specialtyCount = [];

  // Count specialties
  for (let s of specialities) {
    const count = await Question.find({
      'newSpecialties.specialty': s._id
    }).countDocuments();

    specialtyCount.push({
      _id: s._id,
      semester: s.semester,
      text: s.text,
      value: s.value,
      count
    });
  }

  // Count tags
  for (let t of tags) {
    const count = await Question.find({
      'newTags.tag': t._id
    }).countDocuments();

    tagCount.push({
      _id: t._id,
      semester: t.semester,
      text: t.text,
      category: t.category,
      value: t.value,
      count
    });
  }

  const count = { specialtyCount, tagCount };

  res.status(200).send(count);
});

// Stem på metadata
router.put('/vote', async (req, res) => {
  const { type, questionId, metadataId, vote, user } = req.body; // Vote er et tal, enten 1 eller -1 (for upvote eller downvote)

  if (!user) return res.status(404).send('Not logged in');

  let question = await Question.findById(questionId);
  if (type === 'specialty') {
    let metadata = _.find(question.newSpecialties, { _id: mongoose.Types.ObjectId(metadataId) });
    let currentUser = _.findIndex(metadata.users, { user: mongoose.Types.ObjectId(user) });
    if (currentUser === -1) {
      metadata.users.push({ user: user, vote: vote });
    } else {
      // User already voted
      metadata.votes -= metadata.users[currentUser].vote;
      metadata.users[currentUser].vote = vote;
    }

    metadata.votes += vote;
    // Hvis vote kommer under 1, så fjern specialet
    if (metadata.votes < 0 || metadata.users.length < 2) {
      let metadataIndex = _.findIndex(question.newSpecialties, {
        _id: mongoose.Types.ObjectId(metadataId)
      });
      question.newSpecialties.splice(metadataIndex, 1);
    }
  }

  // Similar to the above, but with tags
  if (type === 'tag') {
    let metadata = _.find(question.newTags, { _id: mongoose.Types.ObjectId(metadataId) });
    let currentUser = _.findIndex(metadata.users, { user: mongoose.Types.ObjectId(user) });
    if (currentUser === -1) {
      metadata.users.push({ user: user, vote: vote });
    } else {
      // User already voted
      metadata.votes -= metadata.users[currentUser].vote;
      metadata.users[currentUser].vote = vote;
    }

    metadata.votes += vote;
    // Hvis vote kommer under 1, så fjern tagget
    if (metadata.votes < 0 || metadata.users.length < 2) {
      let metadataIndex = _.findIndex(question.newTags, {
        _id: mongoose.Types.ObjectId(metadataId)
      });

      question.newTags.splice(metadataIndex, 1);
    }
  }

  const result = await question.save();
  res.status(200).send(result);
});

router.get('/completedSets', async (req, res) => {
  const user = await User.findById(req.query.user);
  if (!req.query.user || !req.query.sem)
    return res.status(404).send('Du skal opgive bruger og semester');

  if (!user.answeredQuestions) user.answeredQuestions = {};

  if (!user.answeredQuestions[req.query.sem]) {
    const questions = await Question.find({
      semester: req.query.sem
    });
    const answeredSets = _.groupBy(questions, (q) => `${q.examYear}/${q.examSeason}`);
    for (const key in answeredSets) {
      answeredSets[key] = answeredSets[key].length;
    }
    return res.status(200).send(answeredSets);
  }

  const questions = await Question.find({
    semester: req.query.sem
  });
  const answered = await Question.find({
    _id: { $in: Object.keys(user.answeredQuestions[req.query.sem]) },
    semester: req.query.sem
  });

  const notAnswered = _.differenceBy(questions, answered, (q) => q.question);

  let answeredSets = _.groupBy(notAnswered, (q) => `${q.examYear}/${q.examSeason}`);
  for (const key in answeredSets) {
    answeredSets[key] = answeredSets[key].length;
  }

  res.status(200).send(answeredSets);
});

module.exports = router;
