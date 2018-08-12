const User = require('./models/user');

// middleware for doing role-based permissions
module.exports = function permit(...allowed) {
	const isAllowed = user => {
		let res = User.findById(user._id)
			.exec()
			.then(res => allowed.indexOf(res.role) > -1)
			.catch(err => 'There was an error!');

		return res;
	};

	// return a middleware
	return async (req, res, next) => {
		if (req.user) {
			if (await isAllowed(req.user)) next();
			else res.status(403).json({ message: 'Forbidden' }); // user is forbidden
			// role is allowed, so continue on the next middleware
		} else {
			res.status(403).json({ message: 'Not logged in' }); // user is forbidden
		}
	};
};
