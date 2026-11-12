
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic account details
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    // Public profile details
    username: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },

    profilePicture: {
        type: String,
        default: ''
    },

    bio: {
        type: String,
        maxlength: 300,
        default: ''
    },

    location: {
        type: String,
        maxlength: 100,
        default: ''
    },

    website: {
        type: String,
        maxlength: 200,
        default: ''
    },

    // Tracks whether onboarding is complete
    profileCompleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
