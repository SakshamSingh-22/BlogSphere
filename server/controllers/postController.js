
const mongoose = require('mongoose');
const Post = require('../models/Post');


// CREATE POST
const createPost = async (req, res, next) => {
    try {
        const { title, content, coverImage, status } = req.body;
        const author = req.user.id;

        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                message: 'Title is required'
            });
        }

        if (title.trim().length < 5 || title.trim().length > 120) {
            return res.status(400).json({
                message: 'Title must be between 5 and 120 characters'
            });
        }

        if (!content || typeof content !== 'string' || !content.trim()) {
            return res.status(400).json({
                message: 'Content is required'
            });
        }

        if (content.trim().length < 100 || content.trim().length > 5000) {
            return res.status(400).json({
                message: 'Content must be between 100 and 5000 characters'
            });
        }

        if (status !== undefined && !['draft', 'published'].includes(status)) {
            return res.status(400).json({
                message: 'Status must be draft or published'
            });
        }

        if (coverImage) {
            try {
                new URL(coverImage);
            } catch {
                return res.status(400).json({
                    message: 'Please provide a valid cover image URL'
                });
            }
        }

        const newPost = await Post.create({
            title: title.trim(),
            content: content.trim(),
            author,
            coverImage: coverImage || '',
            status: status || 'draft'
        });

        res.status(201).json({
            message: 'Blog created successfully',
            post: newPost
        });

    } catch (error) {
        next(error);
    }
};


// GET ALL POSTS
const getPosts = async (req, res, next) => {
    try {
        const status = req.query.status;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const searchFilter = {
            title: { $regex: search, $options: 'i' }
        };

        if (status === 'draft') {
            if (!req.user) {
                return res.status(401).json({
                    message: 'Please login to view your drafts'
                });
            }

            searchFilter.status = 'draft';
            searchFilter.author = req.user.id;

        } else if (status === 'published' || !status) {
            searchFilter.status = 'published';

        } else {
            return res.status(400).json({
                message: 'Invalid post status'
            });
        }

        const posts = await Post.find(searchFilter)
            .populate('author', 'name email username profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments(searchFilter);

        res.status(200).json({
            message: 'Posts fetched successfully',
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts
        });

    } catch (error) {
        next(error);
    }
};


// GET SINGLE POST
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email username profilePicture')
            .populate('comments.user', 'name username profilePicture');

        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        if (
            post.status === 'draft' &&
            (!req.user || post.author._id.toString() !== req.user.id)
        ) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        res.status(200).json({
            message: 'Post fetched successfully',
            post
        });

    } catch (error) {
        next(error);
    }
};


// UPDATE POST
const updatePost = async (req, res, next) => {
    try {
        const { title, content, coverImage, status } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'You are not authorized to update this post'
            });
        }

        if (title !== undefined) {
            if (
                typeof title !== 'string' ||
                title.trim().length < 5 ||
                title.trim().length > 120
            ) {
                return res.status(400).json({
                    message: 'Title must be between 5 and 120 characters'
                });
            }

            post.title = title.trim();
        }

        if (content !== undefined) {
            if (
                typeof content !== 'string' ||
                content.trim().length < 100 ||
                content.trim().length > 5000
            ) {
                return res.status(400).json({
                    message: 'Content must be between 100 and 5000 characters'
                });
            }

            post.content = content.trim();
        }

        if (coverImage !== undefined) {
            if (typeof coverImage !== 'string') {
                return res.status(400).json({
                    message: 'Cover image must be a URL string'
                });
            }

            if (coverImage.trim()) {
                try {
                    new URL(coverImage);
                } catch {
                    return res.status(400).json({
                        message: 'Please provide a valid cover image URL'
                    });
                }
            }

            post.coverImage = coverImage.trim();
        }

        if (status !== undefined) {
            if (!['draft', 'published'].includes(status)) {
                return res.status(400).json({
                    message: 'Status must be draft or published'
                });
            }

            post.status = status;
        }

        await post.save();

        res.status(200).json({
            message: 'Post updated successfully',
            post
        });

    } catch (error) {
        next(error);
    }
};


// DELETE POST
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'You are not authorized to delete this post'
            });
        }

        await post.deleteOne();

        res.status(200).json({
            message: 'Post deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};


// HELPER: FIND A PUBLISHED POST
const findPublishedPost = async (postId) => {
    if (!mongoose.isValidObjectId(postId)) {
        return null;
    }

    return Post.findOne({
        _id: postId,
        status: 'published'
    });
};


// TOGGLE LIKE
const toggleLike = async (req, res, next) => {
    try {
        const post = await findPublishedPost(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Published post not found'
            });
        }

        const userId = req.user.id;

        const alreadyLiked = post.likes.some(
            id => id.toString() === userId
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                id => id.toString() !== userId
            );
        } else {
            post.likes.addToSet(userId);
        }

        await post.save();

        res.status(200).json({
            message: alreadyLiked ? 'Like removed' : 'Post liked',
            liked: !alreadyLiked,
            likesCount: post.likes.length
        });

    } catch (error) {
        next(error);
    }
};


// TOGGLE DISLIKE
// TOGGLE DISLIKE
const toggleDislike = async (req, res, next) => {
    try {
        const post = await findPublishedPost(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Published post not found'
            });
        }

        const userId = req.user.id;

        const alreadyDisliked = post.dislikes.some(
            id => id.toString() === userId
        );

        if (alreadyDisliked) {
            post.dislikes = post.dislikes.filter(
                id => id.toString() !== userId
            );
        } else {
            post.dislikes.addToSet(userId);
        }

        await post.save();

        res.status(200).json({
            message: alreadyDisliked ? 'Dislike removed' : 'Post disliked',
            disliked: !alreadyDisliked,
            dislikesCount: post.dislikes.length
        });

    } catch (error) {
        next(error);
    }
};


// ADD COMMENT
const addComment = async (req, res, next) => {
    try {
        const post = await findPublishedPost(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Published post not found'
            });
        }

        const { text } = req.body || {};

        if (typeof text !== 'string' || !text.trim()) {
            return res.status(400).json({
                message: 'Comment cannot be empty'
            });
        }

        if (text.trim().length > 1000) {
            return res.status(400).json({
                message: 'Comment cannot exceed 1000 characters'
            });
        }

        post.comments.push({
            user: req.user.id,
            text: text.trim()
        });

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate('comments.user', 'name username profilePicture');

        const newComment = updatedPost.comments[
            updatedPost.comments.length - 1
        ];

        res.status(201).json({
            message: 'Comment added successfully',
            comment: newComment,
            commentsCount: updatedPost.comments.length
        });

    } catch (error) {
        next(error);
    }
};


// DELETE COMMENT
const deleteComment = async (req, res, next) => {
    try {
        const post = await findPublishedPost(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Published post not found'
            });
        }

        const comment = post.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'You can only delete your own comments'
            });
        }

        comment.deleteOne();

        await post.save();

        res.status(200).json({
            message: 'Comment deleted successfully',
            commentsCount: post.comments.length
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLike,
    toggleDislike,
    addComment,
    deleteComment
};
