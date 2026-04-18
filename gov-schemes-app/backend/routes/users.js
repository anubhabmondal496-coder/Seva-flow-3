const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or update user profile
router.post('/', async (req, res) => {
  try {
    const { name, age, income, education, state } = req.body;
    let user = new User({ name, age, income, education, state });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bookmark a scheme
router.post('/bookmark', async (req, res) => {
  try {
    const { userId, schemeId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (!user.bookmarkedSchemes.includes(schemeId)) {
      user.bookmarkedSchemes.push(schemeId);
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile including bookmarks
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('bookmarkedSchemes');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
