const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Question = require('../models/question');
const validationRegex = require('../utils/validation');
const auth = require('../middleware/auth');
const keys = require('../config/keys');
const async = require('async');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const urls = require('../config/urls');
const _ = require('lodash');

router.post('/', async (req, res) => {
  let q = req.body;
  var user = new User();

  if (!q.username.match(validationRegex.username))
    return res.status(400).json({ type: 'error', message: 'Invalid username' });

  user.username = q.username.toLowerCase();
  user.password = q.password;
  user.email = q.email;

  try {
    await user.save();
    res.status(200).json({ message: 'Bruger tilføjet', id: user._id });
  } catch (err) {
    return res.send(err);
  }
});

router.get('/usernamechange', async (req, res) => {
  let { oldName, newName } = req.query;
  if (!oldName || !newName) return res.status(400).send('Du mangler query params');
  oldName = oldName.toLowerCase();
  newName = newName.toLowerCase();
  const user = await User.findOne({ username: oldName });
  const newUser = await User.findOne({ username: newName });
  if (!user) return res.status(400).send('Bruger blev ikke fundet');
  if (newUser) return res.status(400).send('Det nye brugernavn findes allerede');
  user.username = newName;
  user.save();

  const questions = await Question.find({ 'comments.user': oldName });
  questions.forEach((question) => {
    question.comments.forEach((comment) => {
      if (comment.user === oldName) {
        comment.user = newName;
      }
    });
    question.save();
  });

  res
    .status(200)
    .send({ message: `Brugernavnet er ændret fra ${oldName} til ${newName}`, user: user });
});

router.get('/me', function(req, res) {
  res.send(req.user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
});

router.put('/completedsets/:id', async (req, res) => {
  const { api, semester } = req.body;
  console.log(api, semester);
  if (!api || !semester) return res.status(404).send('Du mangler at opgive api eller semester');

  const user = await User.findById(req.params.id);

  console.log(user.completedSets);

  if (!user.completedSets[semester]) {
    console.log(user.completedSets);
    console.log('new');
    user.completedSets[semester] = [api];
  } else {
    const alreadyExists = _.indexOf(user.completedSets[semester], api);
    if (alreadyExists !== -1) {
      console.log('alreadyt');
      user.completedSets[semester].splice(alreadyExists, 1);
    } else {
      user.completedSets[semester].push(api);
      console.log('push');
    }
  }

  user.markModified('completedSets');
  const result = await user.save();
  console.log(result.completedSets);
  res.status(200).send(result);
});

router.put('/edit', auth, async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (password) {
      user.password = password;
    }
    if (email) {
      user.email = email;
    }
    await user.save();
    res.send({ type: 'success', data: 'Profilen er ændret' });
  } catch (err) {
    res.send({ type: 'error', data: err });
  }
});

router.delete('/delete', auth, async (req, res) => {
  let user;
  try {
    user = await User.findById(req.user._id, 'password');
    if (!req.body.password) {
      return res.status(401).send({
        type: 'error',
        data: 'Du skal indtaste dit kodeord for at slette brugeren'
      });
    }
  } catch (err) {
    return res.status(400).send(err);
  }

  user.comparePassword(req.body.password, (err, isValid) => {
    if (err || !isValid)
      return res.status(401).send({
        type: 'error',
        data: 'Kodeordet er ugyldigt!'
      });
    user.remove(() => {
      req.logout();
      res.send({ type: 'success', data: 'Brugeren er slettet!' });
    });
  });
});

router.post('/check-availability', (req, res) => {
  // Matcher præcise brugernavne uafhængigt af case
  switch (req.body.field) {
    case 'username':
      User.findOne(
        {
          username: {
            $regex: new RegExp('^' + req.body.value + '$', 'i')
          }
        },
        (err, user) => {
          if (err) throw err;

          const available = user ? false : true;
          res.send(available);
        }
      );
      break;
    case 'email':
      User.findOne(
        {
          email: {
            $regex: new RegExp('^' + req.body.value + '$', 'i')
          }
        },
        (err, user) => {
          if (err) throw err;

          const available = user ? false : true;
          res.send(available);
        }
      );
      break;
    default:
      return;
  }
});

