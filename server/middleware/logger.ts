import express from 'express';
import Logger from '../models/logger';
const router = express.Router();

router.use(async (req, res, next) => {
  if (req.url.includes('api')) {
    let body = req.body;

    // If password is passed, do not log it
    if (body.password) {
      delete body.password;
    }

    await Logger.query().insert({
      method: req.method,
      url: req.url,
      query: req.query ? JSON.stringify(req.query) : null,
      body: JSON.stringify(body)
    });
  }

  next();
});

export default router;
