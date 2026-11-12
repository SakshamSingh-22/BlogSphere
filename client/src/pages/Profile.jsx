import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

function Profile() {
    const { username } = useParams();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    `http://localhost:5000/api/profiles/${username}`
                );

                setProfile(response.data.user);
                setPosts(response.data.posts);
                setError('');
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load profile'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) return <div className="profile-message">Loading profile...</div>;

    if (error) return <div className="profile-message">{error}</div>;

    return (
        <div className="profile-page">
            <section className="profile-header">
                <div className="profile-avatar">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path
                            d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <div className="profile-details">
                    <h1>{profile.name}</h1>
                    <p className="profile-username">@{profile.username}</p>

                    {profile.bio && <p className="profile-bio">{profile.bio}</p>}

                    {profile.location && (
                        <p className="profile-meta">📍 {profile.location}</p>
                    )}

                    {profile.website && (
                        <a
                            href={profile.website}
                            target="_blank"
                            rel="noreferrer"
                            className="profile-website"
                        >
                            {profile.website}
                        </a>
                    )}

                    <p className="profile-post-count">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                    </p>
                </div>
            </section>

            <section className="profile-posts">
                <h2>Published Stories</h2>

                {posts.length === 0 ? (
                    <p className="profile-empty">
                        No published stories yet.
                    </p>
                ) : (
                    <div className="profile-post-grid">
                        {posts.map((post) => (
                            <article className="profile-post-card" key={post._id}>
                                {post.coverImage && (
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                    />
                                )}

                                <div className="profile-post-content">
                                    <h3>{post.title}</h3>
                                    <p>
                                        {post.content?.slice(0, 150)}
                                        {post.content?.length > 150 ? '...' : ''}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Profile;