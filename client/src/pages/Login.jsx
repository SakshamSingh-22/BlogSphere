
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                formData
            );

            // Save user and token in AuthContext
            login(
                response.data.user,
                response.data.token
            );

            // Redirect according to profile completion status
            if (response.data.user.profileCompleted) {
                navigate('/', { replace: true });
            } else {
                navigate('/complete-profile', {
                    replace: true
                });
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">

            <div className="login-page-decoration login-page-decoration-one" />
            <div className="login-page-decoration login-page-decoration-two" />

            <div className="login-shell">

                <section className="login-card">

                    <Link to="/" className="login-brand">
                        <span className="login-brand-mark">✦</span>
                        <span>
                            BlogSphere<span className="login-brand-dot">.</span>
                        </span>
                    </Link>

                    <div className="login-heading">
                        <span className="login-eyebrow">
                            WELCOME BACK
                        </span>

                        <h1>
                            Good to see
                            <span> you again.</span>
                        </h1>

                        <p className="login-subtitle">
                            Sign in to continue writing, sharing,
                            and discovering stories.
                        </p>
                    </div>

                    {error && (
                        <div className="login-error" role="alert">
                            {error}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>

                        <div className="login-form-group">
                            <label htmlFor="login-email">
                                Email address
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="login-form-group">
                            <label htmlFor="login-password">
                                Password
                            </label>

                            <input
                                id="login-password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}

                            {!loading && (
                                <span aria-hidden="true">→</span>
                            )}
                        </button>

                    </form>

                    <p className="register-link">
                        New to BlogSphere?{' '}
                        <Link to="/register">Create an account</Link>
                    </p>

                    <Link to="/explore" className="login-explore-link">
                        Or explore stories first <span>↗</span>
                    </Link>

                </section>

                <aside className="login-story-panel">
                    <div className="login-story-image" />
                    <div className="login-story-overlay" />

                    <div className="login-story-content">
                        <span className="login-story-kicker">
                            A SPACE FOR YOUR VOICE
                        </span>

                        <h2>
                            Every story begins with a single thought.
                        </h2>

                        <p>
                            Pick up where inspiration left you. Your next
                            great story is waiting to be written.
                        </p>

                        <div className="login-story-signature">
                            <span className="login-story-line" />
                            <span>The BlogSphere Journal</span>
                        </div>
                    </div>

                    <span className="login-story-caption">
                        WRITE · CREATE · SHARE
                    </span>
                </aside>

            </div>
        </main>
    );
}

export default Login;
