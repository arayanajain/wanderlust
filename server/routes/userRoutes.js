// --- User Routes: routes/userRoutes.js ---
const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
// NOTE: We assume you will integrate JWT later for full token access.

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    // 1. Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password.' });
    }

    try {
        // 2. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with that email already exists.' });
        }

        // 3. Create a new user instance
        // Password hashing is handled automatically by the pre-save hook in the User model
        user = new User({
            email,
            password, 
            name: name || email,
        });

        // 4. Save the user
        await user.save();

        res.status(201).json({ message: 'Registration successful. You can now log in.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during registration.');
    }
});


// @route   POST /api/users/login
// @desc    Authenticate user and get token (REAL DB CHECK)
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password.' });
    }

    try {
        // 2. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Vague message for security
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Compare the submitted password with the hashed password in the DB
        // This uses the comparePassword method defined in server/models/User.js (via bcrypt)
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 4. Login Success!
        // NOTE: If using JWT, this is where you would call jwt.sign()
        res.status(200).json({ 
            message: 'Login successful.',
            userId: user._id, 
            name: user.name 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login process.');
    }
});

module.exports = router;