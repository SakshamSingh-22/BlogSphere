
const express = require('express');

const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLike,
    toggleDislike,
    addComment,
    deleteComment
} = require('../controllers/postController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET ALL POSTS
router.get('/', (req, res, next) => {
    if (req.query.status === 'draft') {
        return authMiddleware(req, res, next);
    }

    next();
}, getPosts);

// LIKE A POST
router.post('/:id/like', authMiddleware, toggleLike);

// DISLIKE A POST
router.post('/:id/dislike', authMiddleware, toggleDislike);

// ADD A COMMENT
router.post('/:id/comments', authMiddleware, addComment);

// DELETE A COMMENT
router.delete('/:id/comments/:commentId', authMiddleware, deleteComment);

// GET SINGLE POST
router.get('/:id', (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authMiddleware(req, res, next);
    }

    next();
}, getPostById);

// CREATE POST
router.post('/', authMiddleware, createPost);

// UPDATE POST
router.put('/:id', authMiddleware, updatePost);

// DELETE POST
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
