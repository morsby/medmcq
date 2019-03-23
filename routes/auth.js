// Route for /api/auth
const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ type: 'failure', message: 'Login failed' });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json({ type: 'success', user: user.username });
    });
  })(req, res, next);
});

router.get('/logout', auth, function(req, res) {
  req.logout();
  res.redirect('/logout');
});

module.exports = router;
