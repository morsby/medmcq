const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs"),
    salt = bcrypt.genSaltSync(10);

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    password: { type: String, required: true, select: false },
    email: {
        type: String,
        unique: true,
        required: false,
        uniqueCaseInsensitive: true
    },
    role: { type: String, required: true, default: "user" },
    comments: [{ type: Schema.Types.ObjectId }],
    answeredQuestions: {},
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number }
});

UserSchema.pre("save", function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

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

// For at få unikke brugernavne, case-insensitively
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
