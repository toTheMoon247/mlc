
const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');

router.get('/', UsersController.get_all);
router.post('/', UsersController.register);

module.exports = router;