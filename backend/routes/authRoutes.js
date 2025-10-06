const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User Mongoose model

// JWT Secret (It's good practice to load this from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_mongodb_key_123'; // Fallback for development

// Helper function to generate a JWT
const generateToken = (userPayload) => {
    return jwt.sign(userPayload, JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Access Denied: No Token Provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ msg: 'Invalid Token' });
        }
        req.user = user; // Attach decoded user payload to the request
        next();
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Input validation checks
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields (Name, Email, Password)' });
    }
    if (!/.+@.+\..+/.test(email)) {
        return res.status(400).json({ msg: 'Please enter a valid email address' });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if user with this email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'An account with this email already exists.' });
        }

        // Create new user instance (password hashing handled by pre-save hook in User model)
        user = new User({
            name,
            email,
            password, // Mongoose will hash this before saving
        });

        await user.save(); // Save the new user to MongoDB

        // Generate token including user's id, name, and email in the payload
        // Mongoose automatically adds an _id field when saving
        const token = generateToken({ id: user._id, name: user.name, email: user.email });

        res.status(201).json({
            msg: 'User registered successfully! Welcome!',
            user: { id: user._id, name: user.name, email: user.email },
            token
        });

    } catch (err) {
        console.error('SERVER ERROR during registration:', err.message);
        res.status(500).send('Something went wrong on our end. Please try again.');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter both email and password' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Generate token including user's id, name, and email in the payload
        const token = generateToken({ id: user._id, name: user.name, email: user.email });

        res.json({
            msg: 'Login successful!',
            user: { id: user._id, name: user.name, email: user.email },
            token
        });

    } catch (err) {
        console.error('SERVER ERROR during login:', err.message);
        res.status(500).send('Something went wrong on our end during login. Please try again.');
    }
});

// IMPORTANT: Export both the router and the authenticateToken middleware
module.exports = {
    router: router,
    authenticateToken: authenticateToken
};