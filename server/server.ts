import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';
import helmet from 'helmet';
import express from 'express';
import logger from './middleware/logger';
import apolloClient from './graphql/apolloServer';
import dotEnv from 'dotenv-flow';
import keygrip from 'keygrip';
import { Model } from 'objection';
import Knex from 'knex';
import routes from './routes';
import path from 'path';
dotEnv.config({ node_env: process.env.NODE_ENV || 'development' });
const app = express();
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3001;

// Database
const knexConfig = require('./knexfile')[env];
export const knex = Knex(knexConfig);
Model.knex(knex);

// middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
apolloClient.applyMiddleware({ app });

// For logins:
app.use(cookieParser()); // read cookies (needed for auth)
app.use(
  cookieSession({
    name: 'medMCQv1',
    keys: keygrip(process.env.KEYGRIP_SECRETS.split(' ')),
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    sameSite: true
  })
);

// Authentication
require('middleware/passport')(passport); // pass passport for configuration

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
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
