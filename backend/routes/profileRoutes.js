const express = require('express');
const router = express.Router();
const profileControllers = require('../controllers/profileControllers');
const { upload } = require('../middleware/multerMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/profile', authMiddleware, upload.single("profilePicture"), profileControllers.createUserProfile);

router.get('/profile', authMiddleware, profileControllers.getUserProfile);
router.get('/profile/:id', authMiddleware, profileControllers.getAnotherUsersProfile);
router.get('/all-profiles', authMiddleware, profileControllers.getAllUsersProfile);

router.delete('/profile', authMiddleware, profileControllers.deleteUserProfile);

router.put('/profile', authMiddleware, upload.single("profilePicture"), profileControllers.editUserProfile);

module.exports = router;