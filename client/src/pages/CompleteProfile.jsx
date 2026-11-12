
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './CompleteProfile.css';

function CompleteProfile() {
    const navigate = useNavigate();
    const { token, login, user } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        location: '',
        website: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');

            const response = await axios.post(
                'http://localhost:5000/api/profiles/complete',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update the logged-in user with the completed profile
            login(response.data.user, token);

            navigate(`/profile/${response.data.user.username}`);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to save your profile. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="complete-profile-page">
            <div className="complete-profile-card">

                <div className="complete-profile-avatar">
                    <span className="complete-profile-avatar-icon">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                        </svg>
                    </span>
                </div>

                <span className="complete-profile-eyebrow">
                    ONE LAST THING
                </span>

                <h1>Make yourself at home.</h1>

                <p className="complete-profile-description">
                    Hi {user?.name || 'there'}! Tell the BlogSphere
                    community a little about yourself.
                </p>

                {error && (
                    <div className="complete-profile-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="complete-profile-field">
                        <label htmlFor="username">Username *</label>
                        <div className="complete-profile-username">
                            <span>@</span>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="yourusername"
                                value={formData.username}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={20}
                                pattern="[a-zA-Z0-9_]{3,20}"
                                title="Use 3-20 letters, numbers or underscores"
                                required
                            />
                        </div>
                        <small>
                            3-20 characters. Letters, numbers and underscores only.
                        </small>
                    </div>

                    <div className="complete-profile-field">
                        <label htmlFor="bio">About you</label>
                        <textarea
                            id="bio"
                            name="bio"
                            placeholder="Tell us what you love writing about..."
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength={300}
                            rows={4}
                        />
                        <small>
                            {formData.bio.length}/300 characters
                        </small>
                    </div>

                    <div className="complete-profile-field">
                        <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            type="text"
                            name="location"
                            placeholder="e.g. Bengaluru, India"
                            value={formData.location}
                            onChange={handleChange}
                            maxLength={100}
                        />
                    </div>

                    <div className="complete-profile-field">
                        <label htmlFor="website">Website</label>
                        <input
                            id="website"
                            type="url"
                            name="website"
                            placeholder="https://yourwebsite.com"
                            value={formData.website}
                            onChange={handleChange}
                            maxLength={200}
                        />
                    </div>

                    <button
                        type="submit"
                        className="complete-profile-submit"
                        disabled={loading}
                    >
                        {loading ? 'Saving profile...' : 'Complete my profile'}
                        {!loading && <span>→</span>}
                    </button>

                </form>

                <p className="complete-profile-footer">
                    Your story starts here. Make it yours.
                </p>

            </div>
        </main>
    );
}

export default CompleteProfile;
