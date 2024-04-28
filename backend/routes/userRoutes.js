const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware');
const excelUpload = require('../middleware/excelUpload');

router.get('/pending-requests/:userId', authMiddleware, userControllers.getPendingRequests);
router.get('/user', authMiddleware, userControllers.getUserById);
router.get('/posts/user/friends', authMiddleware, userControllers.getFriendsPosts);

router.post('/send-otp', userControllers.sendOTP);

router.post('/bulk-user-upload', authMiddleware, excelUpload.single('userDataFile'), userControllers.uploadExcelFile);

router.post('/login', userControllers.login);

router.post('/logout', userControllers.logout);

router.post('/remove-friend', authMiddleware, userControllers.removeFriend);

router.post('/signup', authMiddleware, userControllers.verifyOTP);

module.exports = router;