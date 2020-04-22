import dotEnv from 'dotenv-flow';
dotEnv.config({ default_node_env: 'development', path: '../' });
import './config/objection';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import imageRoute from 'routes/image';
import apolloServer from './config/apolloServer';
import path from 'path';
import sgMail from '@sendgrid/mail';

const port = process.env.PORT || 3001;
const app = express();
sgMail.setApiKey(process.env.SENDGRID);

// middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Logging of all requests
// app.use(logger);

// GraphQL and routes
apolloServer.applyMiddleware({ app });
app.use('/images', imageRoute);

// Serve index.js
app.use(express.static(path.join(__dirname, '..')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// START SERVEREN
const server = app.listen(port);

// eslint-disable-next-line no-console
console.log(`Server is live on http://localhost:${port}`);

module.exports = server;
