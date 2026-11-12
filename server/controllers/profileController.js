
const User = require('../models/User');
const Post = require('../models/Post');

// Complete a user's profile
const completeProfile = async (req, res) => {
    try {
        const {
            username,
            bio,
            location,
            website,
            profilePicture
        } = req.body || {};

        if (!username) {
            return res.status(400).json({
                message: 'Username is required'
            });
        }

        const cleanUsername = username.trim().toLowerCase();

        if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
            return res.status(400).json({
                message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
            });
        }

        const existingUser = await User.findOne({
            username: cleanUsername,
            _id: { $ne: req.user.id }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'This username is already taken'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                username: cleanUsername,
                bio: bio || '',
                location: location || '',
                website: website || '',
                profilePicture: profilePicture || '',
                profileCompleted: true
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Profile completed successfully',
            user
        });

    } catch (error) {
        console.error('Complete profile error:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'This username is already taken'
            });
        }

        return res.status(500).json({
            message: 'Unable to complete profile'
        });
    }
};


// Update an existing profile
const updateProfile = async (req, res) => {
    try {
        const {
            username,
            bio,
            location,
            website,
            profilePicture
        } = req.body || {};

        const updates = {};

        if (username !== undefined) {
            if (typeof username !== 'string') {
                return res.status(400).json({
                    message: 'Username must be a string'
                });
            }

            const cleanUsername = username.trim().toLowerCase();

            if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
                return res.status(400).json({
                    message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
                });
            }

            updates.username = cleanUsername;
        }

        if (bio !== undefined) updates.bio = bio;
        if (location !== undefined) updates.location = location;
        if (website !== undefined) updates.website = website;
        if (profilePicture !== undefined) {
            updates.profilePicture = profilePicture;
        }

        if (updates.username) {
            const existingUser = await User.findOne({
                username: updates.username,
                _id: { $ne: req.user.id }
            });

            if (existingUser) {
                return res.status(409).json({
                    message: 'This username is already taken'
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        console.error('Update profile error:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'This username is already taken'
            });
        }

        return res.status(500).json({
            message: 'Unable to update profile'
        });
    }
};


// Get a public profile and its published posts
const getPublicProfile = async (req, res) => {
    try {
        const username = req.params.username.toLowerCase();

        const user = await User.findOne({
            username,
            profileCompleted: true
        }).select(
            'name username profilePicture bio location website createdAt'
        );

        if (!user) {
            return res.status(404).json({
                message: 'Profile not found'
            });
        }

        const posts = await Post.find({
            author: user._id,
            status: 'published'
        })
            .sort({ createdAt: -1 })
            .select('title content coverImage createdAt');

        return res.status(200).json({
            user,
            posts
        });

    } catch (error) {
        console.error('Get public profile error:', error);

        return res.status(500).json({
            message: 'Unable to retrieve profile'
        });
    }
};


module.exports = {
    completeProfile,
    updateProfile,
    getPublicProfile
};
