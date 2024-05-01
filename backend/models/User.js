const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'teacher'],
        default: 'student'
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
    otp: {
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
            },
            role: {
                type: String
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
            },
            role: {
                type: String
            }
        }
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;