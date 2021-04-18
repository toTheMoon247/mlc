const {User, validate, getAll} = require('../models/user');
const mongoose = require('mongoose');

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('joi');

exports.get_all = async(req, res)=> {
	try {
		const users = await User.find().sort('name');
		res.send(users);
	} catch (ex) {
		// TODO: add log
		res.status(500).send('something failed on the server');
	}
}
// TODO: (1) Outsource db interaction to user model
// TODO: (2) Outsource validation to an external service

exports.register = async(req, res) => {
	// validate the request. 
	// if its not valid return 404, bad request.
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send(error.details[0].message);

		// validate that the user is not already registered
		let user =  await User.findOne({ email: req.body.email });
		if (user)
			return res.status(400).send('user already registered');
		
		// if its valid --> update the db
		user = new User(_.pick(req.body, ['firstName', 'lastName', 'birthDate', 'email', 'password']));

		// hash user password
		const salt = await bcrypt.genSalt(10); // 10 = the default number of rounds to generate salt.
		user.password = await bcrypt.hash(user.password, salt);

		await user.save();
		
		// we choose only the fields we want. we don't want to pick to send back to the client.
		// user = _.pick(user, ['_id', 'firstName', 'lastName', 'email']);
		// we send the jwt in the header and the user details in the body
		const token = user.generateAuthToken();
		res.header('x-auth-token', token)
			.header("access-control-expose-headers", "x-auth-token") // allow the client access for the x-auth-token header
		   	.send(_.pick(user, ['_id', 'firstName', 'lastName', 'email']));
	} catch (ex) {
		// TODO: add log
		res.status(500).send('something failed on the server');
	}
}

exports.login = async(req, res) => {
	// validate the request. 
	// if its not valid return 404, bad request.
	try {
		const { error } = validateLogin(req.body);
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
		
		// TODO: jwt.sign


		const token = user.generateAuthToken();
		// generate json web token
		
		// if its valid --> return json web token
		res.send(token);
	} catch (ex) {
		// TODO: add log
		res.status(500).send('something failed on the server');
	}
}

function validateLogin(req) {
	const schema = {
		email: Joi.string().min(5).max(255).required().email(), // we call email() to make sure its a valid email
		password: Joi.string().min(5).max(255).required() // 255 = the max length of the plain text password, before we hash the password.
	}

	return Joi.validate(req, schema);
}
