import express from "express";
import passport from "passport";
import createResponse from "./_swaggerComponents";
import { permit } from "../middleware/permission";
const router = express.Router();
/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Get the authenticated user
 *     description: Returns the currently authenciticated user or `null`.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: The logged-in user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get("/", async (req, res) => {
  res.json(req.user || null);
});

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Log a user in
 *     description: Attempts to perform a login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             username: Test
 *             password: Password
 *     responses:
 *       200:
 *         description: A Success object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Success"
 *             example:
 *               type: LoginSuccess
 *               message: Logged in succesfully.
 *               data: {username: 'Test', id: 1}
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.session = null;
      return res
        .status(401)
        .json(createResponse("LoginFailed", "Login failed."));
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      let { username, id } = user;
      return res.json(
        createResponse("LoginSuccess", "Logged in succesfully.", {
          username,
          id
        })
      );
    });
  })(req, res, next);
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log the user out
 *     description: Logs the currently authenticated user out
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: A success message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Success"
 *             example:
 *               type: LogoutSuccess
 *               message: Logged out succesfully.
 *       default:
 *         description: unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.get("/logout", permit(), function(req, res) {
  req.logout();
  req.session = null;
  res.json(createResponse("LogoutSucess", "Logged out succesfully."));
  // res.redirect("/logout");
});

export default router;
