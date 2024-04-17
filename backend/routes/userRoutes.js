const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware')

router.get('/pending-requests/:userId', authMiddleware, userControllers.getPendingRequests);
router.get('/user', authMiddleware, userControllers.getUserById);
router.get('/posts/user/friends', authMiddleware, userControllers.getFriendsPosts);

router.post('/signup', userControllers.signup);

router.post('/login', userControllers.login);

router.post('/logout', userControllers.logout);

router.post('/remove-friend', authMiddleware, userControllers.removeFriend)

module.exports = router;