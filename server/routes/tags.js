import express from 'express';
import { ValidationError, NotFoundError } from 'objection';

import { errorHandler } from '../middleware/errorHandling';
import { permit } from '../middleware/permission';

import Tag from '../models/tag';
const router = express.Router();

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: List all tags
 *     description: Returns a list of all the tags
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Tags"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get('/', async (req, res) => {
  try {
    let tags = await Tag.query()
      .orderBy(['semesterId', 'name'])
      .eager(Tag.defaultEager);

    res.status(200).json(tags);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Post a new tag
 *     description: >
 *       Inserts a new tag into the database. Requires editor or higher
 *       permissions.
 *     tags:
 *       - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               semesterId:
 *                 type: integer
 *                 description: References a `Semester`
 *     responses:
 *       200:
 *         description: The created tag
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Tag"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post('/', permit({ roles: ['editor', 'admin'] }), async (req, res) => {
  try {
    const newTag = await Tag.query().insert(req.body);

    res.status(200).json(newTag);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /tags/:id:
 *   get:
 *     summary: Fetch one tag by id
 *     description: >
 *       Returns a specific tag, including associated questions and a vote
 *       count.
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: The tag
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Tag"
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
    let tag = await Tag.query()
      .findById(id)
      .select([
        'questionTag.*',
        Tag.relatedQuery('questions')
          .count()
          .as('vote_count')
      ])
      .eager(Tag.defaultEager);

    if (!tag) throw new NotFoundError();
    res.status(200).json(tag);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /tags/:id:
 *   patch:
 *     summary: Patch an existing tag
 *     description: Patches an existing tag. Requires editor or higher permissions.
 *     tags:
 *       - Tags
 *     requestBody:
 *       description: Any of the following keys can be included.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               semesterId:
 *                 type: integer
 *                 description: References a `Semester`
 *     responses:
 *       200:
 *         description: The patched tag
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Tag"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.patch(
  '/:id',
  permit({ roles: ['editor', 'admin'] }),
  async (req, res) => {
    let { id } = req.params;

    try {
      // Hvis der ikke er nogle data med i req.body smider vi en fejl
      if (Object.keys(req.body).length === 0) {
        throw new ValidationError({
          type: 'ModelValidation',
          message: 'No values to patch'
        });
      }

      let tag = await Tag.query()
        .patchAndFetchById(id, req.body)
        .eager(Tag.defaultEager);
      if (!tag) throw new NotFoundError();
      res.status(200).json(tag);
    } catch (err) {
      errorHandler(err, res);
    }
  }
);

/**
 * @swagger
 * /tags/:id:
 *   delete:
 *     summary: Delete a tag
 *     description: Deletes a tag. Requires editor or higher permissions.
 *     tags:
 *       - Tags
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
  permit({ roles: ['editor', 'admin'] }),
  async (req, res) => {
    let { id } = req.params;

    try {
      const deleted = await Tag.query().deleteById(id);
      if (deleted > 0) {
        res.status(200).json({
          type: 'deleteTag',
          message: `Succesfully deleted ${deleted} tag`
        });
      } else {
        throw new NotFoundError();
      }
    } catch (err) {
      errorHandler(err, res);
    }
  }
);

// Tags
/**
 * @swagger
 * components:
 *   schemas:
 *      Tag:
 *        required:
 *          - id
 *          - name
 *          - semesterId
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          semesterId:
 *            type: integer
 *          questions:
 *            $ref: "#/components/schemas/ActiveTagVotes"
 *          questionCount:
 *            type: integer
 *            description: Number of questions with the selected tag
 *      Tags:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/Tag"
 */

// ActiveTagVotes
/**
 * @swagger
 * components:
 *   schemas:
 *      ActiveTagVote:
 *        required:
 *          - questionId
 *          - tagId
 *          - tagName
 *        properties:
 *          questionId:
 *            type: integer
 *          tagId:
 *            type: integer
 *          tagName:
 *            type: string
 *      ActiveTagVotes:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/ActiveTagVote"
 */

// UserTagVotes
/**
 * @swagger
 * components:
 *   schemas:
 *      UserTagVote:
 *        required:
 *          - id
 *          - userId
 *          - questionId
 *          - tagId
 *          - tagName
 *          - value
 *        properties:
 *          id:
 *            type: integer
 *          userId:
 *            type: integer
 *          questionId:
 *            type: integer
 *          tagId:
 *            type: integer
 *          tagName:
 *            type: string
 *          value:
 *            type: integer
 *            example: 1
 *      UserTagVotes:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/UserTagVote"
 */
export default router;
