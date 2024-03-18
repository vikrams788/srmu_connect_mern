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
        const userId = req.user.userId
        const posts = await Post.find({createdBy: userId});
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching all posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};  

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
        return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { text, link, postType } = req.body;
        let imageUrl, videoUrl;

        if (postType === 'image-option' && req.files.image) {
            const imageUploadResponse = await cloudinary.uploader.upload(req.files.image[0].path);
            imageUrl = imageUploadResponse.secure_url;
        }
        else if (postType === 'video-option' && req.files.video) {
            const videoUploadResponse = await cloudinary.uploader.upload(req.files.video[0].path, { resource_type: 'video' });
            videoUrl = videoUploadResponse.secure_url;
        }

        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        existingPost.text = text || existingPost.text;
        existingPost.link = link || existingPost.link;
        existingPost.postType = postType || existingPost.postType;
        existingPost.image = imageUrl || existingPost.image;
        existingPost.video = videoUrl || existingPost.video;

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