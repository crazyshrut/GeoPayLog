require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Transaction = require('./models/Transaction');

// Initialize the Express application
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests (crucial for mobile app)
app.use(express.json()); // Parse incoming JSON payloads

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;
let dbConnected = false;
let localTransactions = []; // Fallback memory

if (!MONGODB_URI) {
    console.error("WARNING: MONGODB_URI is missing. Using local memory.");
} else {
    mongoose.connect(MONGODB_URI, { family: 4 })
        .then(() => {
            console.log('✅ Connected to MongoDB Atlas');
            dbConnected = true;
        })
        .catch(err => {
            console.error('❌ MongoDB Connection Failed (Network Blocked?)');
            console.log('⚠️  SWITCHING TO OFFLINE MODE (In-Memory) for Demo Video');
            dbConnected = false;
        });
}

// --- API Routes ---

/**
 * GET /
 * Simple health check to see if server is running.
 */
app.get('/', (req, res) => {
    res.send('GeoPayLog API is Running 🚀');
});

/**
 * POST /api/log
 * Saves a new transaction with location data.
 * Expects: { deviceId, amount, note, lat, long }
 */
app.post('/api/log', async (req, res) => {
    try {
        const { deviceId, amount, note, lat, long } = req.body;

        // Basic Validation
        if (!deviceId || !amount || !lat || !long) {
            return res.status(400).json({ error: 'Missing required fields (deviceId, amount, lat, long)' });
        }

        if (dbConnected) {
            const newTransaction = new Transaction({
                deviceId, amount, note, location: { lat, long }
            });
            const savedTx = await newTransaction.save();
            console.log(`📝 [DB] Logged: ${note} - ₹${amount}`);
            res.status(201).json(savedTx);
        } else {
            const newTx = {
                _id: Math.random().toString(36).substr(2, 9),
                deviceId, amount, note, location: { lat, long },
                timestamp: new Date()
            };
            localTransactions.push(newTx);
            console.log(`📝 [MEM] Logged: ${note} - ₹${amount}`);
            res.status(201).json(newTx);
        }

    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * GET /api/history
 * Retrieves all transactions for a specific device.
 * Expects header: x-device-id
 */
app.get('/api/history', async (req, res) => {
    try {
        const deviceId = req.headers['x-device-id'];

        if (!deviceId) {
            return res.status(400).json({ error: 'Missing x-device-id header' });
        }

        // Find transactions for this device, sorted by newest first
        if (dbConnected) {
            const history = await Transaction.find({ deviceId }).sort({ timestamp: -1 });
            res.json(history);
        } else {
            const history = localTransactions
                .filter(t => t.deviceId === deviceId)
                .sort((a, b) => b.timestamp - a.timestamp);
            res.json(history);
        }

    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
// Listen on 0.0.0.0 to accessible from local network (mobile phone)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local Network URL: http://<YOUR_IP_ADDRESS>:${PORT}`);
});
