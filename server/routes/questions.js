import express from 'express';
import { ValidationError, NotFoundError, transaction } from 'objection';
import { permit } from '../middleware/permission';
import _ from 'lodash';
import createResponse from './_swaggerComponents';
import Question from '../models/question';
import QuestionBookmark from '../models/question_bookmark';
import QuestionComment from '../models/question_comment';
import QuestionUserAnswer from '../models/question_user_answer';
import QuestionSpecialtyVote from '../models/question_specialty_vote';
import QuestionTagVote from '../models/question_tag_vote';
import sgMail from '@sendgrid/mail';
import { errorHandler, NotAuthorized, BadRequest } from '../middleware/errorHandling';
import Semester from '../models/semester';
import ExamSet from '../models/exam_set';
import QuestionCommentLike from 'models/question_comment_like';
import { urls } from '../misc/vars';

const router = express.Router();

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get multiple questions
 *     description: >
 *       Returns a list of questions.
 *       Only accessible to admins if requesting more than 300 questions without
 *       ids.<br><br>
 *       If `ids` are provided, all other parameters are ignored. <br>
 *       If `profile` is true, only this and `semesters` are evaluated.<br>
 *       Otherwise, query parameters are combined and only questions fulfulling all
 *       requirements are selected (i.e. an *inner join*\/*andWhere* is performed
 *       on each parameter).
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *           example: 1,2,3
 *           description: A comma separated list of ids to fetch.
 *       - in: query
 *         name: profile
 *         schema:
 *           type: boolean
 *           example: true
 *           description: Fetches questions related to the user (through `req.user`).
 *       - in: query
 *         name: n
 *         schema:
 *           type: integer
 *           description: The number of questions to return. For non-admins, 300 is the max.
 *           example: 80
 *       - in: query
 *         name: onlyNew
 *         schema:
 *           type: boolean
 *           description: >
 *             If the `req.user` object is present, only selects questions the
 *             user has *not* previously answered.
 *           example: true
 *       - in: query
 *         name: onlyWrong
 *         schema:
 *           type: boolean
 *           description: >
 *             If the `req.user` object is present, only selects questions the
 *             user has previously answered *incorrectly*.
 *           example: true
 *       - in: query
 *         name: semesters
 *         schema:
 *           type: string
 *           description: A comma separated list of `semester.ids`s to draw questions from.
 *           example: 1,2
 *       - in: query
 *         name: specialties
 *         schema:
 *           type: string
 *           description: >
 *             A comma separated list of `specialty.id`s to draw questions from.
 *           example:
 *             1,2
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *           description: A comma separated list of `tag.id`s to draw questions from.
 *           example: 1,2
 *     responses:
 *       200:
 *         description: List of questions.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Questions"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get('/', async (req, res) => {
  let user = req.user || {};
  let { profile, ids, n, semesters, onlyNew, specialties, tags, onlyWrong, commentIds } = req.query;
  try {
    // If user is not allowed to query >300 questions, we throw an error
    if (!ids && !profile && (!n || n > 300) && ['admin', 'creator'].indexOf(user.role) === -1) {
      throw new NotAuthorized({
        message: `You requested too many questions. The limit for non-admins is 300 (you requested ${req
          .query.n || 'all'}).`,
        data: {}
      });
    }

    let query = Question.query()
      .select('question.*', 'semester.id as semester')
      .joinRelation('semester')
      .eager(Question.defaultEager);

    // If requesting ids, get them
    if (ids) {
      query = query.whereIn('Question.id', ids.split(',').map((id) => Number(id)));
    } else if (commentIds) {
      const questionIds = QuestionComment.query()
        .findByIds(commentIds)
        .select('questionId');

      query = query.whereIn('Question.id', questionIds);
    } else if (profile) {
      if (!req.user)
        throw new BadRequest({
          type: 'NotLoggedIn',
          message: 'You must be logged in to access this request.'
        });

      if (semesters) {
        query = query.whereIn('semester.id', semesters.split(','));
      }

      query = query.andWhere((builder) =>
        builder
          .whereIn(
            'Question.id',
            QuestionBookmark.query()
              .where('userId', user.id)
              .distinct('questionId')
          )
          .orWhereIn(
            'Question.id',
            QuestionComment.query()
              .where('userId', user.id)
              .distinct('questionId')
          )
          .orWhereIn(
            'Question.id',
            QuestionUserAnswer.query()
              .where('userId', user.id)
              .distinct('questionId')
          )
      );
    } else {
      // Otherwise, filter by results and randomize
      query = query.orderByRaw('rand()');
      if (semesters) query = query.whereIn('semester.id', semesters.split(','));

      if (n) query = query.limit(n);

      if (specialties) {
        query = query.modify('filterOnMetadata', {
          type: 'specialties',
          ids: specialties.split(',')
        });
      }

      if (tags) {
        query = query.modify('filterOnMetadata', {
          type: 'tags',
          ids: tags.split(',')
        });
      }

      if (req.user && onlyWrong) {
        const correctAnswers = QuestionUserAnswer.query()
          .where({ userId: req.user.id })
          .join(
            'questionCorrectAnswer',
            'questionUserAnswer.questionId',
            '=',
            'questionCorrectAnswer.questionId'
          )
          .where('questionUserAnswer.answer', '=', 'questionCorrectAnswer.answer')
          .select('questionUserAnswer.questionId');

        query = query.whereNotIn('question.id', correctAnswers);
      } else if (req.user && onlyNew) {
        query = query.whereNotIn(
          'question.id',
          QuestionUserAnswer.query()
            .where({ userId: req.user.id })
            .distinct('questionId')
        );
      }
    }

    if (req.user) {
      query = query.mergeEager('privateComments(own).user', {
        userId: req.user.id
      });
      query = query.mergeEager('userSpecialtyVotes(own)', {
        userId: req.user.id
      });
      query = query.mergeEager('userTagVotes(own)', {
        userId: req.user.id
      });
      query = query.mergeEager('isBookmarked(own)', {
        userId: req.user.id
      });
    }

    let questions = await query;

    res.status(200).json(questions);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Post a new question
 *     description: Inserts a new question into the database. Requires admin permissions.
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               answer1:
 *                 type: string
 *               answer2:
 *                 type: string
 *               answer3:
 *                 type: string
 *               correctAnswers:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Most likely an array of length 1 (e.g. `[1]`) but can also be longer (e.g. `[1,3]`)
 *               examSetId:
 *                 type: integer
 *                 description: References an exam set
 *               examSetQno:
 *                 type: integer
 *                 description: The number of the question in the set
 *     responses:
 *       200:
 *         description: The created question.
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Question"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/', permit({ roles: ['admin'] }), async (req, res) => {
  try {
    let questionToInsert = req.body;

    questionToInsert.correctAnswers = questionToInsert.correctAnswers.map((answer) => ({ answer }));

    const newQuestion = await transaction(Question.knex(), async (trx) => {
      const newQuestion = await Question.query(trx)
        .insertGraphAndFetch(questionToInsert)
        .eager('examSet');
      return newQuestion;
    });

    res.status(200).json(newQuestion);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/search:
 *   post:
 *     summary: Search for a question
 *     description: >
 *       Performs a MySQL full text search on question text and answers.
 *       For references on MySQL full text searches, see e.g.
 *       [the MySQL docs](https://dev.mysql.com/doc/refman/8.0/en/fulltext-boolean.html).
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchString:
 *                 type: string
 *                 example: 'appendicit'
 *               semester:
 *                 type: integer
 *                 description: Semester ID to search within.
 *     responses:
 *       200:
 *         description: The matched questions.
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Questions"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/search', async (req, res) => {
  try {
    let { searchString, semester } = req.body;

    let questions = Question.query()
      .joinRelation('semester')
      .whereRaw(
        'MATCH (text, answer1, answer2, answer3) AGAINST (? IN BOOLEAN MODE)',
        searchString
      );

    if (semester) questions = questions.andWhere({ 'semester.id': semester });

    questions = questions.eager(Question.defaultEager);

    if (req.user) {
      questions = questions.mergeEager('privateComments(own).user', {
        userId: req.user.id
      });
      questions = questions.mergeEager('userSpecialtyVotes(own)', {
        userId: req.user.id
      });
      questions = questions.mergeEager('userTagVotes(own)', {
        userId: req.user.id
      });
      questions = questions.mergeEager('isBookmarked(own)', {
        userId: req.user.id
      });
    }

    questions = await questions;

    res.status(200).json(questions);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id:
 *   get:
 *     summary: Fetch question by id
 *     description: >
 *       Returns the specific question requested. If the request includes `req.user`,
 *       also includes the private comments by the user.
 *     tags:
 *       - Questions
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The id to get
 *     responses:
 *       200:
 *         description: The question
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Question"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get('/:id', async (req, res) => {
  let { id } = req.params;

  let query = Question.query()
    .findById(id)
    .select('question.*', 'semester.id as semester')
    .joinRelation('semester')
    .eager(Question.defaultEager);

  if (req.user) {
    query = query.mergeEager('privateComments(own).user', { userId: req.user.id });
    query = query.mergeEager('userSpecialtyVotes(own)', {
      userId: req.user.id
    });
    query = query.mergeEager('userTagVotes(own)', {
      userId: req.user.id
    });
  }

  try {
    let question = await query;

    if (!question) throw new NotFoundError();

    res.status(200).json(question);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id:
 *   patch:
 *     summary: Patch an existing question
 *     description: >
 *       Patches an existing question. Response does not include private comments.
 *       Requires editor or higher permissions.
 *     tags:
 *       - Questions
 *     requestBody:
 *       description: Any of the following keys can be included.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               answer1:
 *                 type: string
 *               answer2:
 *                 type: string
 *               answer3:
 *                 type: string
 *               correctAnswers:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Most likely an array of length 1 (e.g. `[1]`) but can also be longer (e.g. `[1,3]`)
 *               examSetId:
 *                 type: integer
 *                 description: References an exam set
 *               examSetQno:
 *                 type: integer
 *                 description: The number of the question in the set
 *     responses:
 *       200:
 *         description: The patched question
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Question"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.patch('/:id', permit({ roles: ['editor', 'admin'] }), async (req, res) => {
  try {
    // Hvis der ikke er nogle data med i req.body smider vi en fejl
    if (Object.keys(req.body).length === 0) {
      throw new ValidationError({
        type: 'ModelValidation',
        message: 'No values to patch',
        data: {}
      });
    }

    let questionToPatch = req.body;
    questionToPatch.id = Number(req.params.id);

    if (questionToPatch.correctAnswers) {
      questionToPatch.correctAnswers = questionToPatch.correctAnswers.map((answer) => ({ answer }));
    }

    const question = await transaction(Question.knex(), async (trx) => {
      const question = Question.query(trx)
        .upsertGraphAndFetch(questionToPatch)
        .select('question.*', 'semester.id as semester')
        .joinRelation('semester')
        .eager(Question.defaultEager);
      return question;
    });

    if (!question) throw new NotFoundError();
    res.status(200).json(question);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id:
 *   delete:
 *     summary: Delete a question
 *     description: Deletes a question. Requires admin permissions.
 *     tags:
 *       - Questions
 *     responses:
 *       200:
 *         description: Succesful delete
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Success"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.delete('/:id', permit({ roles: ['admin'] }), async (req, res) => {
  let { id } = req.params;

  try {
    const deleted = await Question.query().deleteById(id);
    if (deleted > 0) {
      res.status(200).json({
        type: 'deleteQuestion',
        message: `Succesfully deleted ${deleted} question`
      });
    } else {
      throw new NotFoundError();
    }
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id/comment:
 *   post:
 *     summary: Comment on a question
 *     description: Comment on a qestion
 *     tags:
 *       - Question comments
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           description: A question id to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               isAnonymous:
 *                 type: boolean
 *               isPrivate:
 *                 type: boolean
 *             description: An object containing a comment, and two booleans indicating whether the comment is anonymous or private
 *             example: {comment: 'What a great question!', isAnonymous: false, isPrivate: false}
 *     responses:
 *       200:
 *         description: The question including the new comment
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Question"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/:questionId/comment', permit(), async (req, res) => {
  let { questionId } = req.params;
  let userId = req.user.id;

  try {
    const updatedQuestion = await transaction(Question.knex(), async (trx) => {
      let { isPrivate, text, isAnonymous } = req.body;
      const comment = {
        userId,
        questionId,
        text,
        private: isPrivate,
        anonymous: isAnonymous
      };

      await QuestionComment.query(trx).insert(comment);

      const updatedQuestion = await Question.query(trx)
        .findById(questionId)
        .select('question.*', 'semester.id as semester')
        .joinRelation('semester')
        .eager(Question.defaultEager)
        .mergeEager('privateComments(own).user', { userId: userId })
        .mergeEager('userSpecialtyVotes(own)', {
          userId: userId
        })
        .mergeEager('userTagVotes(own)', { userId: userId });
      return updatedQuestion;
    });
    res.status(200).json(updatedQuestion);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id/comment/:commentId:
 *   patch:
 *     summary: Edit a comment
 *     description: Edits an existing comment on a question
 *     tags:
 *       - Question comments
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           description: A question id to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               isAnonymous:
 *                 type: boolean
 *               isPrivate:
 *                 type: boolean
 *             description: An object containing a comment, and two booleans indicating whether the comment is anonymous or private
 *             example: {comment: 'What a great question!', isAnonymous: false, isPrivate: false}
 *     responses:
 *       200:
 *         description: The question including the edited comment
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Question"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.patch('/:questionId/comment/:commentId', permit(), async (req, res) => {
  let { questionId, commentId } = req.params;
  let userId = req.user.id;

  try {
    const updatedQuestion = await transaction(Question.knex(), async (trx) => {
      let { isPrivate, text, isAnonymous } = req.body;
      const comment = {
        userId,
        questionId,
        text,
        private: isPrivate,
        anonymous: isAnonymous
      };

      await QuestionComment.query(trx)
        .where('id', commentId)
        .andWhere('userId', userId)
        .update(comment);

      const updatedQuestion = await Question.query(trx)
        .findById(questionId)
        .select('question.*', 'semester.id as semester')
        .joinRelation('semester')
        .eager(Question.defaultEager)
        .mergeEager('privateComments(own).user', { userId: userId })
        .mergeEager('userSpecialtyVotes(own)', {
          userId: userId
        })
        .mergeEager('userTagVotes(own)', { userId: userId });
      return updatedQuestion;
    });
    res.status(200).json(updatedQuestion);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id/comment/:commentId:
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes a comment.
 *     tags:
 *       - Question comments
 *     responses:
 *       200:
 *         description: The question without the deleted comment.
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Question"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.delete('/:questionId/comment/:commentId', permit(), async (req, res) => {
  let { questionId, commentId } = req.params;
  let userId = req.user.id;

  try {
    const deleted = await QuestionComment.query()
      .where('userId', userId)
      .andWhere('id', commentId)
      .delete();
    if (deleted > 0) {
      const question = await Question.query()
        .findById(questionId)
        .select('question.*', 'semester.id as semester')
        .joinRelation('semester')
        .eager(Question.defaultEager)
        .mergeEager('privateComments(own).user', { userId: userId })
        .mergeEager('userSpecialtyVotes(own)', {
          userId: userId
        })
        .mergeEager('userTagVotes(own)', { userId: userId });
      res.status(200).json(question);
    } else {
      throw new NotFoundError();
    }
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/comments/:commentId/like:
 *   post:
 *     summary: Like a comment
 *     description: Likes a comment.
 *     tags:
 *       - Question comments
 *     responses:
 *       200:
 *         description: An object consisting of userId and commentId.
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/comments/:commentId/like', permit(), async (req, res) => {
  let { commentId } = req.params;
  let userId = req.user.id;
  if (!userId) return res.status(400).send('User is not provided');

  try {
    const exists = await QuestionCommentLike.query().findById([commentId, userId]);
    if (exists) {
      await QuestionCommentLike.query()
        .where({ userId, commentId })
        .delete();
      return res.status(204).send('Deleted');
    }
    const result = await QuestionCommentLike.query().insertAndFetch({
      userId,
      commentId
    });
    res.status(200).send(result);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id/vote:
 *   put:
 *     summary: Vote for a specialty or tag
 *     description: >
 *       Saves specialty and tag votes to the database, related to a questionId.
 *       If supplying a `value` of `"delete"`, the user's votes of the type are reset.
 *       Requires a logged-in user.
 *     tags:
 *       - Question voting
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           description: A question id to save the votes for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               id:
 *                 type: integer
 *               value:
 *                 type: number
 *             description: An object containing a type, a metadata id and a value.
 *             example: {type: 'specialty', id: 1, value: 1}
 *     responses:
 *       200:
 *         description: The updated question
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Question"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.put('/:id/vote', permit(), async (req, res) => {
  try {
    let questionId = Number(req.params.id);
    let { body: vote } = req;

    if (!questionId) {
      throw new BadRequest({ message: 'You must provide a question id.' });
    }

    if (!vote) {
      throw new BadRequest({
        message: 'You must provide a vote.'
      });
    }

    let userId = req.user.id;

    const updatedQuestion = await transaction(Question.knex(), async (trx) => {
      if (!_.isEqual(Object.keys(vote), ['type', 'id', 'value'])) {
        throw new BadRequest({
          message: 'vote must be an object containing type, id and value'
        });
      }
      if (vote.type === 'specialty') {
        await QuestionSpecialtyVote.query(trx)
          .where({ questionId, userId: userId, specialtyId: vote.id })
          .delete();

        vote = { questionId, userId, specialtyId: vote.id, value: vote.value };

        if (vote.value !== 'delete') await QuestionSpecialtyVote.query(trx).insertGraph(vote);
      }

      if (vote.type === 'tag') {
        await QuestionTagVote.query(trx)
          .where({ questionId, userId: userId, tagId: vote.id })
          .delete();

        vote = { questionId, userId, tagId: vote.id, value: vote.value };
        if (vote.value !== 'delete') await QuestionTagVote.query(trx).insertGraph(vote);
      }

      const updatedQuestion = await Question.query(trx)
        .findById(questionId)
        .select('question.*', 'semester.id as semester')
        .joinRelation('semester')
        .eager(Question.defaultEager)
        .mergeEager('privateComments(own).user', { userId: userId })
        .mergeEager('userSpecialtyVotes(own)', {
          userId: userId
        })
        .mergeEager('userTagVotes(own)', { userId: userId });
      return updatedQuestion;
    });
    res.status(200).json(updatedQuestion);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id/answer:
 *   post:
 *     summary: Save an answer
 *     description: Saves an answer to the database
 *     tags:
 *       - Question answering
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer:
 *                 type: integer
 *                 description: The user's answer (e.g. `1` || `2` || `3`)
 *                 example: 1
 *     responses:
 *       200:
 *         description: >
 *           Success message. `data` property includes the user's answer and the
 *           base question model including correct answers.<br><br>
 *
 *           `response.type = "QuestionAnswerSucces"`
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Success"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/:id/answer', async (req, res) => {
  const questionId = Number(req.params.id);
  let { answer, answerTime } = req.body;

  const userId = (req.user || {}).id || null;

  try {
    await QuestionUserAnswer.query().insert({
      questionId,
      userId,
      answer,
      answerTime
    });

    const question = await Question.query()
      .findById(questionId)
      .eager('correctAnswers');

    res.status(200).send(
      createResponse('QuestionAnswerSuccess', 'Succesfully saved answer', {
        answer,
        question,
        answerTime
      })
    );
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id/bookmark:
 *   post:
 *     summary: Bookmark question
 *     description: >
 *       Save the question for later revisiting, i.e. bookmarking.
 *
 *       Although it is a `POST`, no requestBody is required.
 *
 *       Requires the user to be logged in.
 *     tags:
 *       - Question bookmarks
 *     responses:
 *       200:
 *         description: >
 *           Success message.
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Success"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/:id/bookmark', permit(), async (req, res) => {
  let questionId = Number(req.params.id);

  try {
    const exists = await QuestionBookmark.query().findOne({ userId: req.user.id, questionId });
    if (exists) return res.status(404).json(createResponse('Bookmark already exists'));

    await QuestionBookmark.query().insert({ userId: req.user.id, questionId });

    res.status(200).json(createResponse('QuestionBookmarkSuccess'));
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /questions/:id/bookmark:
 *   delete:
 *     summary: Delete a bookmark
 *     description: Deletes a bookmark. Requires the user to be logged in.
 *     tags:
 *       - Question bookmarks
 *     responses:
 *       200:
 *         description: >
 *           Success message.
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Success"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.delete('/:id/bookmark', permit(), async (req, res) => {
  let questionId = Number(req.params.id);
  try {
    const deleted = await QuestionBookmark.query()
      .where({ userId: req.user.id, questionId })
      .delete();

    if (deleted === 0) {
      throw new NotFoundError({ message: 'No bookmark to delete' });
    }

    res.status(200).json(createResponse('QuestionBookmarkDeleteSuccess'));
  } catch (err) {
    errorHandler(err, res);
  }
});

router.post('/report', async (req, res) => {
  let { type, data } = req.body;

  let msg;
  sgMail.setApiKey(process.env.SENDGRID);

  let to = urls.issue;

  let from = `medMCQ-app <${urls.fromEmail}>`;

  const semester = await Semester.query().findById(data.question.semester);
  const examSet = await ExamSet.query().findById(data.question.examSetId);

  if (type === 'error_report') {
    let { report, question } = data;
    report = report.replace(/(.)\n(.)/g, '$1<br>$2');

    msg = {
      to,
      from,
      subject: `Fejl i spørgsmål med id ${question.id}`,
      text: `
Der er blevet rapporteret en fejl i følgende spørgsmål:
- ID: ${question.id}
- Semester: ${semester.value}
- Sæt: ${examSet.year}/${examSet.season}
- Spørgsmålnummer: ${question.examSetQno}
- Korrekte svar: ${JSON.stringify(question.correctAnswers)}
<hr>
<strong>Indrapporteringen lyder:</strong>
${report}
<hr>
<strong>Spørgsmålet lyder:</strong>
${question.text}<br>
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
- ID: ${question.id}
- Semester: ${semester.value}
- Sæt: ${examSet.year}/${examSet.season}
- Spørgsmålnummer: ${question.n}
- Korrekte svar: ${JSON.stringify(question.correctAnswers)}
${question.text}<br>
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

/**
 * @swagger
 * components:
 *   schemas:
 *      Question:
 *        required:
 *          - id
 *          - text
 *          - answer1
 *          - answer2
 *          - answer3
 *          - correctAnswers
 *          - examSetId
 *          - examSet
 *          - examSetQno
 *          - specialties
 *          - tags
 *        properties:
 *          id:
 *            type: integer
 *          text:
 *            type: string
 *          image:
 *            type: string
 *            nullable: true
 *          answer1:
 *            type: string
 *          answer2:
 *            type: string
 *          answer3:
 *            type: string
 *          correctAnswers:
 *            type: array
 *            items:
 *              type: integer
 *            description: Most likely an array of length 1 (e.g. `[1]`) but can also be longer (e.g. `[1,3]`)
 *          examSetId:
 *            type: integer
 *            description: References an exam set
 *          examSet:
 *              $ref: "#/components/schemas/ExamSet"
 *          examSetQno:
 *            type: integer
 *            description: The number of the question in the set
 *          specialties:
 *            $ref: "#/components/schemas/Specialties"
 *          tags:
 *            $ref: "#/components/schemas/Tags"
 *          publicComments:
 *            $ref: "#/components/schemas/Comments"
 *          privateComments:
 *            description: Included if the user is logged in.
 *            allOf:
 *              - $ref: "#/components/schemas/Comments"
 *          userSpecialtyVotes:
 *            description: Included if the user is logged in.
 *            allOf:
 *              - $ref: "#/components/schemas/UserSpecialtyVotes"
 *          userTagVotes:
 *            description: Included if the user is logged in.
 *            allOf:
 *              - $ref: "#/components/schemas/UserTagVotes"
 *      Questions:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/Question"
 */

export default router;
