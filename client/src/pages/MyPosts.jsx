
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import './MyPosts.css';

const API_URL = 'http://localhost:5000/api/posts';

function MyPosts() {
    const { token } = useAuth();

    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch published posts and drafts
    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            setError('');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const [publishedResponse, draftResponse] =
                await Promise.all([
                    axios.get(
                        `${API_URL}?status=published&limit=100`,
                        config
                    ),
                    axios.get(
                        `${API_URL}?status=draft&limit=100`,
                        config
                    )
                ]);

            const publishedPosts =
                publishedResponse.data.posts || [];

            const draftPosts =
                draftResponse.data.posts || [];

            const combinedPosts = [
                ...publishedPosts,
                ...draftPosts
            ].sort(
                (a, b) =>
                    new Date(b.updatedAt || b.createdAt) -
                    new Date(a.updatedAt || a.createdAt)
            );

            setPosts(combinedPosts);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load your posts.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMyPosts();
        } else {
            setError('Please log in to view your posts.');
            setLoading(false);
        }
    }, [token]);

    // Delete a post
    const handleDelete = async (postId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this post? This action cannot be undone.'
        );

        if (!confirmed) return;

        try {
            await axios.delete(
                `${API_URL}/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPosts((previousPosts) =>
                previousPosts.filter(
                    (post) => post._id !== postId
                )
            );

        } catch (err) {
            alert(
                err.response?.data?.message ||
                'Unable to delete this post.'
            );
        }
    };

    // Filter posts by selected tab
    const filteredPosts = posts.filter((post) => {
        if (activeTab === 'published') {
            return post.status === 'published';
        }

        if (activeTab === 'draft') {
            return post.status === 'draft';
        }

        return true;
    });

    const publishedCount = posts.filter(
        (post) => post.status === 'published'
    ).length;

    const draftCount = posts.filter(
        (post) => post.status === 'draft'
    ).length;

    const formatDate = (date) => {
        if (!date) return '';

        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <main className="my-posts-container">
                <p className="my-posts-message">
                    Loading your posts...
                </p>
            </main>
        );
    }

    return (
        <main className="my-posts-container">

            <header className="my-posts-header">
                <div>
                    <p className="my-posts-eyebrow">
                        YOUR WORKSPACE
                    </p>

                    <h1>My Posts</h1>

                    <p>
                        Manage your stories, drafts and publications.
                    </p>
                </div>

                <Link
                    to="/create-post"
                    className="my-posts-create-btn"
                >
                    + Write a Story
                </Link>
            </header>

            {error && (
                <div className="my-posts-error">
                    {error}
                </div>
            )}

            {!error && (
                <>
                    {/* Post statistics */}
                    <section className="my-posts-stats">

                        <div className="my-posts-stat-card">
                            <span>Total Posts</span>
                            <strong>{posts.length}</strong>
                        </div>

                        <div className="my-posts-stat-card">
                            <span>Published</span>
                            <strong>{publishedCount}</strong>
                        </div>

                        <div className="my-posts-stat-card">
                            <span>Drafts</span>
                            <strong>{draftCount}</strong>
                        </div>

                    </section>

                    {/* Filter tabs */}
                    <nav className="my-posts-tabs">

                        <button
                            className={activeTab === 'all' ? 'active' : ''}
                            onClick={() => setActiveTab('all')}
                        >
                            All Posts ({posts.length})
                        </button>

                        <button
                            className={activeTab === 'published' ? 'active' : ''}
                            onClick={() => setActiveTab('published')}
                        >
                            Published ({publishedCount})
                        </button>

                        <button
                            className={activeTab === 'draft' ? 'active' : ''}
                            onClick={() => setActiveTab('draft')}
                        >
                            Drafts ({draftCount})
                        </button>

                    </nav>

                    {/* Posts list */}
                    <section className="my-posts-list">

                        {filteredPosts.length === 0 ? (
                            <div className="my-posts-empty">
                                <h2>No posts found</h2>

                                <p>
                                    {activeTab === 'draft'
                                        ? 'You do not have any drafts yet.'
                                        : activeTab === 'published'
                                            ? 'You have not published any stories yet.'
                                            : 'Start writing your first story.'}
                                </p>

                                <Link
                                    to="/create-post"
                                    className="my-posts-create-btn"
                                >
                                    Create Your First Post
                                </Link>
                            </div>
                        ) : (
                            filteredPosts.map((post) => (
                                <article
                                    className="my-post-card"
                                    key={post._id}
                                >
                                    <div className="my-post-info">

                                        <span
                                            className={`my-post-status ${
                                                post.status === 'published'
                                                    ? 'published'
                                                    : 'draft'
                                            }`}
                                        >
                                            {post.status}
                                        </span>

                                        <h2>
                                            <Link
                                                to={`/posts/${post._id}`}
                                            >
                                                {post.title}
                                            </Link>
                                        </h2>

                                        <p className="my-post-date">
                                            Last updated: {
                                                formatDate(
                                                    post.updatedAt || post.createdAt
                                                )
                                            }
                                        </p>

                                    </div>

                                    <div className="my-post-actions">

                                        <Link
                                            to={`/posts/${post._id}`}
                                            className="my-post-view-btn"
                                        >
                                            View
                                        </Link>

                                        <Link
                                            to={`/posts/${post._id}/edit`}
                                            className="my-post-edit-btn"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="my-post-delete-btn"
                                            onClick={() =>
                                                handleDelete(post._id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </article>
                            ))
                        )}

                    </section>
                </>
            )}

        </main>
    );
}

export default MyPosts;
