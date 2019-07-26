import express from 'express';
import Logger from '../models/logger';
const router = express.Router();

router.use(async (req, res, next) => {
  if (req.url.includes('api')) {
    await Logger.query().insert({
      method: req.method,
      url: req.url,
      query: req.query ? JSON.stringify(req.query) : null,
      body: req.body ? JSON.stringify(req.body) : null
    });
  }

  next();
});

export default router;
