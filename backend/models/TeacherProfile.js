const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    department: { type: String, required: true },
    facultyRoom: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    bio: { type: String },
    profilePicture: { type: String },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const TeacherProfile = mongoose.model('TeacherProfile', teacherProfileSchema);

module.exports = TeacherProfile;