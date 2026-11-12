
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Home.css';

const landingImages = [
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&q=85',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=85',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1920&q=85',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=85'
];

function Home() {
    const { isAuthenticated } = useAuth();
    const [activeImage, setActiveImage] = useState(0);
    const [previousImage, setPreviousImage] = useState(0);
    const [showCurrentImage, setShowCurrentImage] = useState(true);

    useEffect(() => {
        const sections = document.querySelectorAll('[data-scroll-image]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const nextImage = Number(entry.target.dataset.scrollImage);
                    setActiveImage((currentImage) => {
                        if (currentImage === nextImage) return currentImage;
                        setPreviousImage(currentImage);
                        setShowCurrentImage(false);
                        return nextImage;
                    });
                });
            },
            {
                threshold: 0,
                rootMargin: '-35% 0px -45% 0px'
            }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (activeImage === previousImage) return;
        const frame = requestAnimationFrame(() => setShowCurrentImage(true));
        return () => cancelAnimationFrame(frame);
    }, [activeImage, previousImage]);

    return (
        <main className="landing-page">
            <div className="landing-scroll-background" aria-hidden="true">
                <div
                    className={`landing-background-image ${showCurrentImage ? 'is-hidden' : 'is-visible'}`}
                    style={{ backgroundImage: `url("${landingImages[previousImage]}")` }}
                />
                <div
                    className={`landing-background-image ${showCurrentImage ? 'is-visible' : 'is-hidden'}`}
                    style={{ backgroundImage: `url("${landingImages[activeImage]}")` }}
                />
                <div className="landing-background-overlay" />
            </div>

            {/* HERO SECTION */}
            <section className="landing-hero" data-scroll-image="0">

                <div className="hero-content">
                    <span className="hero-eyebrow">
                        YOUR WORDS. YOUR WORLD.
                    </span>

                    <h1>
                        Every great idea
                        <span> deserves a story.</span>
                    </h1>

                    <p>
                        A space to write freely, share your perspective,
                        and connect with people through the power of
                        your words.
                    </p>

                    <div className="hero-actions">
                        <Link
                            to={isAuthenticated ? '/create-post' : '/register'}
                            className="hero-primary-btn"
                        >
                            {isAuthenticated
                                ? 'Start Writing'
                                : 'Create Your Blog'}
                            <span>→</span>
                        </Link>

                        <Link
                            to="/explore"
                            className="hero-secondary-btn"
                        >
                            Explore Stories
                        </Link>
                    </div>

                    <div className="hero-note">
                        <span className="hero-note-dot"></span>
                        A home for ideas worth sharing.
                    </div>
                </div>

                {/* VISUAL BLOG PREVIEW */}
                <div className="hero-visual">

                    <div className="hero-decoration hero-decoration-one"></div>
                    <div className="hero-decoration hero-decoration-two"></div>

                    <div className="floating-label floating-label-top">
                        YOUR NEXT BIG IDEA ✦
                    </div>

                    <div className="hero-editor-card">

                        <div className="editor-topbar">
                            <div className="editor-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span>New story</span>
                            <span className="editor-save">Saved</span>
                        </div>

                        <div className="editor-content">
                            <span className="editor-category">
                                PERSONAL JOURNAL
                            </span>

                            <h3>
                                The beauty of
                                <br />
                                starting somewhere.
                            </h3>

                            <p>
                                Every journey begins with a single
                                thought. Sometimes all you need is
                                the courage to write it down...
                            </p>

                            <div className="editor-image">
                                <div className="editor-image-sun"></div>
                                <div className="editor-image-hill hill-one"></div>
                                <div className="editor-image-hill hill-two"></div>
                            </div>

                            <div className="editor-bottom">
                                <span>By You</span>
                                <span>•••</span>
                            </div>
                        </div>
                    </div>

                    <div className="floating-story-card">
                        <div className="floating-story-icon">✦</div>
                        <div>
                            <strong>Your story, your voice.</strong>
                            <span>Make something meaningful.</span>
                        </div>
                    </div>

                    <div className="floating-label floating-label-bottom">
                        WRITE · CREATE · SHARE
                    </div>

                </div>

            </section>

            {/* TRUST / INTRO STRIP */}
            <section className="landing-intro">
                <p>
                    A thoughtful space for writers, dreamers and
                    curious minds.
                </p>
                <span>WRITE SOMETHING THAT MATTERS.</span>
            </section>

            {/* FEATURES SECTION */}
            <section className="landing-features" data-scroll-image="1">

                <div className="section-heading">
                    <span className="section-eyebrow">
                        MADE FOR YOUR IDEAS
                    </span>

                    <h2>
                        Everything you need
                        <span> to tell your story.</span>
                    </h2>

                    <p>
                        Spend less time worrying about the platform
                        and more time creating something worth reading.
                    </p>
                </div>

                <div className="feature-grid">

                    <article className="feature-card feature-card-green">
                        <div className="feature-icon">✍</div>
                        <span>01 / CREATE</span>
                        <h3>A writing space of your own.</h3>
                        <p>
                            Turn your thoughts into stories with a
                            simple writing experience that keeps
                            your focus on the words.
                        </p>
                        <div className="feature-decoration feature-writing">
                            Aa
                        </div>
                    </article>

                    <article className="feature-card feature-card-cream">
                        <div className="feature-icon">◈</div>
                        <span>02 / ORGANIZE</span>
                        <h3>Your stories, always in order.</h3>
                        <p>
                            Save unfinished ideas as drafts, revisit
                            them whenever inspiration strikes, and
                            manage your published work.
                        </p>
                        <div className="feature-decoration feature-pages">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </article>

                    <article className="feature-card feature-card-peach">
                        <div className="feature-icon">↗</div>
                        <span>03 / SHARE</span>
                        <h3>Let your words travel.</h3>
                        <p>
                            Publish your stories and give readers
                            a place to discover your ideas and
                            perspectives.
                        </p>
                        <div className="feature-decoration feature-share">
                            ↗
                        </div>
                    </article>

                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="landing-how" data-scroll-image="2">

                <div className="how-visual">
                    <div className="how-paper">
                        <span>YOUR NEXT CHAPTER</span>
                        <h3>
                            It starts
                            <br />
                            with a thought.
                        </h3>
                        <div className="how-paper-line"></div>
                        <div className="how-paper-line short"></div>
                        <div className="how-paper-line"></div>
                        <div className="how-paper-line medium"></div>
                        <div className="how-paper-signature">
                            Keep writing. ✦
                        </div>
                    </div>
                    <div className="how-circle">B.</div>
                </div>

                <div className="how-content">
                    <span className="section-eyebrow">
                        YOUR CREATIVE JOURNEY
                    </span>

                    <h2>
                        From first thought
                        <span> to published story.</span>
                    </h2>

                    <div className="how-step">
                        <span>01</span>
                        <div>
                            <h3>Create your space</h3>
                            <p>
                                Join BlogSphere and make your own
                                corner of the internet.
                            </p>
                        </div>
                    </div>

                    <div className="how-step">
                        <span>02</span>
                        <div>
                            <h3>Write your story</h3>
                            <p>
                                Capture your ideas, save drafts and
                                shape your writing at your own pace.
                            </p>
                        </div>
                    </div>

                    <div className="how-step">
                        <span>03</span>
                        <div>
                            <h3>Share it with the world</h3>
                            <p>
                                Publish your work and let others
                                discover what you have to say.
                            </p>
                        </div>
                    </div>

                    <Link
                        to={isAuthenticated ? '/create-post' : '/register'}
                        className="how-cta"
                    >
                        Get started <span>→</span>
                    </Link>
                </div>

            </section>

            {/* FINAL CTA */}
            <section className="landing-cta" data-scroll-image="3">

                <div className="cta-decoration">✳</div>

                <span>YOUR STORY STARTS HERE</span>

                <h2>
                    The world is full
                    <br />
                    of stories. Add yours.
                </h2>

                <p>
                    Your ideas deserve a place to grow.
                    Make BlogSphere that place.
                </p>

                <div className="cta-actions">
                    <Link
                        to={isAuthenticated ? '/create-post' : '/register'}
                        className="cta-primary-btn"
                    >
                        {isAuthenticated
                            ? 'Write Your Next Story'
                            : 'Create Your Account'}
                        <span>→</span>
                    </Link>

                    <Link to="/explore" className="cta-explore-link">
                        Or explore stories
                    </Link>
                </div>

            </section>

            {/* FOOTER */}
            <footer className="landing-footer">

                <div className="footer-brand">
                    <Link to="/">BlogSphere<span>.</span></Link>
                    <p>
                        A home for ideas worth sharing.
                    </p>
                </div>

                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/explore">Explore</Link>
                    <Link to="/register">Get Started</Link>
                    <Link to="/login">Login</Link>
                </div>

                <p className="footer-copyright">
                    © {new Date().getFullYear()} BlogSphere.
                    Made for storytellers.
                </p>

            </footer>

        </main>
    );
}

export default Home;
