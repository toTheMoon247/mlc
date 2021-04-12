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
	user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});
	
	await user.save();
	res.send(user);

});

module.exports = router;