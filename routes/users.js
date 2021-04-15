
const _ = require('lodash');

const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// get the id from the jwt. malicious client can't send :id and try get other user data
// router.get('/me', async(req, res) => {

// })

router.get('/', async(req, res) => {
	const users = await User.find().sort('name');
	res.send(users);
});

router.post('/', async(req, res) => {
	// validate the request. 
	// if its not valid return 404, bad request.
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

});

module.exports = router;