router.post('/forgot', function(req, res, next) {
  if (!req.body.email) return res.send({ type: 'error', data: 'Der er ikke indtastet en email' });
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          const token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            return res.send({
              type: 'error',
              data:
                'Der blev ikke fundet en bruger med den angivne email / No user was found with the provided email address'
            });
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        sgMail.setApiKey(keys.sendgrid_api_key);
        const msg = {
          to: user.email,
          from: urls.emailFrom,
          subject:
            'Nulstilling af kodeord ved AU Medicin MCQ-sitet / Password reset at AU Medicine MCQ-site',
          text: `
Du modtager denne mail, fordi du (eller en anden!) har bedt om nulstilling af dit kodeord. 

Klik på nedenstående link eller kopier det ind i den browser for at indstille et nyt kodeord. Du har en time til at gøre dette, før linket udløber 

http://${req.headers.host}${urls.forgotPassword}${token}
                                 
Hvis du ikke har bedt om nulstilling af din kode, kan du blot ignorere denne mail, og din kode forbliver uændret.  

---

You are receiving this email because you (or someone else!) has requested a password reset.

Click the link below or copy it into your browser to set a new password. You have one hour to do this before the link expires.

http://${req.headers.host}${urls.forgotPassword}${token}

If you have not requested a password reset, feel free to ignore this email and your password will remain unchanged.

Med venlig hilsen / Kind regards  
Sigurd\n`
        };
        sgMail.send(msg);
        done();
      }
    ],
    function(err) {
      if (err) return next(err);
      res.send({
        type: 'success',
        data:
          'En mail er blevet sendt med instruktioner! / An email has been sent with instructions'
      });
    }
  );
});

// Do the reset
router.post('/reset/:token', function(req, res) {
  async.waterfall(
    [
      function(done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(err, user) {
            if (err) res.send(err);
            if (!user) {
              return res.send({
                type: 'error',
                data:
                  'Reset-token er ikke gyldigt (længere?). Bed om et nyt via formularen "Jeg har glemt min kode" og prøv igen. / Reset-token no (longer?) valid. Request a new one through the form "I forgot my password" and try again.'
              });
            }

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              if (err) {
                res.send(err);
                done(err, null);
              }

              done(err, user);
            });
          }
        );
      },
      function(user, done) {
        const msg = {
          to: user.email,
          from: urls.emailFrom,
          subject:
            'Dit kodeord er blevet ændret hos AU Medicin MCQ-sitet / Password changed at AU Medicine MCQ site',
          text: `
Hej,


Denne mail er for at konfirmere, at koden til AU Medicin MCQ-sitet for brugeren med email ${
            user.email
          } er blevet ændret.

Har du ikke bedt om denne ændring, kan det skyldes at andre har adgang til din mail, eller en fejl i mit system - så kontakt mig gerne! 


---

Hi,

This email is sent to confirm that the password for the AU Medicine MCQ site for the user with the email address ${
            user.email
          } has been changed.
                        
If you did not request this change, it may mean that others have access to your emails or an error in my system – so feel free to contact me!

Med venlig hilsen / Kind regards
Sigurd\n`
        };
        sgMail.send(msg);

        done(null);
      }
    ],
    function(err) {
      return res.send({
        type: 'success',
        data:
          'Kodeordet er ændret. Der er sendt en mail til dig for at bekræfte dette (du skal ikke gøre noget). / Password has been changed. An email has been sent to you to confirm this (no action required).'
      });
    }
  );
});

// TODO: Hente al information vi har på brugeren (under EU lovgivning)

module.exports = router;
