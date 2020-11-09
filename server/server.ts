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
import examsetRoute from 'routes/examSets'
import jsonWebToken from 'jsonwebtoken';
import User from 'models/user';
const secret = process.env.SECRET || '';

const port = process.env.PORT || 3001;
const app = express();
sgMail.setApiKey(process.env.SENDGRID);

// middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// GraphQL and routes
app.use(async (req, res, next) => {
  // Decode user
  const jwt = req.cookies.user;
  if (!jwt) return next();
  try {
    let user = jsonWebToken.verify(jwt, secret) as User;
    user = await User.query().findById(user.id);
    if (!user) throw new Error('Login failed');
    (req as any).user = user;
  } catch (error) {
    res.cookie('user', {}, { expires: new Date(0) });
  } finally {
    next()
  }
})
app.use('/images', imageRoute);
app.use('/examsets', examsetRoute)
apolloServer.applyMiddleware({ app });

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
