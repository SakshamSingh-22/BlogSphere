
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/login');
    };

    const profileUrl = user?.username
        ? `/profile/${user.username}`
        : '/complete-profile';

    return (
        <header className="navbar-wrapper">
            <nav className="navbar">
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <span className="navbar-brand-mark">✦</span>
                    <span>BlogSphere<span className="navbar-brand-dot">.</span></span>
                </Link>

                <button
                    className="navbar-menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                >
                    <span className={menuOpen ? 'open' : ''}></span>
                    <span className={menuOpen ? 'open' : ''}></span>
                    <span className={menuOpen ? 'open' : ''}></span>
                </button>

                <div className={`navbar-menu ${menuOpen ? 'menu-open' : ''}`}>
                    <div className="navbar-main-links">
                        <NavLink to="/" end onClick={closeMenu}>
                            Home
                        </NavLink>

                        <NavLink to="/explore" onClick={closeMenu}>
                            Explore
                        </NavLink>
                    </div>

                    <div className="navbar-account-links">
                        {isAuthenticated ? (
                            <>
                                <NavLink
                                    to="/create-post"
                                    className="navbar-write-link"
                                    onClick={closeMenu}
                                >
                                    Write a Story
                                </NavLink>

                                <NavLink to="/my-posts" onClick={closeMenu}>
                                    My Posts
                                </NavLink>

                                <div className="navbar-user">
                                    <Link
                                        to={profileUrl}
                                        className="navbar-user-profile"
                                        onClick={closeMenu}
                                        aria-label="View your profile"
                                    >
                                        <span className="navbar-user-avatar">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>

                                        <span className="navbar-user-name">
                                            {user?.name || 'Writer'}
                                        </span>
                                    </Link>

                                    <Link
                                        to={profileUrl}
                                        className="navbar-view-profile"
                                        onClick={closeMenu}
                                    >
                                        View Profile
                                    </Link>
                                </div>

                                <button
                                    className="navbar-logout-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="navbar-login-link"
                                    onClick={closeMenu}
                                >
                                    Login
                                </NavLink>

                                <Link
                                    to="/register"
                                    className="navbar-register-btn"
                                    onClick={closeMenu}
                                >
                                    Get Started
                                    <span>→</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
