const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const messageControllers = require('../controllers/messageControllers');

router.post('/send', authMiddleware, messageControllers.sendMessage);
router.get('all-messages', authMiddleware, messageControllers.allMessages);

module.exports = router;