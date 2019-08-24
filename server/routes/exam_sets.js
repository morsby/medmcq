import express from 'express';
import { ValidationError, NotFoundError } from 'objection';

import ExamSet from '../models/exam_set';
import Question from '../models/question';
import { errorHandler } from '../middleware/errorHandling';
import { permit } from '../middleware/permission';

const router = express.Router();
/**
 * @swagger
 * /exam_sets:
 *   get:
 *     summary: List all exam sets
 *     description: Returns a list of all the exam sets.
 *     tags:
 *       - Exam sets
 *     responses:
 *       200:
 *         description: List of exam sets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ExamSets"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get('/', async (req, res) => {
  try {
    const examSets = await ExamSet.query()
      .select('*')
      .eager('semester');

    res.status(200).json(examSets);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /exam_sets:
 *   post:
 *     summary: Post a new exam set
 *     description: Inserts a new exam set into the database. Requires admin permissions.
 *     tags:
 *       - Exam sets
 *     requestBody:
 *       description: >
 *         `semesterId` must refer to an actual semester.
 *         `questions` need only contain `text, answer1, answer2, answer3, correctAnswers (in an array of objects with property 'answer') and examSetQno.`
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *               season:
 *                 type: string
 *               semesterId:
 *                 type: integer
 *               questions:
 *                 $ref: "#/components/schemas/Questions"
 *     responses:
 *       200:
 *         description: The created semester
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/ExamSet"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/', permit({ roles: ['admin'] }), async (req, res) => {
  try {
    const newSemester = await ExamSet.query().insertGraphAndFetch({
      ...req.body,
      year: Number(req.body.year)
    });
    res.status(200).json(newSemester);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /exam_sets/:id:
 *   get:
 *     summary: Fetch one exam set by id
 *     description: Returns a specific exam set
 *     tags:
 *       - Exam sets
 *     responses:
 *       200:
 *         description: The exam set
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/ExamSet"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get('/:id', async (req, res) => {
  let { id } = req.params;

  try {
    let examSet = await ExamSet.query()
      .findById(id)
      .eager('semester');

    if (!examSet) throw new NotFoundError();
    res.status(200).json(examSet);
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: 'Could not GET exam set by id'
    });
  }
});

/**
 * @swagger
 * /exam_sets/:id:
 *   patch:
 *     summary: Patch an existing exam set
 *     description: Patches an existing exam set. Requires admin permissions.
 *     tags:
 *       - Exam sets
 *     requestBody:
 *       description: Any of the following keys can be included.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *               season:
 *                 type: string
 *               semesterId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The patched exam set
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/ExamSet"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.patch('/:id', permit({ roles: ['admin'] }), async (req, res) => {
  let { id } = req.params;

  try {
    // Hvis der ikke er nogle data med i req.body smider vi en fejl
    if (Object.keys(req.body).length === 0) {
      throw new ValidationError({
        type: 'ModelValidation',
        message: 'No values to patch',
        data: {}
      });
    }

    const examSet = await ExamSet.query()
      .patchAndFetchById(id, {
        ...req.body,
        semester_id: Number(req.body.semester_id) || undefined,
        year: Number(req.body.year) || undefined
      })
      .eager('semester');
    if (!examSet) throw new NotFoundError();
    res.status(200).json(examSet);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /exam_sets/:id:
 *   delete:
 *     summary: Delete an exam set
 *     description: Deletes an exam set by id. Requires admin permissions.
 *     tags:
 *       - Exam sets
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
    const deleted = await ExamSet.query().deleteById(id);
    if (deleted > 0) {
      res.status(200).json({
        type: 'deleteExamSet',
        message: `Succesfully deleted ${deleted} exam set`
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
 * /exam_sets/:id/questions:
 *   get:
 *     summary: List all questions for the given exam set
 *     description: >
 *       Returns all questions from the exam set.
 *     tags:
 *       - Exam sets
 *       - Questions
 *     responses:
 *       200:
 *         description: List of questions
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
router.get('/:id/questions', async (req, res) => {
  let { id } = req.params;

  try {
    let questions = Question.query()
      .where({ examSetId: id })
      .eager(Question.defaultEager)
      .orderBy('examSetQno');

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
    }

    questions = await questions;

    if (questions.length === 0) {
      throw new NotFoundError({ message: 'No questions found.' });
    }

    res.status(200).json(questions);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *      ExamSet:
 *        required:
 *          - id
 *          - year
 *          - season
 *          - semesterId
 *        properties:
 *          id:
 *            type: integer
 *          year:
 *            type: integer
 *          season:
 *            type: string
 *          semesterId:
 *            type: integer
 *          semester:
 *            $ref: "#/components/schemas/Semester"
 *      ExamSets:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/ExamSet"
 */

export default router;
