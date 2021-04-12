const _ = require('lodash');

const {User, validate} = require('../models/user');
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
	if (user)
		return res.status(400).send('user already registered');
	
	// if its valid --> update the db
	user = new User(_.pick(req.body, ['name', 'email', 'password']));
	
	await user.save();
	// we choose only the fields we want. we don't want to pick password.
	user = _.pick(user, ['_id', 'name', 'email']);
	res.send(user);

});

module.exports = router;