
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Explore.css';

const API_URL = 'http://localhost:5000/api/posts';

function Explore() {
    const { token, isAuthenticated } = useAuth();

    const [posts, setPosts] = useState([]);
    const [drafts, setDrafts] = useState([]);

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [draftsLoading, setDraftsLoading] = useState(false);
    const [error, setError] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 350);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch published posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await axios.get(API_URL, {
                    params: {
                        page,
                        limit: 6,
                        search,
                        status: 'published'
                    }
                });

                setPosts(response.data.posts || []);
                setTotalPages(response.data.totalPages || 1);

            } catch (err) {
                console.error('Published Posts Error:', err);
                setError(
                    err.response?.data?.message ||
                    'Unable to load stories. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page, search]);

    // Fetch current user's drafts
    useEffect(() => {
        const fetchDrafts = async () => {
            if (!isAuthenticated || !token) {
                setDrafts([]);
                return;
            }

            try {
                setDraftsLoading(true);

                const response = await axios.get(API_URL, {
                    params: {
                        status: 'draft',
                        limit: 100
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setDrafts(response.data.posts || []);

            } catch (err) {
                console.error('Drafts Error:', err);
                setDrafts([]);
            } finally {
                setDraftsLoading(false);
            }
        };

        fetchDrafts();
    }, [token, isAuthenticated]);

    const formatDate = (date) => {
        if (!date) return '';

        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getExcerpt = (content, length = 150) => {
        if (!content) return '';

        return content.length > length
            ? content.slice(0, length).trim() + '...'
            : content;
    };

    const getInitials = (name) => {
        if (!name) return 'BS';

        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    };

    const clearSearch = () => {
        setSearchInput('');
        setSearch('');
        setPage(1);
    };

    const featuredPost =
        posts.length > 0 && page === 1 && !search
            ? posts[0]
            : null;

    const regularPosts = featuredPost
        ? posts.slice(1)
        : posts;

    return (
        <main className="explore-page">

            {/* EXPLORE HEADER */}

            <section className="explore-hero">
                <div className="explore-hero-inner">

                    <div className="explore-brand-intro">
                        <span className="brand-mark">✦</span>
                        <span className="explore-eyebrow">THE BLOGSPHERE JOURNAL</span>
                    </div>

                    <h1>
                        Ideas worth
                        <span> exploring.</span>
                    </h1>

                    <p>
                        Discover perspectives, personal experiences
                        and thoughtful stories from our community.
                    </p>

                    <a href="#explore-stories" className="explore-scroll">
                        Discover stories <span>↓</span>
                    </a>

                </div>
            </section>

            <div className="explore-container">

                {/* PERSONAL DRAFTS */}
                {isAuthenticated && (
                    <section className="explore-drafts">

                        <div className="explore-section-label">
                            <span>YOUR WORKSPACE</span>
                            <span>{drafts.length} SAVED</span>
                        </div>

                        <div className="explore-section-heading">
                            <div>
                                <h2>
                                    Your <em>drafts.</em>
                                </h2>
                                <p>
                                    Pick up where your ideas left off.
                                </p>
                            </div>

                            <Link
                                to="/create-post"
                                className="explore-create-link"
                            >
                                + Write a story
                            </Link>
                        </div>

                        {draftsLoading && (
                            <p className="explore-message">
                                Loading your drafts...
                            </p>
                        )}

                        {!draftsLoading && drafts.length === 0 && (
                            <div className="explore-empty-drafts">
                                <div className="empty-draft-symbol">✎</div>
                                <div>
                                    <h3>No drafts yet</h3>
                                    <p>
                                        Start writing and save your ideas
                                        for another day.
                                    </p>
                                </div>
                                <Link to="/create-post">
                                    Start writing →
                                </Link>
                            </div>
                        )}

                        {!draftsLoading && drafts.length > 0 && (
                            <div className="explore-draft-grid">
                                {drafts.slice(0, 3).map((post) => (
                                    <article
                                        className="explore-draft-card"
                                        key={post._id}
                                    >
                                        <div className="explore-draft-meta">
                                            <span>● DRAFT</span>
                                            <time>
                                                {formatDate(
                                                    post.updatedAt || post.createdAt
                                                )}
                                            </time>
                                        </div>

                                        <h3>{post.title}</h3>

                                        <p>
                                            {getExcerpt(post.content, 100)}
                                        </p>

                                        <Link to={`/posts/${post._id}`}>
                                            Continue writing →
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        )}

                        {drafts.length > 3 && !draftsLoading && (
                            <Link
                                to="/my-posts"
                                className="explore-all-drafts"
                            >
                                View all {drafts.length} drafts →
                            </Link>
                        )}

                    </section>
                )}

                {/* STORIES */}
                <section
                    className="explore-stories"
                    id="explore-stories"
                >

                    <div className="explore-section-label">
                        <span>FRESH FROM THE COMMUNITY</span>
                        <span>READ SOMETHING NEW</span>
                    </div>

                    <div className="explore-section-heading">
                        <div>
                            <h2>
                                Latest <em>stories.</em>
                            </h2>
                            <p>
                                Find something interesting. Leave with
                                a new perspective.
                            </p>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <div className="explore-search">
                        <span>⌕</span>

                        <input
                            type="search"
                            placeholder="Search stories by title..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />

                        {searchInput && (
                            <button onClick={clearSearch}>
                                Clear
                            </button>
                        )}
                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="explore-message">
                            Finding stories for you...
                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="explore-error">
                            <p>{error}</p>
                            <button onClick={() => setPage(page)}>
                                Try again
                            </button>
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading && !error && posts.length === 0 && (
                        <div className="explore-empty">
                            <span>✧</span>
                            <h3>No stories found.</h3>
                            <p>
                                Try a different search or explore again later.
                            </p>

                            {search && (
                                <button onClick={clearSearch}>
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}

                    {/* FEATURED STORY */}
                    {!loading && !error && featuredPost && (
                        <article className="explore-featured">

                            <Link
                                to={`/posts/${featuredPost._id}`}
                                className="explore-featured-image"
                            >
                                {featuredPost.coverImage ? (
                                    <img
                                        src={featuredPost.coverImage}
                                        alt={featuredPost.title}
                                    />
                                ) : (
                                    <div className="explore-image-placeholder">
                                        <span>BlogSphere</span>
                                    </div>
                                )}

                                <span className="featured-image-label">
                                    EDITOR'S PICK
                                </span>
                            </Link>

                            <div className="explore-featured-content">

                                <span className="explore-category">
                                    COMMUNITY STORY
                                </span>

                                <h2>
                                    <Link to={`/posts/${featuredPost._id}`}>
                                        {featuredPost.title}
                                    </Link>
                                </h2>

                                <p>
                                    {getExcerpt(featuredPost.content, 220)}
                                </p>


                                <div className="explore-author">
                                    <Link
                                        to={featuredPost.author?.username
                                            ? `/profile/${featuredPost.author.username}`
                                            : '#'}
                                        className="explore-author-profile"
                                        onClick={(e) => {
                                            if (!featuredPost.author?.username) e.preventDefault();
                                        }}
                                    >
                                        <div className="explore-avatar">
                                            {getInitials(featuredPost.author?.name)}
                                        </div>

                                        <strong>
                                            {featuredPost.author?.name || 'Anonymous'}
                                        </strong>
                                    </Link>

                                    <span>
                                        {formatDate(featuredPost.createdAt)}
                                    </span>
                                </div>


                                <Link
                                    to={`/posts/${featuredPost._id}`}
                                    className="explore-read-link"
                                >
                                    Read full story <span>↗</span>
                                </Link>

                            </div>
                        </article>
                    )}

                    {/* REGULAR STORY GRID */}
                    {!loading && !error && regularPosts.length > 0 && (
                        <>
                            <div className="explore-grid-heading">
                                <h3>
                                    {featuredPost
                                        ? 'More stories'
                                        : 'Stories from our community'}
                                </h3>
                                <span>
                                    {posts.length} STORIES
                                </span>
                            </div>

                            <div className="explore-story-grid">

                                {regularPosts.map((post) => (
                                    <article
                                        className="explore-story-card"
                                        key={post._id}
                                    >

                                        <Link
                                            to={`/posts/${post._id}`}
                                            className="explore-story-image"
                                        >
                                            {post.coverImage ? (
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="explore-image-placeholder">
                                                    <span>BlogSphere</span>
                                                </div>
                                            )}
                                        </Link>

                                        <div className="explore-story-content">

                                            <span className="explore-category">
                                                COMMUNITY STORY
                                            </span>

                                            <h3>
                                                <Link to={`/posts/${post._id}`}>
                                                    {post.title}
                                                </Link>
                                            </h3>

                                            <p>
                                                {getExcerpt(post.content, 145)}
                                            </p>


                                            <div className="explore-author">
                                                <Link
                                                    to={post.author?.username
                                                        ? `/profile/${post.author.username}`
                                                        : '#'}
                                                    className="explore-author-profile"
                                                    onClick={(e) => {
                                                        if (!post.author?.username) e.preventDefault();
                                                    }}
                                                >
                                                    <div className="explore-avatar">
                                                        {getInitials(post.author?.name)}
                                                    </div>

                                                    <strong>
                                                        {post.author?.name || 'Anonymous'}
                                                    </strong>
                                                </Link>

                                                <span>
                                                    {formatDate(post.createdAt)}
                                                </span>
                                            </div>

                                        </div>
                                    </article>
                                ))}

                            </div>
                        </>
                    )}

                    {/* PAGINATION */}
                    {!loading && !error && totalPages > 1 && (
                        <div className="explore-pagination">

                            <button
                                disabled={page === 1}
                                onClick={() => {
                                    setPage((previous) => previous - 1);
                                    document.getElementById('explore-stories')
                                        ?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                ← Previous
                            </button>

                            <span>
                                {page} <i>/</i> {totalPages}
                            </span>

                            <button
                                disabled={page === totalPages}
                                onClick={() => {
                                    setPage((previous) => previous + 1);
                                    document.getElementById('explore-stories')
                                        ?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Next →
                            </button>

                        </div>
                    )}

                </section>

                {/* FOOTER */}
                <footer className="explore-footer">
                    <Link to="/" className="explore-footer-logo">
                        <span className="brand-mark">✦</span>
                        <span>BlogSphere<span className="brand-dot">.</span></span>
                    </Link>

                    <p>A home for stories worth telling.</p>

                    <span>
                        © {new Date().getFullYear()} BLOGSPHERE
                    </span>
                </footer>

            </div>
        </main>
    );
}

export default Explore;
