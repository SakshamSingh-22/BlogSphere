
const mongoose = require('mongoose');

// Comment schema
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000
    }
}, {
    timestamps: true
});

// Main post schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 120
    },

    content: {
        type: String,
        required: true,
        minlength: 100,
        maxlength: 5000
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },

    coverImage: {
        type: String,
        default: ''
    },

    // Users who liked the post
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Users who disliked the post
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Comments on the post
    comments: [commentSchema]

}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
