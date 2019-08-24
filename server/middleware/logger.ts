import express from 'express';
import Logger from '../models/logger';
const router = express.Router();

router.use(async (req, res, next) => {
  if (req.url.includes('api/migrate')) {
    return next();
  }

  if (req.url.includes('api')) {
    let body = { ...req.body };

    // If password is passed, do not log it
    if (body.password) {
      delete body.password;
    }
    try {
      await Logger.query().insert({
        method: req.method,
        url: req.url,
        query: req.query ? JSON.stringify(req.query) : null,
        body: req.body ? JSON.stringify(body) : null
      });
    } catch (err) {
      let { code, sqlMessage } = err.nativeError;
      if (code === 'ER_DATA_TOO_LONG') {
        console.error({
          code,
          sqlMessage
        });
      } else {
        console.error(err);
      }
    }
  }

  next();
});

export default router;
