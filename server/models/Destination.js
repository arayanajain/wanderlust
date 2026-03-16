const mongoose = require('mongoose');

// --- 1. Define Itinerary Schema ---
const ItinerarySchema = new mongoose.Schema({
    day: { type: Number, required: true },
    activity: { type: String, required: true },
});

// --- 2. Define Sub-Destination Schema (which includes Itinerary) ---
const SubDestinationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    detail: { type: String, required: true },
    image: { type: String, required: true }, // URL to the image
    itinerary: [ItinerarySchema] // REQUIRED: Defines the nested itinerary structure
});

// --- 3. Define Main Country Schema ---
const DestinationSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
        trim: true
    },
    motto: String,
    description: String,
    image: String,
    // The main destinations (Tokyo, Rome, etc.) are stored as an array of embedded documents
    destinations: [SubDestinationSchema]
});

// Compiles the schema into a Model we can use to interact with the database
const Destination = mongoose.model('Destination', DestinationSchema);

module.exports = Destination;