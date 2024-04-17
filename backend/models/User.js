const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'teacher'], 
        default: 'user' 
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    profilePicture: {
        type: String
    },
    fullName: {
        type: String

    },
    pendingRequests: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            fullName: {
                type: String,
                required: true
            },
            profilePicture: {
                type: String,
                required: true
            }
        }
    ],
    friends: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            fullName: {
                type: String,
                required: true
            },
            profilePicture: {
                type: String,
                required: true
            }
        }
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;