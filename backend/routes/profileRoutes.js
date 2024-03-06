const express = require('express');
const router = express.Router();
const profileControllers = require('../controllers/profileControllers');
const { upload } = require('../middleware/multerMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/profile', authMiddleware, upload.single("profilePicture"), profileControllers.createUserProfile);

router.get('/profile', authMiddleware, profileControllers.getUserProfile);

router.delete('/profile', authMiddleware, profileControllers.deleteUserProfile);

module.exports = router;