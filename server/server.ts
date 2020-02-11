import dotEnv from 'dotenv-flow';
const env = process.env.NODE_ENV || 'development';
dotEnv.config({ node_env: env });
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import Knex from 'knex';
import { Model } from 'objection';
import cookieParser from 'cookie-parser';

import apolloServer from './graphql/apolloServer';
import path from 'path';

const port = process.env.PORT || 3001;
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

// Logging of all requests
// app.use(logger);

// GraphQL and routes
apolloServer.applyMiddleware({ app });

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
