const express = require('express');
const router = express.Router();
const postController = require('../controllers/postControllers');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multerMiddleware');

router.post('/posts', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), postController.createPost);

router.put('/posts/:postId/like', authMiddleware, postController.handleLikes);

router.put('/posts/:postId/delete-comment', authMiddleware, postController.deleteComment);

router.delete('/posts/:postId/unlike', authMiddleware, postController.handleUnlike);

router.get('/posts', authMiddleware, postController.getAllPosts);

router.get('/my-posts', authMiddleware, postController.getCurrentUserPosts);

router.get('/posts/:id', authMiddleware, postController.getPostById);

router.get('/posts/user/:id', authMiddleware, postController.getAnotherUsersPosts);

router.put('/posts/:id', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), postController.editPost);

router.delete('/posts/:id', authMiddleware, postController.deletePostById);

module.exports = router;
