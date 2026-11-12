
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import './CreatePost.css';

const API_URL = 'http://localhost:5000/api/posts';

function CreatePost() {
    const { id } = useParams();
    const isEditing = Boolean(id);

    const { token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        coverImage: '',
        status: 'draft'
    });

    const [loading, setLoading] = useState(false);
    const [fetchingPost, setFetchingPost] = useState(isEditing);
    const [error, setError] = useState('');

    // Load existing post when editing
    useEffect(() => {
        if (!isEditing) return;

        const fetchPost = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const post = response.data.post || response.data;

                setFormData({
                    title: post.title || '',
                    content: post.content || '',
                    coverImage: post.coverImage || '',
                    status: post.status || 'draft'
                });

            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load this post.'
                );
            } finally {
                setFetchingPost(false);
            }
        };

        if (token) {
            fetchPost();
        } else {
            setError('Please log in to edit this post.');
            setFetchingPost(false);
        }
    }, [id, token, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (isEditing) {
                await axios.put(
                    `${API_URL}/${id}`,
                    formData,
                    config
                );

                navigate(`/posts/${id}`);
            } else {
                const response = await axios.post(
                    API_URL,
                    formData,
                    config
                );

                const newPost = response.data.post || response.data;

                navigate(`/posts/${newPost._id}`);
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (fetchingPost) {
        return <div className="create-post-container">Loading post...</div>;
    }

    return (
        <div className="create-post-container">
            <div className="create-post-card">

                <h1>
                    {isEditing ? 'Edit Your Story' : 'Create a Story'}
                </h1>

                <p className="create-post-subtitle">
                    {isEditing
                        ? 'Make changes to your existing story.'
                        : 'Share your thoughts with the BlogSphere community.'}
                </p>

                {error && (
                    <p className="create-post-error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="title">Title</label>

                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Enter your blog title"
                            value={formData.title}
                            onChange={handleChange}
                            minLength={5}
                            maxLength={120}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="coverImage">
                            Cover Image URL
                        </label>

                        <input
                            id="coverImage"
                            type="url"
                            name="coverImage"
                            placeholder="https://example.com/image.jpg"
                            value={formData.coverImage}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Your Story</label>

                        <textarea
                            id="content"
                            name="content"
                            placeholder="Start writing your story..."
                            value={formData.content}
                            onChange={handleChange}
                            minLength={100}
                            maxLength={5000}
                            rows={12}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Post Status</label>

                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="draft">Save as Draft</option>
                            <option value="published">Publish</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="create-post-btn"
                    >
                        {loading
                            ? 'Saving...'
                            : isEditing
                                ? 'Save Changes'
                                : 'Create Post'}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CreatePost;
