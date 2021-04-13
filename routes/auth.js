const _ = require('lodash');

const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async(req, res) => {
	// validate the request. 
	// if its not valid return 404, bad request.
	const { error } = validate(req.body);
	if (error)
		return res.status(400).send(error.details[0].message);

	// validate that the user is not already registered
	let user =  await User.findOne({ email: req.body.email });
	if (!user)
		return res.status(400).send('invalid Email or password'); // we dont want to tell the client the explicit reason, so we keep the msg vague
	
	// compare the plain password to the hashed password
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword)
		return res.status(400).send('invalid email or Password');
	
	// generate json web token
	const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
	// if its valid --> return json web token
	res.send(token);

});

function validate(req) {
	const schema = {
		email: Joi.string().min(5).max(255).required().email(), // we call email() to make sure its a valid email
		password: Joi.string().min(5).max(255).required() // 255 = the max length of the plain text password, before we hash the password.
	}

	return Joi.validate(req, schema);
}

module.exports = router;