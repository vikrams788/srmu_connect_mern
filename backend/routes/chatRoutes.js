const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const chatControllers = require('../controllers/chatControllers');

router.get('/chat', authMiddleware, chatControllers.accessChat);
router.get('/all-chats', authMiddleware, chatControllers.fetchChat);
router.post('/group', authMiddleware, chatControllers.createGroup);
router.put('/rename', authMiddleware, chatControllers.renameGroup);
router.put('/remove-group', authMiddleware, chatControllers.removeGroup);
router.delete('delete', authMiddleware, chatControllers.deleteGroup);
router.put('/add', authMiddleware, chatControllers.addToGroup);

module.exports = router;