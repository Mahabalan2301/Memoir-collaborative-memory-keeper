// models/Memory.js
const mongoose = require('mongoose');

// Define the Memory schema
const memorySchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true, // Email of the user, required to associate memories with specific users
  },
  title: {
    type: String,
    required: true, // The title of the memory
  },
  description: {
    type: String,
    required: true, // A description of the memory
  },
  date: {
    type: Date,
    required: true, // Date associated with the memory
  },
  image: {
    type: String, // Store the image as a Base64 string if it's uploaded
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Create the Memory model
const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;
