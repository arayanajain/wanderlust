const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// --- Import Routes ---
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');

// Load environment variables (like MONGO_URI)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enable CORS for client communication
app.use(express.json()); // Enable parsing of JSON body

// --- MongoDB Connection Logic (CRITICAL FIX) ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wanderlustDB';

async function connectDB() {
    try {
        console.log(`Attempting to connect to MongoDB at: ${MONGO_URI}`);
        // Ensure that the connection attempts until successful
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB successfully connected!');

        // --- Only start server AFTER successful DB connection ---
        app.listen(PORT, () => {
            console.log(`Express server is listening on port ${PORT}`);
        });

    } catch (error) {
        console.error('MongoDB connection FAILED:', error.message);
        // Exit process with failure code if connection cannot be established
        process.exit(1);
    }
}

// Execute the connection function
connectDB();

// --- API Routes ---
// These routes must be defined BEFORE the server starts listening (which is handled inside connectDB)

app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);

// Simple default route for health check
app.get('/', (req, res) => {
    res.send('Wanderlust Express API is running.');
});