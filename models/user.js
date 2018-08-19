const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs'),
	salt = bcrypt.genSaltSync(10);

var UserSchema = new Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true, select: false },
	email: { type: String },
	role: { type: String, required: true, default: 'user' },
	answeredQuestions: {},
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Number }
});

UserSchema.pre('save', function(next) {
	var user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a hash
	user.password = bcrypt.hashSync(user.password, salt);
	next();
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	let res = bcrypt.compare(candidatePassword, this.password, (err, res) => {
		if (err) return cb(err, false);
		cb(null, res);
	});
};

module.exports = mongoose.model('User', UserSchema);
