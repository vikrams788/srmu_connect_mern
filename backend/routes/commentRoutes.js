const express = require('express');
const router = express.Router();
const commentControllers = require('../controllers/commentControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/comments/:postId', authMiddleware, commentControllers.createComment);

router.get('/comments/:postId', authMiddleware, commentControllers.getCommentsByPostId);

router.put('/comments/:commentId', authMiddleware, commentControllers.updateComment);

router.delete('/comments/:commentId', authMiddleware, commentControllers.deleteComment);

module.exports = router;