const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

exports.sendFriendRequest = async (req, res) => {
    const { senderId, recipientId, fullName, profilePicture } = req.body;

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
                    profilePicture: profilePicture
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
        const request = await FriendRequest.findOne({sender: requestId});

        if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        await User.findByIdAndUpdate(request.recipient, {
            $push: {
                friends: {
                    userId: request.sender,
                    fullName: req.body.fullName,
                    profilePicture: req.body.profilePicture
                }
            },
            $pull: { pendingRequests: { userId: request.sender } }
        });

        await User.findByIdAndUpdate(request.sender, {
            $push: {
                friends: {
                    userId: request.recipient,
                    fullName: req.body.currentUserFullName,
                    profilePicture: req.body.currentUserProfilePicture
                }
            }
        });

        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteFriendRequest = async (req, res) => {
    const requestId = req.params.requestId;

    try {
        const request = await FriendRequest.findOne({sender: requestId});

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