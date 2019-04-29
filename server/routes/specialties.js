import express from "express";
import { ValidationError, NotFoundError } from "objection";
import { errorHandler } from "../middleware/errorHandling";
import { permit } from "../middleware/permission";

import Specialty from "../models/specialty";

const router = express.Router();

/**
 * @swagger
 * /specialties:
 *   get:
 *     summary: List all specialties
 *     description: Returns a list of all the specialties
 *     tags:
 *       - Specialties
 *     responses:
 *       200:
 *         description: List of specialties
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Specialties"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get("/", async (req, res) => {
  try {
    let specialties = await Specialty.query()
      .orderBy(["semesterId", "name"])
      .eager(Specialty.defaultEager);

    res.status(200).json(specialties);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /specialties:
 *   post:
 *     summary: Post a new specialty
 *     description: >
 *       Inserts a new specialty into the database.
 *       Requires editor or higher permissions.
 *     tags:
 *       - Specialties
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
 *         description: The created specialty
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Specialty"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post("/", permit({ roles: ["editor", "admin"] }), async (req, res) => {
  try {
    const newSpecialty = await Specialty.query().insert(req.body);

    res.status(200).json(newSpecialty);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /specialties/:id:
 *   get:
 *     summary: Fetch one specialty by id
 *     description: >
 *       Returns a specific specialty, including associated questions and a vote
 *       count.
 *     tags:
 *       - Specialties
 *     responses:
 *       200:
 *         description: The specialty
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Specialty"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get("/:id", async (req, res) => {
  let { id } = req.params;

  try {
    let specialty = await Specialty.query()
      .findById(id)
      .select([
        "questionSpecialty.*",
        Specialty.relatedQuery("questions")
          .count()
          .as("vote_count")
      ])
      .eager(Specialty.defaultEager);

    if (!specialty) throw new NotFoundError();
    res.status(200).json(specialty);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /specialties/:id:
 *   patch:
 *     summary: Patch an existing specialty
 *     description: >
 *       Patches an existing specialty. Requires editor or higher permissions.
 *     tags:
 *       - Specialties
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
 *         description: The patched specialty
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Specialty"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.patch(
  "/:id",
  permit({ roles: ["editor", "admin"] }),
  async (req, res) => {
    let { id } = req.params;

    try {
      // Hvis der ikke er nogle data med i req.body smider vi en fejl
      if (Object.keys(req.body).length === 0) {
        throw new ValidationError({
          type: "ModelValidation",
          message: "No values to patch"
        });
      }

      let specialty = await Specialty.query()
        .patchAndFetchById(id, req.body)
        .eager(Specialty.defaultEager);
      if (!specialty) throw new NotFoundError();
      res.status(200).json(specialty);
    } catch (err) {
      errorHandler(err, res);
    }
  }
);

/**
 * @swagger
 * /specialties/:id:
 *   delete:
 *     summary: Delete a specialty
 *     description: Deletes a specialty. Requires editor or higher permissions.
 *     tags:
 *       - Specialties
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
  "/:id",
  permit({ roles: ["editor", "admin"] }),
  async (req, res) => {
    let { id } = req.params;

    try {
      const deleted = await Specialty.query().deleteById(id);
      if (deleted > 0) {
        res.status(200).json({
          type: "deleteSpecialty",
          message: `Succesfully deleted ${deleted} specialty`
        });
      } else {
        throw new NotFoundError();
      }
    } catch (err) {
      errorHandler(err, res);
    }
  }
);

// Specialties
/**
 * @swagger
 * components:
 *   schemas:
 *      Specialty:
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
 *            $ref: "#/components/schemas/ActiveSpecialtyVotes"
 *          questionCount:
 *            type: integer
 *            description: Number of questions with the selected specialty
 *      Specialties:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/Specialty"
 */

// ActiveSpecialtyVotes
/**
 * @swagger
 * components:
 *   schemas:
 *      ActiveSpecialtyVote:
 *        required:
 *          - questionId
 *          - specialtyId
 *          - specialtyName
 *        properties:
 *          questionId:
 *            type: integer
 *          specialtyId:
 *            type: integer
 *          specialtyName:
 *            type: string
 *      ActiveSpecialtyVotes:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/ActiveSpecialtyVote"
 */

// UserSpecialtyVotes
/**
 * @swagger
 * components:
 *   schemas:
 *      UserSpecialtyVote:
 *        required:
 *          - id
 *          - userId
 *          - questionId
 *          - specialtyId
 *          - specialtyName
 *          - value
 *        properties:
 *          id:
 *            type: integer
 *          userId:
 *            type: integer
 *          questionId:
 *            type: integer
 *          specialtyId:
 *            type: integer
 *          specialtyName:
 *            type: string
 *          value:
 *            type: integer
 *            example: 1
 *      UserSpecialtyVotes:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/UserSpecialtyVote"
 */
export default router;
