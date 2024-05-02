const mongoose = require('mongoose');

// Define Schema for Message
const messageSchema = new mongoose.Schema(
    {
        sender:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            trim: true
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        },
        fullName: {
            type: String
        },
        profilePicture: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;