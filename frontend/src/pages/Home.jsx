import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCampaigns } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import Spinner from '../components/Spinner';
import { ChevronRight, ShieldCheck, Heart, Users } from 'lucide-react';

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
                <h1 style={styles.heroTitle}>Empower Change Through Giving</h1>
                <p style={styles.heroSub}>Join our community of donors and make a lasting impact on lives across the globe.</p>
                <div style={styles.heroActions}>
                    <Link to="/campaigns" style={styles.primaryBtn}>Explore Campaigns <ChevronRight size={20}/></Link>
                </div>
            </header>

            {/* Features Section */}
            <section style={styles.features}>
                <div style={styles.featureItem}>
                    <ShieldCheck size={40} color="#646cff" />
                    <h3>Secure Payments</h3>
                    <p>Verified transactions via Razorpay with instant digital receipts.</p>
                </div>
                <div style={styles.featureItem}>
                    <Heart size={40} color="#f44336" />
                    <h3>Direct Impact</h3>
                    <p>100% of your donation goes directly to the chosen campaign.</p>
                </div>
                <div style={styles.featureItem}>
                    <Users size={40} color="#4CAF50" />
                    <h3>Community</h3>
                    <p>Join thousands of donors making the world a better place.</p>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section style={styles.featuredSection}>
                <div style={styles.sectionHeader}>
                    <h2>Featured Campaigns</h2>
                    <Link to="/campaigns" style={styles.seeAll}>View All <ChevronRight size={16}/></Link>
                </div>
                
                {loading ? <Spinner /> : (
                    <div style={styles.grid}>
                        {featured.map(c => <CampaignCard key={c._id} campaign={c} />)}
                    </div>
                )}
            </section>

            {/* Call to Action */}
            <section style={styles.cta}>
                <h2>Ready to make a difference?</h2>
                <p>Every contribution, no matter how small, counts towards a better future.</p>
                <Link to="/register" style={styles.secondaryBtn}>Get Started Today</Link>
            </section>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
    },
    hero: {
        textAlign: 'center',
        padding: '5rem 0',
        backgroundColor: '#1a1a1a',
        borderRadius: '20px',
        margin: '2rem 0',
        color: 'white'
    },
    heroTitle: {
        fontSize: '3.5rem',
        marginBottom: '1rem',
        fontWeight: '800'
    },
    heroSub: {
        fontSize: '1.25rem',
        color: '#ccc',
        maxWidth: '700px',
        margin: '0 auto 2.5rem'
    },
    heroActions: {
        display: 'flex',
        justifyContent: 'center'
    },
    primaryBtn: {
        backgroundColor: '#646cff',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '3rem',
        margin: '5rem 0',
        textAlign: 'center'
    },
    featureItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
    },
    featuredSection: {
        margin: '5rem 0'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
    },
    seeAll: {
        color: '#646cff',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.2rem',
        fontWeight: 'bold'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2.5rem'
    },
    cta: {
        backgroundColor: '#646cff',
        color: 'white',
        padding: '5rem 2rem',
        borderRadius: '20px',
        textAlign: 'center',
        margin: '5rem 0'
    },
    secondaryBtn: {
        backgroundColor: 'white',
        color: '#646cff',
        padding: '1rem 2rem',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block',
        marginTop: '2rem'
    }
};

export default Home;
