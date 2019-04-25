import express from "express";
import { ValidationError, NotFoundError } from "objection";
import { permit } from "../middleware/permission";

import Semester from "../models/semester";
import { errorHandler } from "../middleware/errorHandling";

const router = express.Router();

/**
 * @swagger
 * /semesters:
 *   get:
 *     summary: List all semesters
 *     description: Returns a list of all the semesters
 *     tags:
 *       - Semesters
 *     responses:
 *       200:
 *         description: List of semesters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Semesters"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get("/", async (req, res) => {
  try {
    let semesters = await Semester.query().orderBy("value");

    res.status(200).json(semesters);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /semesters:
 *   post:
 *     summary: Post a new semester
 *     description: >
 *       Inserts a new semester into the database. Requires admin privileges.
 *     tags:
 *       - Semesters
 *     requestBody:
 *       description: value is the actual semester (e.g. 7, 8, 9)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shortName:
 *                 type: string
 *               value:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The created semester
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Semester"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post("/", permit({ roles: ["admin"] }), async (req, res) => {
  try {
    let newSemester = await Semester.query().insert({
      ...req.body,
      value: Number(req.body.value)
    });

    res.status(200).json(newSemester);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /semesters/:id:
 *   get:
 *     summary: Fetch one semester by id
 *     description: >
 *       Returns a specific semester, its associated exam sets, specialties and
 *       tags and a question count.
 *     tags:
 *       - Semesters
 *     responses:
 *       200:
 *         description: The semester
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/SemesterEagerLoaded"
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
    let semester = await Semester.query()
      .findById(id)
      .select([
        "semester.*",
        Semester.relatedQuery("questions")
          .count()
          .as("question_count")
      ])
      .eager(Semester.defaultEager);

    if (!semester) throw new NotFoundError();
    res.status(200).json(semester);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /semesters/:id:
 *   patch:
 *     summary: Patch an existing semester
 *     description: Patches an existing semester. Requires admin privileges.
 *     tags:
 *       - Semesters
 *     requestBody:
 *       description: Any of the following keys can be included.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shortName:
 *                 type: string
 *               value:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The patched semester
 *         content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Semester"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.patch("/:id", permit({ roles: ["admin"] }), async (req, res) => {
  let { id } = req.params;

  try {
    // Hvis der ikke er nogle data med i req.body smider vi en fejl
    if (Object.keys(req.body).length === 0) {
      throw new ValidationError({
        type: "ModelValidation",
        message: "No values to patch",
        data: {}
      });
    }

    let semester = await Semester.query()
      .patchAndFetchById(id, req.body)
      .eager(Semester.defaultEager);
    if (!semester) throw new NotFoundError();
    res.status(200).json(semester);
  } catch (err) {
    errorHandler(err, res);
  }
});

/**
 * @swagger
 * /semesters/:id:
 *   delete:
 *     summary: Delete a semester
 *     description: Deletes a semester
 *     tags:
 *       - Semesters
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
router.delete("/:id", permit({ roles: ["admin"] }), async (req, res) => {
  let { id } = req.params;

  try {
    const deleted = await Semester.query().deleteById(id);
    if (deleted > 0) {
      res.status(200).json({
        type: "deleteSemester",
        message: `Succesfully deleted ${deleted} semester`
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
 * components:
 *   schemas:
 *      Semester:
 *        required:
 *          - id
 *          - name
 *          - shortName
 *          - value
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          shortName:
 *            type: string
 *          value:
 *            type: integer
 *      SemesterEagerLoaded:
 *        required:
 *          - id
 *          - name
 *          - shortName
 *          - value
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          shortName:
 *            type: string
 *          value:
 *            type: integer
 *          questionCount:
 *            type: integer
 *          examSets:
 *            $ref: "#/components/schemas/ExamSets"
 *          specialties:
 *            $ref: "#/components/schemas/Specialties"
 *          tags:
 *            $ref: "#/components/schemas/Tags"
 *      Semesters:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/Semester"
 */

export default router;
