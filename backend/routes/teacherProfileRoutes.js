const express = require('express');
const router = express.Router();
const teacherProfileControllers = require('../controllers/teacherProfileControllers');
const authMiddleware = require('../middleware/authMiddleware');
const excelUpload = require('../middleware/excelUpload');

router.post('/create-teacher-profile', authMiddleware, teacherProfileControllers.createTeacherProfile);

module.exports = router;