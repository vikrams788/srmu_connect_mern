const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/signup', userControllers.signup);

router.post('/login', userControllers.login);

router.post('/logout', userControllers.logout);

module.exports = router;
