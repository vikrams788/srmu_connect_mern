const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;

exports.createPost = async (req, res) => {
    try {
        const { text, link, postType, embeddedVideo } = req.body;
        let imageUrl, videoUrl;
        const userId = req.user.userId;

        if (postType === 'image-option' && req.files.image) {
            const imageUploadResponse = await cloudinary.uploader.upload(req.files.image[0].path);
            imageUrl = imageUploadResponse.secure_url;
        } else if (postType === 'video-option' && req.files.video) {
            const videoUploadResponse = await cloudinary.uploader.upload(req.files.video[0].path, { resource_type: 'video' });
            videoUrl = videoUploadResponse.secure_url;
        }

        const newPost = new Post({
            createdBy: userId,
            text,
            link,
            image: imageUrl,
            video: videoUrl,
            postType,
            embeddedVideo
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCurrentUserPosts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const posts = await Post.find({ createdBy: userId }).sort({createdAt: -1});

        const postsWithCounts = await Promise.all(posts.map(async (post) => {
            const likesCount = post.likes.length;
            const commentsCount = post.comments.length;
            const isLiked = post.likes.some(function(like){
                return like.likedBy == userId
            });

            return {
                ...post.toJSON(),
                likesCount,
                commentsCount,
                isLiked
            };
        }));

        res.status(200).json(postsWithCounts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1});
        const userId = req.user.userId;

        const postsWithCounts = await Promise.all(posts.map(async (post) => {
            const likesCount = post.likes.length;
            const commentsCount = post.comments.length;
            const isLiked = post.likes.some(function(like){
                return like.likedBy == userId
            });

            return {
                ...post.toJSON(),
                likesCount,
                commentsCount,
                isLiked
            };
        }));

        res.status(200).json(postsWithCounts);
    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};  

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).sort({createdAt: -1});
        const userId = req.user.userId;

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likesCount = post.likes.length;
        const commentsCount = post.comments.length;
        const isLiked = post.likes.some(function(like){
            return like.likedBy == userId
        });

        const postDataWithCounts = {
            ...post.toJSON(),
            likesCount,
            commentsCount,
            isLiked
        };

        res.status(200).json(postDataWithCounts);
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAnotherUsersPosts = async (req, res) => {
    try {
        const id = req.params.id;

        const posts = await Post.find({ createdBy: id }).sort({createdAt: -1});

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        const userId = req.user.userId;

        const postsWithCounts = posts.map(post => {
            const likesCount = post.likes.length;
            const commentsCount = post.comments.length;
            const isLiked = post.likes.some(function(like){
                return like.likedBy == userId
            });

            return {
                ...post.toJSON(),
                likesCount,
                commentsCount,
                isLiked
            };
        });

        res.status(200).json(postsWithCounts);
    } catch (error) {
        console.error('Error fetching posts by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { text, link } = req.body;

        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        existingPost.text = text;
        existingPost.link = link;

        await existingPost.save();
        res.status(200).json({ message: 'Post updated successfully', post: existingPost });
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deletePostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully', post: deletedPost });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.handleLikes = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.userId
    const { fullName } = req.body

    try {
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.some(like => like.likedBy.equals(userId))) {
            return res.status(400).json({ message: 'Post already liked by the user' });
        }

        post.likes.push({ likedBy: userId, fullName });
        await post.save();

        res.status(200).json({ message: 'Post liked', likes: post.likes.length });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.handleUnlike = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId;
  
    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const existingLikeIndex = post.likes.findIndex(like => like.likedBy.equals(userId));

        if (existingLikeIndex === -1) {
            return res.status(400).json({ message: 'User has not liked this post' });
        }

        post.likes.splice(existingLikeIndex, 1);
        await post.save();

        res.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
        console.error('Error removing like:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteComment = async (req, res) => {
    const { postId } = req.params;
    const { commentId } = req.body;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const commentIndex = post.comments.findIndex((comment) => comment.equals(commentId));

        if (commentIndex === -1) {
            return res.status(400).json({ message: 'Comment not found in post' });
        }

        post.comments.splice(commentIndex, 1);

        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};