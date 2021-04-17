
const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
// get the id from the jwt. malicious client can't send :id and try get other user data
// router.get('/me', async(req, res) => {

// })

router.get('/', UsersController.get_all);
router.post('/', UsersController.register);

module.exports = router;