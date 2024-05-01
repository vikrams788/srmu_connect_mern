const Profile = require('../models/Profile');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const excel = require('exceljs');


exports.createUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userProfileData = req.body;
        const userProfileFile = req.file;

        const userProfile = new Profile({
            createdBy: userId,
            fullName: userProfileData.fullName,
            bio: userProfileData.bio,
            email: userProfileData.email,
            course: userProfileData.course,
            rollNo: userProfileData.rollNo,
            semester: userProfileData.semester
        });

        if (userProfileFile) {
            const result = await cloudinary.uploader.upload(userProfileFile.path);
            userProfile.profilePicture = result.secure_url;
        }

        await userProfile.save();

        const user = await User.findByIdAndUpdate(userId, {
            fullName: userProfileData.fullName,
            profilePicture: userProfile.profilePicture || null
        });

        res.status(201).json(userProfile)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

exports.editUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userProfileData = req.body;
        const userProfileFile = req.file;

        let userProfile = await Profile.findOne({ createdBy: userId });
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        userProfile.fullName = userProfileData.fullName || userProfile.fullName;
        userProfile.bio = userProfileData.bio || userProfile.bio;
        userProfile.email = userProfileData.email || userProfile.email;
        userProfile.course = userProfileData.course || userProfile.course;
        userProfile.rollNo = userProfileData.rollNo || userProfile.rollNo;
        userProfile.semester = userProfileData.semester || userProfile.semester;

        if (userProfileFile) {
            const result = await cloudinary.uploader.upload(userProfileFile.path);
            userProfile.profilePicture = result.secure_url;
        }

        await userProfile.save();

        const user = await User.findByIdAndUpdate(userId, {
            fullName: userProfile.fullName,
            profilePicture: userProfile.profilePicture || null
        });

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userProfile = await Profile.findOne({createdBy: userId});
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAnotherUsersProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const userProfile = await Profile.findOne({createdBy: userId});
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllUsersProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const friendFullNames = currentUser.friends.map(function(friend){
            return friend.fullName
        });

        const userProfiles = await Profile.find({
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

exports.getProfilesBySenderIds = async (req, res) => {
    try {
        const { senderIds } = req.query;
        const senderIdsArray = senderIds.split(',').map(id => id.trim());

        const profiles = await Profile.find({ userId: { $in: senderIdsArray } });

        res.status(200).json({ profiles });
    } catch (error) {
        console.error('Error fetching sender profiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.searchProfiles = async (req, res) => {
    const { query } = req.query;

    try {
        const profiles = await Profile.find({
        $or: [
            { fullName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { course: { $regex: query, $options: 'i' } },
            { rollNumber: { $regex: query, $options: 'i' } },
            { semester: { $regex: query, $options: 'i' } }
        ]
        });

        res.status(200).json(profiles);
    } catch (error) {
        console.error('Error searching profiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};