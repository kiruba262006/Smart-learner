const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./authRoutes'); // Import authentication middleware
const Post = require('../models/Post'); // Import the Post Mongoose model
const User = require('../models/User'); // Import the User Mongoose model for authorId reference

// POST /api/posts/ - Create a new post
// This route is protected by the authenticateToken middleware.
router.post('/', authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    // The author's name and ID are extracted from req.user, which was set by authenticateToken
    const author = req.user.name;
    const authorId = req.user.id; // This is the user's MongoDB _id

    // Input validation
    if (!title || !description) {
        return res.status(400).json({ msg: 'Title and description are required.' });
    }

    try {
        // Create a new post instance
        const newPost = new Post({
            title,
            description,
            author,
            authorId,
            // createdAt is automatically set by default in the schema
        });

        await newPost.save(); // Save the new post to MongoDB
        res.status(201).json({ msg: 'Post created successfully!', post: newPost });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ msg: 'Server error during post creation.' });
    }
});

// GET /api/posts/ - Fetch all posts
// This route is also protected by the authenticateToken middleware.
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Fetch all posts from MongoDB and sort them by createdAt in descending order (latest first)
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Fetch posts error:', error);
        res.status(500).json({ msg: 'Server error while fetching posts.' });
    }
});

module.exports = router;