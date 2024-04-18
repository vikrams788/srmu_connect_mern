const TeacherProfile = require('../models/TeacherProfile');
const xlsx = require('xlsx');

exports.createTeacherProfile = async (req, res) => {
    try {
        const {
            fullName,
            bio,
            facultyRoom,
            department,
            employeeId,
            profilePicture
        } = req.body;

        const newProfile = new TeacherProfile({
            fullName,
            bio,
            facultyRoom,
            department,
            employeeId,
            profilePicture,
            createdBy: req.user.userId
        });

        const savedProfile = await newProfile.save();
        return res.status(201).json(savedProfile);
    } catch (error) {
        console.error('Error creating teacher profile:', error);
        return res.status(500).json({ message: 'Failed to create teacher profile' });
    }
};

exports.getTeacherProfileById = async (req, res) => {
    const userId = req.user.userId;

    try {
        const profile = await TeacherProfile.findOne({createdBy: userId});

        if (!profile) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        return res.status(200).json(profile);
    } catch (error) {
        console.error('Error getting teacher profile:', error);
        return res.status(500).json({ message: 'Failed to get teacher profile' });
    }
};

exports.editTeacherProfileById = async (req, res) => {
    const {
        fullName,
        bio,
        facultyRoom,
        department,
        employeeId,
        profilePicture
    } = req.body;

    try {
        const profileToUpdate = await TeacherProfile.findOne({createdBy: req.user.userId});

        if (!profileToUpdate) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        profileToUpdate.fullName = fullName;
        profileToUpdate.bio = bio;
        profileToUpdate.facultyRoom = facultyRoom;
        profileToUpdate.department = department;
        profileToUpdate.employeeId = employeeId;
        profileToUpdate.profilePicture = profilePicture;

        const updatedProfile = await profileToUpdate.save();

        return res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error editing teacher profile:', error);
        return res.status(500).json({ message: 'Failed to edit teacher profile' });
    }
};

exports.getAnotherTeacherProfileById = async (req, res) => {
    const { profileId } = req.params;

    try {
        const profile = await TeacherProfile.findById(profileId);

        if (!profile) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        return res.status(200).json(profile);
    } catch (error) {
        console.error('Error getting teacher profile:', error);
        return res.status(500).json({ message: 'Failed to get teacher profile' });
    }
};
