import express from 'express';
import { ValidationError, NotFoundError } from 'objection';
import { errorHandler, BadRequest } from '../middleware/errorHandling';
import { permit } from '../middleware/permission';
import vars from 'misc/vars';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import createResponse from './_swaggerComponents';
import QuestionUserAnswer from '../models/question_user_answer';
import QuestionBookmark from '../models/question_bookmark';
import QuestionComment from '../models/question_comment';
import User from '../models/user';
import ManualCompletedSet from '../models/manual_completed_set';
const router = express.Router();
const urls = vars.urls;

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
    let { username, email, password } = req.body;
    let newUser = await User.query().insert({
      username,
      email,
      password
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
router.get('/:id', permit({ roles: ['admin'], owner: 'params.id' }), async (req, res) => {
  let { id } = req.params;

  try {
    let user = await User.query().findById(id);

    if (!user) throw new NotFoundError();
    res.status(200).json(user);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /users/:id/profile:
 *   get:
 *     summary: Fetch one user's activity by id and semesterId
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
 *     parameters:
 *       - in: query
 *         name: semesterId
 *         schema:
 *           type: string
 *           description: A semester id
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
  '/:userId/profile',
  permit({ roles: ['admin'], owner: 'params.userId' }),
  async (req, res) => {
    try {
      let { userId } = req.params;
      let { semesterId } = req.query;
      if (!semesterId)
        throw new BadRequest({ message: 'You must pass in a semesterId as query parameter' });

      // We load the user including answers.
      // TODO: Find en måde at undgå at kalde hente brugeren men i stedet
      // direkte finde svar. Husk parseJson i Models/User.
      let answers = QuestionUserAnswer.query()
        .where('userId', userId)
        .andWhere('question:semester.id', semesterId)
        .joinRelation('question.semester');

      // Find questions the user has commented publicly, fetches including other public comments
      let publicComments = QuestionComment.query()
        .where('userId', userId)
        .andWhere('private', false)
        .andWhere('question:semester.id', semesterId)
        .joinRelation('question.semester')
        .select('QuestionComment.id', 'QuestionComment.questionId');

      // Find questions the user has commented privately, ...
      let privateComments = QuestionComment.query()
        .where('userId', userId)
        .andWhere('private', true)
        .andWhere('question:semester.id', semesterId)
        .joinRelation('question.semester')
        .select('QuestionComment.id', 'QuestionComment.questionId');

      // Find questions the user has bookmarked
      let bookmarks = QuestionBookmark.query()
        .where('userId', userId)
        .andWhere('question:semester.id', semesterId)
        .joinRelation('question.semester')
        .eager('question.[correctAnswers]');

      // Perform all queries.
      [answers, publicComments, privateComments, bookmarks] = await Promise.all([
        answers,
        publicComments,
        privateComments,
        bookmarks
      ]);
      let questionIds = [];
      [...answers, ...publicComments, ...privateComments, ...bookmarks].forEach(
        ({ questionId }) => {
          if (!questionIds.includes(questionId)) questionIds.push(questionId);
        }
      );

      let profile = {};

      profile.answers = answers;
      profile.publicComments = publicComments;
      profile.privateComments = privateComments;
      profile.bookmarks = bookmarks;
      profile.questions = questionIds;

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
router.patch('/:id', permit({ roles: ['admin'], owner: 'params.id' }), async (req, res) => {
  let { id } = req.params;
  let { username, email, password } = req.body;

  try {
    // Hvis der ikke er nogle data med i req.body smider vi en fejl
    if (Object.keys(req.body).length === 0) {
      throw new ValidationError({
        type: 'ModelValidation',
        message: 'No values to patch',
        data: {}
      });
    }

    let user = await User.query().patchAndFetchById(id, { username, email, password });
    if (!user) throw new NotFoundError();
    res.status(200).json(user);
  } catch (err) {
    errorHandler(err, res);
  }
});

router.put('/completedSets/:userId', async (req, res) => {
  const userId = req.params.userId;
  const setId = req.body.setId;

  try {
    if (
      await ManualCompletedSet.query()
        .where('userId', '=', userId)
        .andWhere('setId', '=', setId)
        .first()
    ) {
      await ManualCompletedSet.query()
        .delete()
        .where('userId', '=', userId)
        .andWhere('setId', '=', setId);
      return res.status(200).send(`Set with ID ${setId} has been uncompleted by user ${userId}`);
    }

    await ManualCompletedSet.query()
      .insert({ setId, userId })
      .where('userId', '=', userId);
    res.status(200).send(`Set with ID ${setId} has been completed by user ${userId}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(new Error(error));
  }
});

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
router.delete('/:id', permit({ roles: ['admin'], owner: 'params.id' }), async (req, res) => {
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
});

/**
 * @swagger
 * /users/check-availability:
 *   post:
 *     summary: Checks whether username or email is already taken
 *     description: >
 *       Checks if a username or email has already been registered.
 *       Returns `true` if the requested value is free, `false` if it already exists.
 *       Field can be `username` or `email`.
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Boolean
 *         content:
 *            application/json:
 *              schema:
 *                type: boolean
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/check-availability', async (req, res) => {
  try {
    let { field, value } = req.body;
    let user;
    if (field && value) {
      user = await User.query().findOne(field, value);
    }
    let availability;
    if (user) {
      availability = false;
    } else {
      availability = true;
    }
    res.json(availability);
  } catch (err) {
    errorHandler(err, res);
  }
});

router.post('/forgot-password', async (req, res) => {
  let { email } = req.body;
  try {
    if (!email) {
      throw new BadRequest({ message: 'You need to provide an email' });
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Find the user
    let user;

    user = await User.query().findOne({ email });
    if (!user)
      throw new NotFoundError({
        type: 'UserNotFound',
        message: 'Der blev ikke fundet en bruger.'
      });

    const now = new Date();
    now.setHours(now.getHours() + 2);
    // Update reset information
    user = await user.$query().patchAndFetch({
      resetPasswordToken: token,
      resetPasswordExpires: now
    });

    // Send mail
    sgMail.setApiKey(process.env.SENDGRID);
    const msg = {
      to: user.email,
      from: urls.fromEmail,
      templateId: 'd-c18c023d7f7847118f02d342f538c571',
      dynamic_template_data: {
        username: user.username,
        email: user.email,
        resetLink: `http://${urls.dev || req.headers.host}${urls.resetPassword}${token}`,
        forgotLink: `http://${urls.dev || req.headers.host}${urls.forgotPassword}`
      }
    };
    sgMail.send(msg);

    // Send response
    res.json(
      createResponse(
        'resetPasswordRequestSuccess',
        'Du modtager snarest en mail med instruktioner. / You will soon recieve an email with instructions.'
      )
    );
  } catch (err) {
    // Catch any error
    errorHandler(err, res);
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    let { resetPasswordToken, password } = req.body;

    // Check if required fields are provided
    if (!resetPasswordToken || !password) {
      throw new BadRequest({
        message: 'You must provide a password reset token and a new password'
      });
    }
    // Find the user with correct token and expire time
    const user = await User.query()
      .findOne({ resetPasswordToken })
      .andWhere('resetPasswordExpires', '>', new Date());
    if (!user)
      throw new NotFoundError({
        message:
          'Reset-token er ikke gyldigt. Bed om et nyt via formularen "Jeg har glemt min kode" og prøv igen.'
      });

    // Reset password
    await user.$query().patch({ password, resetPasswordToken: null, resetPasswordExpires: null });

    // Send mail
    sgMail.setApiKey(process.env.SENDGRID);
    const msg = {
      to: user.email,
      from: urls.fromEmail,
      templateId: 'd-df2ec6ed439b4e63a57d4ae6877721d7',
      dynamic_template_data: {
        username: user.username,
        email: user.email
      }
    };
    sgMail.send(msg);

    // Send response
    res.json(
      createResponse(
        'resetPasswordSuccess',
        'Dit kodeord er blevet nulstillet. / Your password has been reset.'
      )
    );
  } catch (err) {
    errorHandler(err, res);
  }
});

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
