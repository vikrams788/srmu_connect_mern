const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postCaption: String,
  postImage: String,
  postVideo: String,
  postLink: String,
  postEmbeddedVideo: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Post', postSchema);