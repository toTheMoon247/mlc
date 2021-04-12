// we will use joi for validation
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	}
});

// we compile a user model based on mongoose schema. we create a user class based on the user model 
const User = mongoose.model('User', userSchema);

function validateUser(user) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(), // we call email() to make sure its a valid email
		password: Joi.string().min(5).max(255).required() // 255 = the max length of the plain text password, before we hash the password.
	}

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;