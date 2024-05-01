const express = require('express');
const router = express.Router();
const teacherProfileControllers = require('../controllers/teacherProfileControllers');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multerMiddleware');

router.post('/create-teacher-profile', upload.single("profilePicture"), authMiddleware, teacherProfileControllers.createTeacherProfile);
router.get('/teacher-profile', authMiddleware, teacherProfileControllers.getTeacherProfileById);
router.get('/teacher-profile/:userId', authMiddleware, teacherProfileControllers.getAnotherTeacherProfileById);
router.get('/teacher-profile/:profileId', authMiddleware, teacherProfileControllers.getTeacherProfileById);
router.put('/edit-teacher-profile', upload.single("profilePicture"), authMiddleware, teacherProfileControllers.editTeacherProfileById);
router.get('/all-teacher-profiles', authMiddleware, teacherProfileControllers.getAllTeacherProfiles);
router.get('/search-teacher-profiles', authMiddleware, teacherProfileControllers.searchTeacherProfiles);
router.get('/non-friend-profiles', authMiddleware, teacherProfileControllers.getAllNonFriendProfiles);

module.exports = router;