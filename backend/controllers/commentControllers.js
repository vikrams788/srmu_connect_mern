const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
    try {
        const { text, fullName, profilePicture } = req.body;
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
        return res.status(404).json({ message: 'Post not found' });
        }
        const comment = new Comment({
        text,
        createdBy: req.user.userId,
        postId,
        fullName,
        profilePicture
        });
        await comment.save();
        post.comments.push(comment);
        await post.save();
        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({postId: postId});
        if (!comments) {
        return res.status(404).json({ message: 'Comments not found' });
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { commentId, text } = req.body;
        const comment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
        if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};