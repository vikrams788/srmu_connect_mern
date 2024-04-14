const express = require('express');
const router = express.Router();
const friendRequestControllers = require('../controllers/friendRequestControllers');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/friend-requests', authMiddleware, friendRequestControllers.sendFriendRequest);

router.put('/friend-requests/:requestId', authMiddleware, friendRequestControllers.acceptFriendRequest);

router.delete('/friend-requests/:requestId', authMiddleware, friendRequestControllers.deleteFriendRequest);

module.exports = router;