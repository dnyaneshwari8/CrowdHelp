import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCampaigns } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import Spinner from '../components/Spinner';
import { ChevronRight, ShieldCheck, Heart, Users, ArrowRight } from 'lucide-react';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const res = await fetchCampaigns();
                setFeatured(res.data.campaigns.slice(0, 3));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadFeatured();
    }, []);

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <header style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.badge}>Transforming Lives Together</div>
                    <h1 style={styles.heroTitle}>
                        Empower <span style={styles.gradientText}>Change</span> <br /> 
                        Through Giving
                    </h1>
                    <p style={styles.heroSub}>
                        Join a global community of compassionate donors and verified NGOs. 
                        Start your journey of making a real, measurable impact today.
                    </p>
                    <div style={styles.heroActions}>
                        <Link to="/campaigns" style={styles.primaryBtn}>
                            Explore Campaigns <ArrowRight size={20}/>
                        </Link>
                        <Link to="/register" style={styles.secondaryBtn}>
                            Join the Community
                        </Link>
                    </div>
                </div>
                <div style={styles.heroVisual}>
                    <div style={styles.blob}></div>
                </div>
            </header>

            {/* Features Section */}
            <section style={styles.features}>
                <div style={styles.featureItem}>
                    <div style={{...styles.iconWrapper, background: 'rgba(138, 180, 248, 0.1)'}}>
                        <ShieldCheck size={32} color="var(--primary)" />
                    </div>
                    <h3>Secure & Trusted</h3>
                    <p>End-to-end encrypted transactions via Razorpay with instant verification.</p>
                </div>
                <div style={styles.featureItem}>
                    <div style={{...styles.iconWrapper, background: 'rgba(244, 67, 54, 0.1)'}}>
                        <Heart size={32} color="#f44336" />
                    </div>
                    <h3>Direct Impact</h3>
                    <p>Transparent tracking ensures your contributions reach the right hands.</p>
                </div>
                <div style={styles.featureItem}>
                    <div style={{...styles.iconWrapper, background: 'rgba(76, 175, 80, 0.1)'}}>
                        <Users size={32} color="#4CAF50" />
                    </div>
                    <h3>NGO Network</h3>
                    <p>Collaborate with verified non-profits vetted for authenticity and scale.</p>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section style={styles.featuredSection}>
                <div style={styles.sectionHeader}>
                    <div>
                        <h2 style={styles.sectionTitle}>Featured Campaigns</h2>
                        <p style={styles.sectionSub}>Handpicked causes that need your immediate support.</p>
                    </div>
                    <Link to="/campaigns" style={styles.seeAll}>
                        View all <ChevronRight size={18}/>
                    </Link>
                </div>
                
                {loading ? <Spinner /> : (
                    <div style={styles.grid}>
                        {featured.map(c => <CampaignCard key={c._id} campaign={c} />)}
                    </div>
                )}
            </section>

            {/* Call to Action */}
            <section style={styles.cta}>
                <div style={styles.ctaContent}>
                    <h2 style={styles.ctaTitle}>Ready to start your first campaign?</h2>
                    <p style={styles.ctaSub}>Register as an NGO and begin your journey towards making the world a better place.</p>
                    <Link to="/apply-ngo" style={styles.ctaBtn}>Become an NGO Partner</Link>
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem'
    },
    hero: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        alignItems: 'center',
        padding: '6rem 0',
        minHeight: '80vh',
        gap: '4rem'
    },
    heroContent: {
        textAlign: 'left'
    },
    badge: {
        display: 'inline-block',
        padding: '0.5rem 1.25rem',
        borderRadius: '100px',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--primary)',
        marginBottom: '2rem'
    },
    heroTitle: {
        fontSize: '4.5rem',
        lineHeight: '1.1',
        marginBottom: '1.5rem',
        fontWeight: '800',
        color: '#fff'
    },
    gradientText: {
        background: 'var(--gradient-main)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    heroSub: {
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        marginBottom: '3rem',
        maxWidth: '600px',
        lineHeight: '1.6'
    },
    heroActions: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center'
    },
    primaryBtn: {
        backgroundColor: 'var(--primary)',
        color: '#000',
        padding: '1rem 2rem',
        borderRadius: '16px',
        fontSize: '1.1rem',
        fontWeight: '700',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'all 0.3s ease'
    },
    secondaryBtn: {
        color: 'var(--text-primary)',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        padding: '1rem 2rem',
        borderRadius: '16px',
        fontSize: '1.1rem',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'all 0.3s ease'
    },
    heroVisual: {
        position: 'relative',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    blob: {
        width: '300px',
        height: '300px',
        background: 'var(--gradient-main)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: '0.4',
        animation: 'pulse 10s infinite alternate'
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2.5rem',
        padding: '4rem 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
    },
    featureItem: {
        textAlign: 'left'
    },
    iconWrapper: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
    },
    featuredSection: {
        padding: '8rem 0'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '4rem'
    },
    sectionTitle: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem'
    },
    sectionSub: {
        color: 'var(--text-secondary)',
        fontSize: '1.1rem'
    },
    seeAll: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: '600',
        fontSize: '1rem'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem'
    },
    cta: {
        padding: '6rem',
        background: 'var(--bg-surface)',
        borderRadius: '40px',
        textAlign: 'center',
        marginBottom: '8rem',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
    },
    ctaTitle: {
        fontSize: '3rem',
        marginBottom: '1.5rem'
    },
    ctaSub: {
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        marginBottom: '3rem',
        maxWidth: '700px',
        margin: '0 auto 3rem auto'
    },
    ctaBtn: {
        backgroundColor: '#fff',
        color: '#000',
        padding: '1.2rem 3rem',
        borderRadius: '20px',
        fontSize: '1.2rem',
        fontWeight: '700',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.3s ease'
    }
};

export default Home;
