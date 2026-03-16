const express = require('express');
const router = express.Router();
const SavedItinerary = require('../models/SavedItinerary');
const jwt = require('jsonwebtoken'); // Still needed for protect middleware

// --- Helper function to extract user ID from JWT (copied from destinationRoutes for self-containment) ---
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            req.userId = decoded.id; // Attach userId to the request
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

// @route POST /api/itineraries
// @desc Save a new itinerary for the authenticated user
// @access Private
router.post('/', protect, async (req, res) => {
    try {
        const { country, destination, detail, itinerary } = req.body;
        const destinationId = `${country}-${destination}`.toLowerCase().replace(/\s/g, '-');

        // Check if itinerary already exists for this user
        const existingItinerary = await SavedItinerary.findOne({ user: req.userId, destinationId });
        if (existingItinerary) {
            return res.status(400).json({ message: 'Itinerary already saved.' });
        }

        const newItinerary = new SavedItinerary({
            user: req.userId,
            destinationId,
            country,
            destination,
            detail,
            itinerary,
        });

        await newItinerary.save();
        res.status(201).json({ message: 'Itinerary saved successfully to MongoDB.' });

    } catch (error) {
        console.error('Error saving itinerary to MongoDB:', error);
        res.status(500).json({ message: 'Server error when saving itinerary.' });
    }
});

// @route GET /api/itineraries
// @desc Get all saved itineraries for the authenticated user
// @access Private
router.get('/', protect, async (req, res) => {
    try {
        const savedItineraries = await SavedItinerary.find({ user: req.userId }).sort({ savedAt: -1 });
        res.status(200).json(savedItineraries);
    } catch (error) {
        console.error('Error retrieving itineraries from MongoDB:', error);
        res.status(500).json({ message: 'Server error when retrieving itineraries.' });
    }
});


module.exports = router;