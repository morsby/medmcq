import express from 'express';
const router = express.Router();
import { knex } from '../server';
const { migrationPass } = require('../config/keys');
const directory = process.env.NODE_ENV === 'production' ? 'server/migrations' : './migrations';

router.get('/latest', async (req, res) => {
  const { pass } = req.query;
  if (pass !== migrationPass) return res.status(403).send('Not allowed');

  try {
    const result = await knex.migrate.latest({ directory });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/rollback', async (req, res) => {
  const { pass } = req.query;
  if (pass !== migrationPass) return res.status(403).send('Not allowed');

  try {
    const result = await knex.migrate.rollback({ directory });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
