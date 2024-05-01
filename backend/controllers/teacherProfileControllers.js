const TeacherProfile = require('../models/TeacherProfile');
const User = require('../models/TeacherProfile');
const cloudinary = require('cloudinary').v2;

exports.createTeacherProfile = async (req, res) => {
    try {
        const {
            fullName,
            bio,
            facultyRoom,
            department,
            employeeId,
        } = req.body;

        const newProfile = new TeacherProfile({
            fullName,
            bio,
            facultyRoom,
            department,
            employeeId,
            createdBy: req.user.userId
        });

        if(req.file) {
            const teacherProfileFile = req.file;
            const result = await cloudinary.uploader.upload(teacherProfileFile.path);
            newProfile.profilePicture = result.secure_url;
        }

        const savedProfile = await newProfile.save();

        const user = await User.findByIdAndUpdate(req.user.userId, {
            fullName: savedProfile.fullName,
            profilePicture: savedProfile.profilePicture || null
        });

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

        if(req.file) {
            const teacherProfileFile = req.file;
            const result = await cloudinary.uploader.upload(teacherProfileFile.path);
            profileToUpdate.profilePicture = result.secure_url;
        }

        const updatedProfile = await profileToUpdate.save();

        const user = await User.findByIdAndUpdate(req.user.userId, {
            fullName: profileToUpdate.fullName,
            profilePicture: profileToUpdate.profilePicture || null
        });

        return res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error editing teacher profile:', error);
        return res.status(500).json({ message: 'Failed to edit teacher profile' });
    }
};

exports.getAnotherTeacherProfileById = async (req, res) => {
    const { userId } = req.params;

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

exports.getAllTeacherProfiles = async (req, res) => {
    try {
        const profiles = await TeacherProfile.find({ fullName: { $ne: req.user.fullName } });

        if(!profiles){
            res.status(404).json({message: 'Profiles not found'})
        }

        res.status(200).json(profiles);
    } catch (error) {
        console.log("Error fetching profiles: ", error);
        res.status(500).json({message: 'Internal server error'})
    }
};

exports.searchTeacherProfiles = async (req, res) => {
    const { query } = req.query;

    try {
        const profiles = await TeacherProfile.find({
        $or: [
            { fullName: { $regex: query, $options: 'i' } },
            { department: { $regex: query, $options: 'i' } },
            { employeeId: { $regex: query, $options: 'i' } },
            { facultyRoom: { $regex: query, $options: 'i' } },
        ]
        });

        res.status(200).json(profiles);
    } catch (error) {
        console.error('Error searching profiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllNonFriendProfiles = async (req, res) => {
    try {
        let email = req.user.email;
        email.toString();

        const currentUser = await User.findOne({email: email});

        if (!currentUser) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const friendFullNames = currentUser.friends?.map(function(friend){
            return friend.fullName
        });

        const userProfiles = await TeacherProfile.find({
            $and: [
                { createdBy: { $ne: userId } }, // Exclude current user's profile
                { fullName: { $nin: friendFullNames } } // Exclude friend profiles
            ]
        });

        res.status(200).json(userProfiles);
    } catch (error) {
        console.error('Error getting user profiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};