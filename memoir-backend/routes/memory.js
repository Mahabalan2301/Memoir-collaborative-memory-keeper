// routes/memory.js
const express = require('express');
const router = express.Router();
const Memory = require('../models/memory'); // Import the Memory model

// Route to add a new memory
router.post('/memories', async (req, res) => {
  try {
    const { userEmail,title, description, date, image } = req.body;

    // Create a new memory document
    const newMemory = new Memory({
      userEmail,
      title,
      description,
      date,
      image,
    });

    // Save the memory to the database
    const savedMemory = await newMemory.save();
    res.status(201).json(savedMemory);
  } catch (error) {
    console.error('Error saving memory:', error);
    res.status(500).json({ message: 'Failed to save memory', error });
  }
});

// Route to get all memories
router.get('/memories', async (req, res) => {
  try {
    const memories = await Memory.find();
    res.status(200).json(memories);
  } catch (error) {
    console.error('Error retrieving memories:', error);
    res.status(500).json({ message: 'Failed to retrieve memories', error });
  }
});

router.get('/memories/:email', async (req, res) => {
  const userEmail = req.params.email;
  try {
    const memories = await Memory.find({ userEmail: userEmail });
    res.status(200).json(memories);
  } catch (error) {
    console.error('Error retrieving memories:', error);
    res.status(500).json({ message: 'Failed to retrieve memories', error });
  }
});


module.exports = router;
