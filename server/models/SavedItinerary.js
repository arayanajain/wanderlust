const mongoose = require('mongoose');

// Define the nested schema for the daily itinerary
const ItinerarySchema = new mongoose.Schema({
    day: { type: Number, required: true },
    activity: { type: String, required: true },
});

// Define the schema for a single saved itinerary document
const SavedItinerarySchema = new mongoose.Schema({
    // Link this itinerary back to the specific user who saved it
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true,
    },
    // Unique identifier for the saved trip
    destinationId: {
        type: String,
        required: true,
        unique: true,
    },
    country: { type: String, required: true },
    destination: { type: String, required: true },
    detail: { type: String },
    // The actual itinerary array
    itinerary: [ItinerarySchema],
    savedAt: {
        type: Date,
        default: Date.now,
    },
});

const SavedItinerary = mongoose.model('SavedItinerary', SavedItinerarySchema);

module.exports = SavedItinerary;