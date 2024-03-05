const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  email: {
    type: String
  },
  course: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  }
  
});

module.exports = mongoose.model('Profile', profileSchema);