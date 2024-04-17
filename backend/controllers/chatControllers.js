const Chat = require('../models/Chat');
const User = require('../models/User');

exports.accessChat = async (req, res) => {
    const currentUserId = req.user.userId;
    const { anotherUserName } = req.query;

    const user = await User.findById(currentUserId);
    const anotherUser = await User.findOne({fullName: anotherUserName});

    if (!user || !anotherUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isFriendOfUser = user.friends.some(function(friend){
        return friend.fullName.includes(anotherUserName);
    });

    if (!isFriendOfUser) {
        return res.status(403).json({ message: 'You can only access chats with your friends' });
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        users: { $all: [currentUserId, anotherUser._id] }
    })
        .populate('users', '-password')
        .populate('latestMessage');

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'fullName profilePic email'
    });

    if(isChat.length > 0){
        res.status(200).json(isChat[0]);
    } else {
        try {
            var chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [currentUserId, anotherUser._id]
            };

            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({_id: createdChat._id}).populate('users', '-password')

            res.status(200).json(fullChat);
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
};

exports.fetchChat = async (req, res) => {
    try {
        Chat.find({users: req.user.userId})
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({updatedAt: -1})
            .then(async(results) => {
                results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'fullName profilePicture email'
                })

                res.status(201).json(results);
            });
    } catch (error){
        res.status(500).json({message: "Internal server error"});
    }
};

exports.createGroup = async (req, res) => {
    var users = JSON.parse(req.body.users);

    users.push(req.user);

    if(users.length < 2){
        res.status(400).json({message: 'More than two users are required to form a group'});
    }

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat_id})
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName: chatName}, {new: true})
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
    
    if(!updatedChat) {
        res.status(404).json({mesage: 'Chat not found'});
    } else {
        res.status(201).json(updatedChat);
    }
};

exports.addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: {users: userId}
    }, {new: true})
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
    
    if(!added){
        res.status(404).json({message: 'Chat not found'});
    } else {
        res.status(201).json(added);
    }
};

exports.removeGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: {users: userId}
    }, {new: true})
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
    
    if(!removed){
        res.status(404).json({message: 'Chat not found'});
    } else {
        res.status(201).json(removed);
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { chatId } = req.body;
        const userId = req.user.userId;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (!chat.isGroupChat) {
            return res.status(400).json({ message: 'This is not a group chat' });
        }

        if (!chat.groupAdmin.equals(userId)) {
            return res.status(403).json({ message: 'Only the group admin can delete this chat' });
        }

        const deletedChat = await Chat.findByIdAndDelete(chatId);
        if (!deletedChat) {
            return res.status(404).json({ message: 'Chat not found or already deleted' });
        }

        res.status(200).json({ message: 'Group chat deleted successfully' });
    } catch (error) {
        console.error('Error deleting group chat:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};