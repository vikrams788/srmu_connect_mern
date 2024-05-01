const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.sendFriendRequest = async (req, res) => {
    const { senderId, recipientId, fullName, profilePicture, role } = req.body;

    try {
        const existingRequestAB = await FriendRequest.findOne({ sender: senderId, recipient: recipientId });

        const existingRequestBA = await FriendRequest.findOne({ sender: recipientId, recipient: senderId });

        if (existingRequestAB || existingRequestBA) {
            return res.status(400).json({ message: 'Friend request already sent or received' });
        }

        const newRequest = new FriendRequest({
            sender: senderId,
            recipient: recipientId
        });

        await newRequest.save();

        const recipient = await User.findByIdAndUpdate(recipientId, {
            $push: {
                pendingRequests: {
                    userId: senderId,
                    fullName: fullName,
                    profilePicture: profilePicture,
                    role: role
                }
            }
        });

        res.status(201).json({ message: 'Friend request sent successfully', friendRequest: newRequest });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.acceptFriendRequest = async (req, res) => {
    const requestId = req.params.requestId;

    try {
        const request = await FriendRequest.findOne({ sender: requestId });

        if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: 'Friend request not found or already accepted' });
        }

        await User.findByIdAndUpdate(
            request.recipient,
            {
                $push: {
                    friends: {
                        userId: request.sender,
                        fullName: req.body.fullName,
                        profilePicture: req.body.profilePicture,
                        role: req.body.role
                    }
                },
                $pull: { pendingRequests: { userId: request.sender } }
            },
            { new: true }
        );

        await User.findByIdAndUpdate(
            request.sender,
            {
                $push: {
                    friends: {
                        userId: request.recipient,
                        fullName: req.body.currentUserFullName,
                        profilePicture: req.body.currentUserProfilePicture,
                        role: req.body.currentUserRole
                    }
                }
            },
            { new: true }
        );

        await FriendRequest.findOneAndDelete({sender: requestId});

        res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteFriendRequest = async (req, res) => {
    const requestId = req.params.requestId;
    const objectId = mongoose.Types.ObjectId(requestId)

    try {
        const request = await FriendRequest.findOne({sender: objectId});

        if (!request) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        await User.findByIdAndUpdate(request.recipient, {
            $pull: { pendingRequests: { userId: request.userId } }
        });

        await FriendRequest.findOneAndDelete({sender: requestId});

        res.status(200).json({ message: 'Friend request deleted successfully' });
    } catch (error) {
        console.error('Error deleting friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};