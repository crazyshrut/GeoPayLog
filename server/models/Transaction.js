const mongoose = require('mongoose');

// This model represents a single financial transaction.
// v2: Added 'category' field for expense classification.
// We index 'deviceId' because we will frequently query transactions for a specific device.

const TransactionSchema = new mongoose.Schema({
  // The unique ID of the device (phone) that created this log.
  // This allows us to share the backend without user accounts mixing up data.
  deviceId: { 
    type: String, 
    required: true, 
    index: true 
  },

  // The amount of money spent.
  amount: { 
    type: Number, 
    required: true 
  },

  // A short note describing the transaction (e.g., "Lunch", "Uber").
  note: { 
    type: String 
  },

  // v2: Category to classify spending (Food, Cafe, Travel, Shop, Other)
  category: {
    type: String,
    enum: ['Food', 'Cafe', 'Travel', 'Shop', 'Other'],
    default: 'Other'
  },

  // Geo-spatial data to pinpoint where the transaction happened.
  location: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    // Optional: We could store the resolved address later if needed.
    address: { type: String } 
  },

  // Automatically track when this was created.
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
