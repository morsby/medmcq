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
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(
		'local',
		new LocalStrategy(function(username, password, done) {
			User.findOne({ username: username }, 'username password', function(
				err,
				user
			) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Incorrect username.'
					});
				}

				user.comparePassword(password, (err, isValid) => {
					console.log(isValid);
					if (!isValid) {
						let error = {
							message: 'Incorrect password.'
						};
						return done(null, false, error);
					} else {
						//returns  err, user, message
						return done(null, user);
					}
				});
			});
		})
	);
};
