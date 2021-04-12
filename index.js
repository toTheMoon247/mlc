const mongoose =  require('mongoose');
const Joi = require('joi');
const users = require('./routes/users');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/mlc')
	.then(() => console.log('connect to mongodb...'))
	.catch(err => console.error('coould not connect to mongodb', err));

app.use(express.json());
app.use('/api/users', users);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));