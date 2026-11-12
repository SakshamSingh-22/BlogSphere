
const express = require('express');

const {
    completeProfile,
    updateProfile,
    getPublicProfile
} = require('../controllers/profileController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Complete your profile (login required)
router.post('/complete', authMiddleware, completeProfile);

// Update your profile (login required)
router.put('/edit', authMiddleware, updateProfile);

// View another user's public profile (public route)
router.get('/:username', getPublicProfile);

module.exports = router;
