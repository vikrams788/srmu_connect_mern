const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const Post = require('../models/Post');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
        }

        const payload = {
            userId: user._id,
            email: user.email,
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, { expiresIn: '2d' });
        const token2 = jwt.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: '2d' });

        res.cookie('token', token, { 
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 10800000),
        });

        res.status(200).json({ message: 'Login successful', token2, user });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        const payload = {
            userId: newUser._id,
            email: newUser.email,
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRETKEY, { expiresIn: '2d' });
        const token2 = jwt.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: '2d' });

        res.cookie('token', token, { 
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 10800000),
        });
    
        res.status(201).json({ message: 'Signup successful', token2 });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getPendingRequests = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).populate('pendingRequests');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const pendingRequests = user.pendingRequests;

        res.status(200).json({ pendingRequests });
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getFriendsPosts = async (req, res) => {
    try {
        const userId = req.user.userId;

        const userData = await User.findById(userId).sort({createdAt: -1});

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friendUserIds = userData.friends.map(function(friend){
            return friend.userId;
        });

        const friendsPosts = await Post.find({ createdBy: { $in: friendUserIds } });

        res.status(200).json(friendsPosts);
    } catch (error) {
        console.error('Error fetching friends posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);
    } catch (error) {
        console.log('Error fetching the user: ', error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

exports.removeFriend = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        const user = await User.findById(userId);
        const friendToRemove = await User.findById(friendId);

        if (!user || !friendToRemove) {
            return res.status(404).json({ message: 'User or friend not found' });
        }

        const isFriendOfUser = user.friends.some(friend => friend.userId.toString() === friendId);
        const isFriendOfFriend = friendToRemove.friends.some(friend => friend.userId.toString() === userId);

        if (!isFriendOfUser || !isFriendOfFriend) {
            return res.status(400).json({ message: 'These users are not friends' });
        }

        user.friends = user.friends.filter(friend => friend.userId.toString() !== friendId);

        friendToRemove.friends = friendToRemove.friends.filter(friend => friend.userId.toString() !== userId);

        await user.save();
        await friendToRemove.save();

        const friendRequest = await FriendRequest.findOne({
            sender: friendId,
            recipient: userId,
            status: 'pending'
        });

        if (friendRequest) {
            await friendRequest.remove();
        }

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
    
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};