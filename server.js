require('dotenv').config();
const sslRedirect = require('heroku-ssl-redirect');
const express = require('express');
const app = express();
const keys = require('./config/keys');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const helmet = require('helmet');
const port = process.env.PORT || 3001; // set our port

// APIs
const question = require('./routes/question');
const auth = require('./routes/auth');
const user = require('./routes/user');
const contact = require('./routes/contact');

// Third Party middleware
app.use(helmet());

// if heroku, force SSL
if (process.env.NODE_ENV === 'production') {
  app.use(sslRedirect());
}

// Database
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(console.log('Successfully connected to database'))
  .catch((err) => {
    if (err) console.log('Could not connect to database', err);
  });

// For logins:
app.use(cookieParser()); // read cookies (needed for auth)
app.use(
  session({
    name: 'medmcqSession',
    keys: keys.keys,
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
  })
); // session secret

require('./config/passport')(passport); // pass passport for configuration

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// bodyParser tillader JSON-posts
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// log requests to DB
const saveReq = require('./middleware/saveReq');

app.use(saveReq);

// APIs
app.use('/api/questions', question);
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/contact', contact);

// Registrer alle routes fra denne fil (prefixed '/api')
//app.use('/api', router);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'au_server') {
  // Express will serve prod. assets
  // (js, css files)
  app.use(express.static('client/build'));
}

// Express will serve up index.html if
// unknown route
// Catchall case, only happens if all above
// failed
const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// START SERVEREN
app.listen(port);
console.log('Magic happens on port ' + port);
