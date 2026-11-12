import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import './SinglePost.css';

const API_URL = 'http://localhost:5000/api/posts';

function SinglePost() {
    const { id } = useParams();
    const { token, user } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [commentText, setCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [reactionLoading, setReactionLoading] = useState(false);
    const [commentError, setCommentError] = useState('');

    const currentUserId = user?._id || user?.id;

    const config = token
        ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        : {};

    // Fetch the post
    const fetchPost = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.get(
                `${API_URL}/${id}`,
                config
            );

            setPost(response.data.post || response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load this blog post.'
            );
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    // Format publication date
    const formatDate = (date) => {
        if (!date) return '';

        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Check whether the current user has liked or disliked
    const hasLiked = (post?.likes || []).some(
        (like) => (like._id || like).toString() === currentUserId?.toString()
    );

    const hasDisliked = (post?.dislikes || []).some(
        (dislike) => (dislike._id || dislike).toString() === currentUserId?.toString()
    );

    // Like a post
    const handleLike = async () => {
        if (!token) {
            setCommentError('Please log in to like this post.');
            return;
        }

        try {
            setReactionLoading(true);
            setCommentError('');

            await axios.post(
                `${API_URL}/${id}/like`,
                {},
                config
            );

            await fetchPost();
        } catch (err) {
            setCommentError(
                err.response?.data?.message || 'Unable to update your like.'
            );
        } finally {
            setReactionLoading(false);
        }
    };

    // Dislike a post
    const handleDislike = async () => {
        if (!token) {
            setCommentError('Please log in to dislike this post.');
            return;
        }

        try {
            setReactionLoading(true);
            setCommentError('');

            await axios.post(
                `${API_URL}/${id}/dislike`,
                {},
                config
            );

            await fetchPost();
        } catch (err) {
            setCommentError(
                err.response?.data?.message || 'Unable to update your dislike.'
            );
        } finally {
            setReactionLoading(false);
        }
    };

    // Add a comment
    const handleAddComment = async (event) => {
        event.preventDefault();

        if (!token) {
            setCommentError('Please log in to write a comment.');
            return;
        }

        const trimmedComment = commentText.trim();

        if (!trimmedComment) {
            setCommentError('Please write something before submitting.');
            return;
        }

        try {
            setCommentLoading(true);
            setCommentError('');

            await axios.post(
                `${API_URL}/${id}/comments`,
                { text: trimmedComment },
                config
            );

            setCommentText('');
            await fetchPost();
        } catch (err) {
            setCommentError(
                err.response?.data?.message || 'Unable to add your comment.'
            );
        } finally {
            setCommentLoading(false);
        }
    };

    // Delete a comment
    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this comment?'
        );

        if (!confirmed) return;

        try {
            setCommentError('');

            await axios.delete(
                `${API_URL}/${id}/comments/${commentId}`,
                config
            );

            await fetchPost();
        } catch (err) {
            setCommentError(
                err.response?.data?.message || 'Unable to delete this comment.'
            );
        }
    };

    // Loading state
    if (loading) {
        return (
            <main className="single-post-container">
                <p className="single-post-message">
                    Loading article...
                </p>
            </main>
        );
    }

    // Error state
    if (error || !post) {
        return (
            <main className="single-post-container">
                <div className="single-post-error">
                    <h2>Article unavailable</h2>

                    <p>
                        {error || 'This post could not be found.'}
                    </p>

                    <Link to="/" className="back-home-link">
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    // Author information
    const authorName =
        typeof post.author === 'object'
            ? post.author?.name
            : 'BlogSphere Author';

    const authorId =
        typeof post.author === 'object'
            ? post.author?._id
            : post.author;

    // Draft and ownership checks
    const isDraft = post.status === 'draft';

    const isOwner =
        Boolean(currentUserId) &&
        Boolean(authorId) &&
        currentUserId.toString() === authorId.toString();

    const comments = post.comments || [];
    const likesCount = (post.likes || []).length;
    const dislikesCount = (post.dislikes || []).length;

    return (
        <main className="single-post-container">
            <article className="single-post-card">

                <Link to="/" className="back-home-link">
                    ← Back to Stories
                </Link>

                {/* Draft status and edit button */}
                {isDraft && (
                    <div className="single-post-actions">
                        <span className="single-post-draft-label">
                            Draft
                        </span>

                        {isOwner && (
                            <Link
                                to={`/posts/${post._id}/edit`}
                                className="edit-draft-btn"
                            >
                                Edit Draft
                            </Link>
                        )}
                    </div>
                )}

                {/* Article header */}
                <header className="single-post-header">
                    <h1 className="single-post-title">
                        {post.title}
                    </h1>

                    <div className="single-post-meta">
                        <span>
                            By{' '}
                            {typeof post.author === 'object' && post.author?.username ? (
                                <Link
                                    to={`/profile/${post.author.username}`}
                                    className="single-post-author-link"
                                >
                                    {authorName}
                                </Link>
                            ) : (
                                authorName
                            )}
                        </span>

                        <span className="meta-separator">·</span>

                        <time dateTime={post.createdAt}>
                            {formatDate(post.createdAt)}
                        </time>
                    </div>
                </header>

                {/* Cover image */}
                {post.coverImage && (
                    <div className="single-post-image-wrapper">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="single-post-image"
                        />
                    </div>
                )}

                {/* Full article content */}
                <div className="single-post-content">
                    {post.content}
                </div>

                {/* Reactions */}
                {!isDraft && (
                    <section className="single-post-reactions">
                        <h3>What did you think?</h3>

                        <div className="reaction-buttons">
                            <button
                                type="button"
                                className={`reaction-btn ${hasLiked ? 'reaction-active' : ''}`}
                                onClick={handleLike}
                                disabled={reactionLoading}
                            >
                                <span aria-hidden="true">👍</span>
                                <span>Like</span>
                                <span className="reaction-count">
                                    {likesCount}
                                </span>
                            </button>

                            <button
                                type="button"
                                className={`reaction-btn ${hasDisliked ? 'reaction-active' : ''}`}
                                onClick={handleDislike}
                                disabled={reactionLoading}
                            >
                                <span aria-hidden="true">👎</span>
                                <span>Dislike</span>
                                <span className="reaction-count">
                                    {dislikesCount}
                                </span>
                            </button>
                        </div>

                        {!token && (
                            <p className="reaction-login-note">
                                <Link to="/login">Log in</Link> to react to this post.
                            </p>
                        )}
                    </section>
                )}

                {/* Comments */}
                {!isDraft && (
                    <section className="single-post-comments">
                        <h2>Comments ({comments.length})</h2>

                        {token ? (
                            <form
                                className="comment-form"
                                onSubmit={handleAddComment}
                            >
                                <textarea
                                    value={commentText}
                                    onChange={(event) => setCommentText(event.target.value)}
                                    placeholder="Share your thoughts..."
                                    maxLength={1000}
                                    rows={4}
                                />

                                <div className="comment-form-footer">
                                    <span>
                                        {commentText.length}/1000
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={commentLoading || !commentText.trim()}
                                    >
                                        {commentLoading ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="comment-login-note">
                                <Link to="/login">Log in</Link> to join the conversation.
                            </p>
                        )}

                        {commentError && (
                            <p className="comment-error">
                                {commentError}
                            </p>
                        )}

                        <div className="comments-list">
                            {comments.length === 0 ? (
                                <p className="no-comments">
                                    No comments yet. Be the first to share your thoughts.
                                </p>
                            ) : (
                                comments.map((comment) => {
                                    const commentUser =
                                        typeof comment.user === 'object'
                                            ? comment.user
                                            : null;

                                    const commentUserId =
                                        commentUser?._id || comment.user;

                                    const isCommentOwner =
                                        Boolean(currentUserId) &&
                                        Boolean(commentUserId) &&
                                        currentUserId.toString() === commentUserId.toString();

                                    return (
                                        <div
                                            className="single-comment"
                                            key={comment._id}
                                        >
                                            <div className="comment-header">
                                                <div className="comment-author">
                                                    {commentUser?.username ? (
                                                        <Link to={`/profile/${commentUser.username}`}>
                                                            {commentUser.name || commentUser.username}
                                                        </Link>
                                                    ) : (
                                                        <span>
                                                            {commentUser?.name || 'BlogSphere User'}
                                                        </span>
                                                    )}

                                                    <time>
                                                        {formatDate(comment.createdAt)}
                                                    </time>
                                                </div>

                                                {isCommentOwner && (
                                                    <button
                                                        type="button"
                                                        className="delete-comment-btn"
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>

                                            <p className="comment-text">
                                                {comment.text}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                )}

                {/* Article footer */}
                <footer className="single-post-footer">
                    <p>
                        Thank you for reading BlogSphere.
                    </p>

                    <Link to="/" className="back-home-link">
                        Explore more stories →
                    </Link>
                </footer>

            </article>
        </main>
    );
}

export default SinglePost;