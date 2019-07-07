import { port, env } from './config/vars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';
import helmet from 'helmet';
import express from 'express';
import keys from './config/keys.js';
const app = express();

/**
 * ================================
 * Database
 * ================================
 */

// SQL db
const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('./knexfile')[env];
const knex = Knex(knexConfig);
Model.knex(knex);

/**
 * ================================
 * Other setup
 * ================================
 */

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For logins:
app.use(cookieParser()); // read cookies (needed for auth)
app.use(
  cookieSession({
    name: 'medMCQv1',
    keys: keys.secretKeys,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    sameSite: true
  })
);

require('./config/passport')(passport); // pass passport for configuration

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Real routes
const routes = require('./routes');
app.use('/api', routes);

/* Catch all */
const path = require('path');

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

// START SERVEREN
const server = app.listen(port);

if (env !== 'test') {
  // eslint-disable-next-line no-console
  console.log('Server is live on port ' + port);
}

module.exports = server;
