import express from 'express';
import { ValidationError, NotFoundError } from 'objection';
import _ from 'lodash';
import { errorHandler } from '../middleware/errorHandling';
import { permit } from '../middleware/permission';
import Question from '../models/question';
import QuestionUserAnswer from '../models/question_user_answer';
import QuestionBookmark from '../models/question_bookmark';
import QuestionComment from '../models/question_comment';
import User from '../models/user';
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     description: Returns a list of all the users. Requires admin permissions.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Users"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get('/', permit({ roles: ['admin'] }), async (req, res) => {
  try {
    let users = await User.query()
      .joinRelation('role')
      .select('user.*', 'role.name as role')
      .orderBy('roleId');

    res.status(200).json(users);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Post a new user
 *     description: Inserts a new user into the database
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/', async (req, res) => {
  try {
    let newUser = await User.query().insert({
      ...req.body
    });

    res.status(200).json(newUser);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /users/:id:
 *   get:
 *     summary: Fetch one user by id
 *     description: >
 *       Returns a specific user. Requires admin permissions or the logged in
 *       user to request itself.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get(
  '/:id',
  permit({ roles: ['admin'], owner: 'params.id' }),
  async (req, res) => {
    let { id } = req.params;

    try {
      let user = await User.query().findById(id);

      if (!user) throw new NotFoundError();
      res.status(200).json(user);
    } catch (err) {
      errorHandler(err, res);
    }
  }
);

/**
 * @swagger
 * /users/:id/profile:
 *   get:
 *     summary: Fetch one user's activity by id
 *     description: >
 *       Returns a single user's associated comments (private and public),
 *       answers and bookmarked questions.
 *
 *       Requires admin permissions or the logged in
 *       user to request itself.
 *
 *       Only the `publicComments` property's questions contains public comments,
 *       and the `privateComments` do not contain public comments.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: The activity.
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  answers:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        question:
 *                          $ref: "#/components/schemas/Question"
 *                        answers:
 *                          type: array
 *                          items:
 *                            $ref: "#/components/schemas/UserAnswer"
 *                          description: >
 *                            Also includes `correct` property (1 if true; 0 if false)
 *                  publicComments:
 *                    $ref: "#/components/schemas/Questions"
 *                  privateComments:
 *                    $ref: "#/components/schemas/Questions"
 *                  bookmarks:
 *                    $ref: "#/components/schemas/Questions"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get(
  '/:id/profile',
  permit({ roles: ['admin'], owner: 'params.id' }),
  async (req, res) => {
    let { id } = req.params;

    try {
      // We load the user including answers.
      // TODO: Find en måde at undgå at kalde hente brugeren men i stedet
      // direkte finde svar. Husk parseJson i Models/User.
      let answers = QuestionUserAnswer.query()
        .where('userId', id)
        .modify('summary');

      let answeredQuestions = Question.query()
        .whereIn(
          'id',
          QuestionUserAnswer.query()
            .where('userId', id)
            .distinct('questionId')
        )
        .eager(Question.defaultEager.replace('publicComments.user, ', ''));

      // Find questions the user has commented publicly, fetches including other public comments
      let publicComments = Question.query()
        .whereIn(
          'id',
          QuestionComment.query()
            .where('userId', id)
            .andWhere('private', false)
            .distinct('questionId')
        )
        .eager(Question.defaultEager);

      // Find questions the usrer has commented privately, ...
      let privateComments = Question.query()
        .whereIn(
          'id',
          QuestionComment.query()
            .where('userId', id)
            .andWhere('private', true)
            .distinct('questionId')
        )
        .eager(Question.defaultEager.replace('publicComments.user, ', ''))
        .mergeEager('privateComments(own).user', {
          userId: id
        });

      // Find questions the user has bookmarked
      let bookmarks = Question.query()
        .whereIn(
          'id',
          QuestionBookmark.query()
            .where('userId', id)
            .distinct('questionId')
        )
        .eager(Question.defaultEager.replace('publicComments.user, ', ''));

      // Perform all queries.
      [
        answers,
        answeredQuestions,
        publicComments,
        privateComments,
        bookmarks
      ] = await Promise.all([
        answers,
        answeredQuestions,
        publicComments,
        privateComments,
        bookmarks
      ]);

      let profile = {};

      answers = _.groupBy(answers, 'questionId');

      answeredQuestions = answeredQuestions.map(question => ({
        question,
        answers: answers[question.id]
      }));

      profile.answers = answeredQuestions;
      profile.publicComments = publicComments;
      profile.privateComments = privateComments;
      profile.bookmarks = bookmarks;

      res.status(200).json(profile);
    } catch (err) {
      errorHandler(err, res);
    }
  }
);

/**
 * @swagger
 * /users/:id:
 *   patch:
 *     summary: Patch an existing user
 *     description: >
 *       Patches an existing user.
 *
 *       Requires admin permissions or the logged in
 *       user to request itself.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: Any of the following keys can be included.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The patched user
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.patch(
  '/:id',
  permit({ roles: ['admin'], owner: 'params.id' }),
  async (req, res) => {
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

      let user = await User.query().patchAndFetchById(id, req.body);
      if (!user) throw new NotFoundError();
      res.status(200).json(user);
    } catch (err) {
      errorHandler(err, res);
    }
  }
);

/**
 * @swagger
 * /users/:id:
 *   delete:
 *     summary: Delete a user
 *     description: >
 *       Deletes a user. Requires admin permissions or the logged in
 *       user to request itself.
 *     tags:
 *       - Users
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
router.delete(
  '/:id',
  permit({ roles: ['admin'], owner: 'params.id' }),
  async (req, res) => {
    let { id } = req.params;

    try {
      const deleted = await User.query().deleteById(id);
      if (deleted > 0) {
        res.status(200).json({
          type: 'deleteUser',
          message: `Succesfully deleted ${deleted} user`
        });
      } else {
        throw new NotFoundError();
      }
    } catch (err) {
      errorHandler(err, res);
    }
  }
);
/**
 * @swagger
 * components:
 *   schemas:
 *      User:
 *        required:
 *          - id
 *          - username
 *        properties:
 *          id:
 *            type: integer
 *          username:
 *            type: string
 *          email:
 *            type: string
 *          role:
 *            type: string
 *      UserEagerLoaded:
 *        required:
 *          - id
 *          - username
 *        properties:
 *          id:
 *            type: integer
 *          username:
 *            type: string
 *          email:
 *            type: string
 *          role:
 *            type: string
 *          publicComments:
 *            $ref: "#/components/schemas/Questions"
 *          privateComments:
 *            $ref: "#/components/schemas/Questions"
 *          bookmarks:
 *            $ref: "#/components/schemas/Questions"
 *          answers:
 *            type: object
 *            properties:
 *              question:
 *                $ref: "#/components/schemas/Question"
 *              performance:
 *                type: object
 *                properties:
 *                  tries:
 *                    type: integer
 *                    description: Number of times the question has been answered
 *                  correct:
 *                    type: integer
 *                    description: Number of times answered correctly
 *                  answers:
 *                    type: array
 *                    items:
 *                      type: integer
 *                    description: Array of answers
 *      Users:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/User"
 *      Bookmark:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          questionId:
 *            type: integer
 *      Bookmarks:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/Bookmark"
 *
 */

export default router;
