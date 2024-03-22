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
    enum: ['admin', 'user'], 
    default: 'user' 
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
  pendingRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FriendRequest',
    }
  ],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;