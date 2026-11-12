
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Register.css';

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData((current) => ({
            ...current,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await axios.post(
                'http://localhost:5000/api/auth/register',
                formData
            );

            // Automatically log in the newly registered user
            login(
                response.data.user,
                response.data.token
            );

            setSuccess('Account created! Setting up your profile...');

            // Redirect directly to profile completion
            navigate('/complete-profile', {
                replace: true
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">

            <div className="register-decoration register-decoration-one" />
            <div className="register-decoration register-decoration-two" />

            <div className="register-shell">

                <section className="register-card">

                    <Link to="/" className="register-brand">
                        <span className="register-brand-mark">✦</span>
                        <span>
                            BlogSphere<span className="register-brand-dot">.</span>
                        </span>
                    </Link>

                    <div className="register-heading">
                        <span className="register-eyebrow">
                            YOUR STORY STARTS HERE
                        </span>

                        <h1>
                            Create your
                            <span> own space.</span>
                        </h1>

                        <p className="register-subtitle">
                            Join a community of thinkers, creators and
                            storytellers. Your next chapter starts here.
                        </p>
                    </div>

                    {error && (
                        <div className="register-error" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="register-success" role="status">
                            {success}
                        </div>
                    )}

                    <form className="register-form" onSubmit={handleSubmit}>

                        <div className="register-form-group">
                            <label htmlFor="register-name">
                                Full name
                            </label>

                            <input
                                id="register-name"
                                type="text"
                                name="name"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={handleChange}
                                minLength={2}
                                maxLength={50}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="register-email">
                                Email address
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="register-password">
                                Password
                            </label>

                            <input
                                id="register-password"
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                autoComplete="new-password"
                                required
                            />

                            <small className="register-password-hint">
                                Use at least 8 characters.
                            </small>
                        </div>

                        <button
                            type="submit"
                            className="register-submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Create account'}

                            {!loading && (
                                <span aria-hidden="true">→</span>
                            )}
                        </button>

                    </form>

                    <p className="register-login-link">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
                    </p>

                    <Link to="/explore" className="register-explore-link">
                        Or explore stories first <span>↗</span>
                    </Link>

                </section>

                <aside className="register-story-panel">
                    <div className="register-story-image" />
                    <div className="register-story-overlay" />

                    <div className="register-story-content">
                        <span className="register-story-kicker">
                            FIND YOUR VOICE
                        </span>

                        <h2>
                            Your perspective could inspire someone.
                        </h2>

                        <p>
                            Share your ideas, discover new perspectives
                            and become part of a community that loves stories.
                        </p>

                        <div className="register-story-signature">
                            <span className="register-story-line" />
                            <span>The BlogSphere Journal</span>
                        </div>
                    </div>

                    <span className="register-story-caption">
                        WRITE · CREATE · SHARE
                    </span>
                </aside>

            </div>
        </main>
    );
}

export default Register;
