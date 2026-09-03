import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCampaigns } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import Skeleton from '../components/Skeleton';
import { 
    ChevronRight, 
    ShieldCheck, 
    Heart, 
    Users, 
    ArrowRight, 
    Star, 
    Globe, 
    Zap, 
    Award,
    BookOpen,
    Stethoscope,
    Leaf,
    HandHelping,
    PawPrint,
    Users2
} from 'lucide-react';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const res = await fetchCampaigns();
                if (res?.data?.campaigns) {
                    setFeatured(res.data.campaigns.slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to load featured campaigns:', error.message);
            } finally {
                setLoading(false);
            }
        };
        loadFeatured();
    }, []);

    const categories = [
        { name: 'Education', icon: <BookOpen size={24}/>, color: '#4285f4' },
        { name: 'Healthcare', icon: <Stethoscope size={24}/>, color: '#ea4335' },
        { name: 'Environment', icon: <Leaf size={24}/>, color: '#34a853' },
        { name: 'Disaster Relief', icon: <Zap size={24}/>, color: '#fbbc04' },
        { name: 'Animals', icon: <PawPrint size={24}/>, color: '#ff6d00' },
        { name: 'Community', icon: <Users2 size={24}/>, color: '#9c27b0' },
    ];

    const stats = [
        { label: 'Total Raised', value: '₹2.5Cr+', icon: <Star size={20}/> },
        { label: 'Happy Donors', value: '50K+', icon: <Heart size={20}/> },
        { label: 'Verified NGOs', value: '200+', icon: <ShieldCheck size={20}/> },
        { label: 'Impacted Lives', value: '1M+', icon: <Globe size={20}/> },
    ];

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.heroSection}>
                <div className="container" style={styles.heroContainer}>
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        style={styles.heroContent}
                    >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={styles.badge}>
                                <Award size={14} /> <span>Trusted by 50,000+ Donors</span>
                            </div>
                            <Link to="/login" style={styles.demoBadge}>
                                <ShieldCheck size={14} /> <span>Demo Logins Available (Admin / NGO / User)</span>
                            </Link>
                        </div>
                        <h1 style={styles.heroTitle}>
                            Small Acts, <span className="gradient-text">Big Impact</span>. <br />
                            Start Your Journey.
                        </h1>
                        <p style={styles.heroSub}>
                            CrowdHelp connects you with verified NGOs and meaningful causes. 
                            Transparency, trust, and real impact in every contribution.
                        </p>
                        <div style={styles.heroActions}>
                            <Link to="/campaigns" className="btn btn-primary" style={styles.ctaBtn}>
                                Donate Now <ArrowRight size={20}/>
                            </Link>
                            <Link to="/login" className="btn btn-secondary" style={styles.ctaBtnSecondary}>
                                Explore Demo Roles
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        style={styles.heroVisual}
                    >
                        <div style={styles.visualCard}>
                            <div style={styles.floatingStat}>
                                <div style={styles.statIcon}><Heart fill="var(--error)" color="var(--error)"/></div>
                                <div>
                                    <p style={styles.statNum}>₹12,450</p>
                                    <p style={styles.statLabel}>Recent Donation</p>
                                </div>
                            </div>
                            <div style={styles.visualImageWrapper}>
                                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" alt="Impact" style={styles.visualImage} />
                            </div>
                        </div>
                        <div style={styles.heroBlob}></div>
                    </motion.div>
                </div>
            </section>

            {/* Impact Stats */}
            <section style={styles.statsSection}>
                <div className="container">
                    <div style={styles.statsGrid}>
                        {stats.map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={styles.statCard}
                            >
                                <div style={styles.statHeader}>
                                    <div style={styles.statIconBox}>{stat.icon}</div>
                                    <h3 style={styles.statValue}>{stat.value}</h3>
                                </div>
                                <p style={styles.statText}>{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section style={styles.categoriesSection}>
                <div className="container">
                    <div style={styles.sectionHeading}>
                        <h2 style={styles.sectionTitle}>Causes to <span className="gradient-text">Support</span></h2>
                        <p style={styles.sectionSub}>Find the causes that matter most to you and make a difference.</p>
                    </div>
                    <div style={styles.categoriesGrid}>
                        {categories.map((cat, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -10, backgroundColor: 'var(--bg-surface)' }}
                                style={styles.categoryCard}
                            >
                                <div style={{...styles.categoryIcon, color: cat.color, backgroundColor: `${cat.color}15`}}>
                                    {cat.icon}
                                </div>
                                <h4 style={styles.categoryName}>{cat.name}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section style={styles.featuredSection}>
                <div className="container">
                    <div style={styles.sectionHeaderFlex}>
                        <div>
                            <h2 style={styles.sectionTitle}>Featured <span className="gradient-text">Campaigns</span></h2>
                            <p style={styles.sectionSub}>Handpicked causes that need your immediate support.</p>
                        </div>
                        <Link to="/campaigns" className="btn btn-ghost">
                            View all campaigns <ChevronRight size={18}/>
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div style={styles.campaignsGrid}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="card" style={{ height: '450px', background: 'var(--bg-surface)' }}>
                                    <Skeleton height="220px" style={{ borderRadius: '16px 16px 0 0' }} />
                                    <div style={{ padding: '2rem' }}>
                                        <Skeleton height="20px" style={{ marginBottom: '1rem' }} />
                                        <Skeleton height="20px" width="60%" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={styles.campaignsGrid}>
                            {featured.map(c => <CampaignCard key={c._id} campaign={c} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials/Success Stories */}
            <section style={styles.storiesSection}>
                <div className="container">
                    <div style={styles.storiesContent}>
                        <div style={styles.storiesInfo}>
                            <h2 style={styles.sectionTitle}>Success <span className="gradient-text">Stories</span></h2>
                            <p style={styles.storiesText}>
                                "Thanks to CrowdHelp, we raised ₹15 Lakhs for our school renovation in record time. 
                                The transparency of the platform built trust with our donors immediately."
                            </p>
                            <div style={styles.storyAuthor}>
                                <div style={styles.authorAvatar}>S</div>
                                <div>
                                    <p style={styles.authorName}>Sarah Johnson</p>
                                    <p style={styles.authorRole}>Director, Global Education Initiative</p>
                                </div>
                            </div>
                        </div>
                        <div style={styles.storiesVisual}>
                            <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop" alt="Success Story" style={styles.storyImg} />
                        </div>
                    </div>
                </div>
            </section>

            {/* NGO Partner CTA */}
            <section style={styles.ctaSection}>
                <div className="container">
                    <div className="card" style={styles.ctaCard}>
                        <div style={styles.ctaContent}>
                            <h2 style={styles.ctaTitle}>Ready to launch your campaign?</h2>
                            <p style={styles.ctaSub}>Join our network of verified NGOs and start reaching thousands of potential donors today.</p>
                            <div style={styles.ctaActions}>
                                <Link to="/apply-ngo" className="btn btn-primary" style={{padding: '1.2rem 2.5rem'}}>
                                    Apply as Partner NGO
                                </Link>
                                <Link to="/contact" className="btn btn-secondary">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    page: { overflowX: 'hidden' },
    heroSection: {
        padding: '10rem 0 6rem',
        background: 'radial-gradient(circle at 70% 30%, rgba(138, 180, 248, 0.08) 0%, transparent 50%)',
        position: 'relative'
    },
    heroContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6rem',
        alignItems: 'center'
    },
    heroContent: { textAlign: 'left' },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.6rem 1.25rem',
        borderRadius: '100px',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--primary)'
    },
    demoBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.6rem 1.25rem',
        borderRadius: '100px',
        background: 'rgba(52, 168, 83, 0.15)',
        border: '1px solid rgba(52, 168, 83, 0.3)',
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#34a853',
        textDecoration: 'none'
    },
    heroTitle: {
        fontSize: 'clamp(3rem, 6vw, 4.5rem)',
        fontWeight: '900',
        lineHeight: '1.1',
        marginBottom: '1.5rem'
    },
    heroSub: {
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.7',
        marginBottom: '3rem',
        maxWidth: '580px'
    },
    heroActions: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
    ctaBtn: { padding: '1.2rem 2.5rem', fontSize: '1.1rem' },
    ctaBtnSecondary: { padding: '1.2rem 2.5rem', fontSize: '1.1rem' },
    heroVisual: { position: 'relative' },
    visualCard: {
        position: 'relative',
        zIndex: 2,
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border)'
    },
    visualImageWrapper: { height: '500px' },
    visualImage: { width: '100%', height: '100%', objectFit: 'cover' },
    floatingStat: {
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        background: 'rgba(15, 17, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        padding: '1.25rem',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 10
    },
    statIcon: { width: '40px', height: '40px', background: 'rgba(234, 67, 53, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center' },
    statNum: { fontWeight: '800', fontSize: '1.1rem', margin: 0 },
    statLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 },
    heroBlob: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'var(--gradient-main)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        opacity: 0.2,
        zIndex: 1
    },
    statsSection: { padding: '4rem 0' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' },
    statCard: { textAlign: 'left', padding: '1rem' },
    statHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' },
    statIconBox: { color: 'var(--primary)' },
    statValue: { fontSize: '2rem', fontWeight: '800', margin: 0 },
    statText: { color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.95rem' },
    categoriesSection: { padding: '8rem 0' },
    sectionHeading: { textAlign: 'center', marginBottom: '5rem' },
    sectionTitle: { fontSize: '3rem', fontWeight: '800', marginBottom: '1.25rem' },
    sectionSub: { fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' },
    categoriesGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1.5rem' },
    categoryCard: {
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        borderRadius: '24px',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    categoryIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem auto'
    },
    categoryName: { fontSize: '1rem', fontWeight: '700', margin: 0 },
    featuredSection: { padding: '8rem 0', background: 'rgba(255, 255, 255, 0.01)' },
    sectionHeaderFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' },
    campaignsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' },
    storiesSection: { padding: '8rem 0' },
    storiesContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6rem',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        borderRadius: '48px',
        overflow: 'hidden',
        border: '1px solid var(--border)'
    },
    storiesInfo: { padding: '6rem' },
    storiesText: { fontSize: '1.75rem', fontWeight: '600', lineHeight: '1.5', color: 'var(--text-primary)', marginBottom: '3rem', fontStyle: 'italic' },
    storyAuthor: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
    authorAvatar: { width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.5rem' },
    authorName: { fontWeight: '800', fontSize: '1.1rem', margin: 0 },
    authorRole: { fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 },
    storiesVisual: { height: '100%' },
    storyImg: { width: '100%', height: '100%', objectFit: 'cover' },
    ctaSection: { padding: '8rem 0 12rem' },
    ctaCard: {
        padding: '6rem',
        textAlign: 'center',
        background: 'linear-gradient(rgba(138, 180, 248, 0.05), rgba(138, 180, 248, 0.05)), var(--bg-surface)',
        border: '1px solid rgba(138, 180, 248, 0.1)'
    },
    ctaTitle: { fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem' },
    ctaSub: { fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 4rem auto' },
    ctaActions: { display: 'flex', justifyContent: 'center', gap: '2rem' }
};

export default Home;
