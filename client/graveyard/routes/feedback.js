/* eslint-disable camelcase */
// /api/feedback

const express = require('express');
const router = express.Router();
let randomstring = require('randomstring');
const permit = require('../../../permission'); // middleware for checking if user's role is permitted to make request
// MODELS
const Feedback = require('../../../models/feedback.js');
const Comment = require('../../../models/comment.js');

router.get('/', (req, res) => {
  Feedback.find(function (err, feedback) {
    if (err) res.status(400).send(err);

    res.json(feedback);
  });
});

router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).send('ID not found');

    let comments = await Comment.find({ feedback_id: req.params.id }).sort('full_slug');

    let ret = { feedback, comments };
    res.json(ret);
  } catch (err) {
    console.log(err.message);
  }
});

router.post('/', (req, res) => {
  let feedback = new Feedback();
  let q = req.body;

  feedback.title = q.title;
  feedback.text = q.text;
  feedback.author = q.author;

  feedback.save((err) => {
    if (err) res.send(err);

    res.json({ message: 'Question created!', id: feedback._id });
  });
});

router.put('/:id', (req, res) => {
  Feedback.findById(req.params.id, (err, feedback) => {
    if (err) res.send(err);
    let q = req.body;
    // Opdater noget
    feedback.title = q.title;
    feedback.text = q.text;
    feedback.edited = Date.now();

    feedback.save((err) => {
      if (err) res.send(err);

      res.json({ message: 'Feedback opdateret!' });
    });
  });
});

router.put('/:id/vote', (req, res) => {
  Feedback.findById(req.params.id, (err, feedback) => {
    if (err) res.send(err);
    feedback.votes = feedback.votes + Number(req.body.val);
    feedback.save((err) => {
      if (err) res.send(err);

      res.json({
        message: 'Der er stemt!',
        id: feedback._id,
        val: req.body.val
      });
    });
  });
});

router.delete('/:id', permit('admin'), (req, res) => {
  Feedback.remove({ _id: req.params.id }, (err) => {
    if (err) res.send(err);

    Comment.remove({ feedback_id: req.params.id }, (err) => {
      if (err) res.send(err);
    });

    res.json({ message: 'Feedback (og kommentarer) er slettet!' });
  });
});

// =====================================================
// Kommentarer til feedback

router.post('/:f_id/comment', async (req, res) => {
  const comment = new Comment();
  const q = req.body;

  const date = Date.now();
  const slug_part = randomstring.generate({
    length: 4,
    capitalization: 'lowercase'
  });
  const full_slug_part = `${date}:${slug_part}`;
  comment.date = date;
  comment.author = q.author;
  comment.text = q.text;
  comment.feedback_id = req.params.f_id;
  comment.parent_id = q.parent_id ? q.parent_id : null; // SPG: Bliver dette brugt?

  const getSlugs = async (q) => {
    const slugs = {};
    if (q.parent_id) {
      const parent = await Comment.findById(q.parent_id);

      slugs.slug = `${parent.slug}/${slug_part}`;
      slugs.full_slug = `${parent.full_slug}/${full_slug_part}`;
    } else {
      slugs.slug = slug_part;
      slugs.full_slug = full_slug_part;
    }
    return slugs;
  };

  const slugs = await getSlugs(q);
  comment.slug = slugs.slug;
  comment.full_slug = slugs.full_slug;

  comment.save((err) => {
    if (err) res.send(err);

    res.json({ message: 'Kommentar tilføjet' });
  });
});

router.delete('/:f_id/comment/:c_id', permit('admin'), async (req, res) => {
  await Comment.remove({ _id: req.params.c_id }, (err) => {
    if (err) res.send(err);
  });
  res.send({ message: 'Kommentaren er slettet' });
});

module.exports = router;
