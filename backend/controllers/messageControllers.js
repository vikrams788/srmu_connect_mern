const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
    const { content, chatId, fullName, profilePicture } = req.body;

    var newMessage = {
        sender: req.user.userId,
        content: content,
        chat: chatId,
        fullName: fullName,
        profilePicture: profilePicture
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate('sender', 'fullName profilePicture');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'fullName, profilePicture, email'
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        });

        res.status(201).json(message)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'fullName profilePicture, email')
            .populate('chat');

        res.status(201).json(messages);
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
};