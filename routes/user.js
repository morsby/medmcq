const keys = require('../config/keys');
const passport = require('passport');

const permit = require('../permission'); // middleware for checking if user's role is permitted to make request

// MODELS
const User = require('../models/user');

module.exports = app => {
	// SIGNUP
	app.post('/api/signup', (req, res) => {
		let q = req.body;
		var user = new User();

		user.username = q.username;
		user.password = q.password;
		user.email = q.email;

		user.save(err => {
			if (err) res.send(err);

			res.json({ message: 'Bruger tilføjet', id: user._id });
		});
	});

	// Check username
	app.post('/api/auth/check-username', (req, res) => {
		User.findOne({ username: req.body.username }, (err, user) => {
			if (err) throw err;

			let available = user ? false : true;
			res.send(available);
		});
	});

	// SIGNIN
	app.post('/api/auth/login', (req, res, next) => {
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

	// Logout
	app.get('/api/auth/logout', function(req, res) {
		req.logout();
		res.redirect('/logout');
	});

	// Get current user
	app.get('/api/auth/current_user', function(req, res) {
		res.send(req.user);
	});

	// DELETE: comment
	app.delete(
		'/api/feedback/:f_id/comment/:c_id',
		permit('admin'),
		(req, res) => {
			Comment.remove({ _id: req.params.c_id }, err => {
				if (err) res.send(err);
			});
			res.send('Slettet');
		}
	);
};
