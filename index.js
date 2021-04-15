const config = require('config');
const mongoose =  require('mongoose');
const Joi = require('joi');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

// if jwtPrivateKey environment variable is not set we would like exit the app. otherwise the app will crush.
if (!config.get('jwtPrivateKey'
	)) {
	console.error('FATAL ERROR: jwtPrivateKey environment variable is not defined. This app will now shut down...')
	process.exit(1);
} 

mongoose.connect('mongodb://localhost/mlc')
	.then(() => console.log('connect to mongodb...'))
	.catch(err => console.error('coould not connect to mongodb', err));


var cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/api/users', users);
app.use('/api/auth', auth);

// PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));