var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(async (id, done) => {
    User.query()
      .findById(id)
      .joinRelation('[role]')
      .joinEager('manualCompletedSets')
      .select('user.*', 'role.name as role')
      .then((user, err) => {
        done(err, user || null);
      });
  });

  passport.use(
    'local',
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.query()
          .findOne({ username })
          .select('id', 'username', 'password');

        if (!user) {
          return done(null, false, {
            message: 'Incorrect username.'
          });
        }

        const passwordValid = await User.verifyPassword(password);
        console.log(passwordValid);
        let error;
        if (!passwordValid) {
          error = { message: 'Incorrect password' };
          return done(null, false, error);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );
};
