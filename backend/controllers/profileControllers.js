const User = require('../models/User');

exports.createUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userProfileData = req.body;
        const userProfileFile = req.file;
        console.log("user profile file", userProfileFile);

        const userProfile = new Profile({
        createdBy: userId,
        ...userProfileData,
        });
        console.log(userProfile);

        if (userProfileFile) {
            const result = await cloudinary.uploader.upload(userProfileFile.path);
            userProfile.profilePicture = result.secure_url;
        }

        await userProfile.save();

        res.status(201).json({ message: 'Profile Saved' })

    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userProfile = await User.findById(userId);
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error getting user profile:', error);
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
