const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const jwt = require('jsonwebtoken');

// --- Middleware to protect the route (Defined but NOT USED on the GET route) ---
// This is kept here in case you need it for future private routes (e.g., POST, PUT).
const protect = (req, res, next) => {
    let token;

    // Check for "Bearer <token>" in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token (remove "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token (use the same secret key you used in userRoutes)
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            
            // Optionally attach the decoded user ID to the request if needed later
            req.userId = decoded.id; 

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed or expired.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};

// @route GET /api/destinations
// @desc Get all countries and their destinations (Authentication REMOVED)
// @access Public (Necessary for the client to load data after login)
router.get('/', async (req, res) => { 
    try {
        // Fetch ALL destination data 
        const countries = await Destination.find({}); 
        
        // Server log to help debug
        if (countries.length > 0) {
            console.log(`[SERVER LOG] Data found: ${countries.length} countries.`);
        } else {
            console.log(`[SERVER LOG] Database query returned 0 countries.`);
        }

        res.status(200).json(countries);

    } catch (error) {
        console.error('Error fetching destinations:', error);
        res.status(500).json({ message: 'Server error when fetching travel data.' });
    }
});

module.exports = router;