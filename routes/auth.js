const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');

router.post('/', UsersController.login);

module.exports = router;