const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const Post = require('../models/Post');
const exceljs = require('exceljs');
const fs = require('fs');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Signup, instead!' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: '2d' });
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

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const generatedOTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

        const newUser = new User({ email, otp: generatedOTP });
        await newUser.save();

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: process.env.MY_EMAIL,
              pass: process.env.PASSWORD,
            },
        });

        let mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: 'Your Login OTP',
            text: `Your OTP is: ${generatedOTP}`,
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                message: 'Failed to send OTP via email',
                });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({
                    message: 'OTP sent successfully',
                    userId: newUser._id,
                });
            }
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { otp, password } = req.body;

        const user = await User.findOne({ otp });

        if (!user) {
            return res.status(404).json({
                message: 'User not found or invalid OTP',
            });
        }

        const isStudentEmail = user.email.endsWith('.stdnt@srmu.ac.in');
        const role = isStudentEmail ? 'student' : 'teacher';

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.role = role;
        await user.save();

        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: '2d' });
        const token2 = jwt.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: '2d' });

        res.cookie('token', token, { 
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 10800000),
        });

        return res.status(200).json({
            message: 'User created successfully',
            user,
            token2
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error' });
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

exports.uploadExcelFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;

        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(filePath);

        let userData = [];

        workbook.eachSheet((worksheet) => {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;
        
                const email = row.values[1]?.text;
                const password = row.values[2];
                const role = row.values[3];
        
                if (email && password && role) {
                    userData.push({ email, password, role });
                }
            });
        });

        await Promise.all(
            userData.map(async (user) => {
                const { email, password, role } = user;
                console.log('Processing user:', email);
        
                const existingUser = await User.findOne({ email });
                const hashedPassword = await bcrypt.hash(password, 10);
        
                if (!existingUser) {
                    const newUser = new User({ email, password: hashedPassword, role });
                    console.log('New user:', newUser);
                    await newUser.save();
                }
            })
        );

        fs.unlinkSync(filePath);

        res.status(201).json({ message: 'Users created successfully from Excel file' });
    } catch (error) {
        console.error('Error processing Excel file:', error);
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