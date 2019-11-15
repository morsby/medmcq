import bodyParser from 'body-parser';
import dotEnv from 'dotenv-flow';
import express from 'express';
import helmet from 'helmet';
import Knex from 'knex';
import { Model } from 'objection';
import cookieParser from 'cookie-parser';

import apolloClient from './graphql/apolloServer';
import logger from './middleware/logger';
import path from 'path';
import routes from './routes';

const port = process.env.PORT || 3001;
const env = process.env.NODE_ENV || 'development';
dotEnv.config({ node_env: env });
const app = express();

// Database
const knexConfig = require('./knexfile');
const knex = Knex(knexConfig);
Model.knex(knex);

// middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
apolloClient.applyMiddleware({ app });

app.use(logger); // Logging of all requests

// Real routes
app.use('/api', routes);

/* Catch all */
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

// START SERVEREN
const server = app.listen(port);

if (env !== 'test' && env !== 'travis') {
  // eslint-disable-next-line no-console
  console.log(`Server is live on http://localhost:${port}`);
}

module.exports = server;
