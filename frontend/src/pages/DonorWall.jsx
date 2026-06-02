import React, { useState, useEffect } from 'react';
import { fetchDonorWall } from '../services/api';
import Spinner from '../components/Spinner';
import { Heart, Calendar, Target, User, Sparkles } from 'lucide-react';

const DonorWall = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDonors = async () => {
            try {
                const res = await fetchDonorWall();
                setDonors(res.data.donorWall);
            } catch (error) {
                console.error('Error fetching donor wall:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDonors();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.pageHeader}>
                <div style={styles.badge}>
                    <Sparkles size={14} /> <span>Wall of Kindness</span>
                </div>
                <h1 style={styles.mainTitle}>Our <span style={styles.gradientText}>Supporters</span></h1>
                <p style={styles.subtitle}>
                    A public tribute to the generous souls who make our mission possible.
                </p>
            </div>
            
            <div style={styles.grid}>
                {donors.map((donor, index) => (
                    <div key={index} className="card" style={styles.card}>
                        <div style={styles.cardTop}>
                            <div style={styles.avatar}>
                                {donor.donorName === 'Anonymous' ? <User size={24}/> : donor.donorName[0].toUpperCase()}
                            </div>
                            <div style={styles.donorInfo}>
                                <h3 style={styles.name}>{donor.donorName}</h3>
                                <span style={styles.date}>
                                    <Calendar size={12}/> {new Date(donor.date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        
                        <div style={styles.contribution}>
                            <div style={styles.amountBadge}>
                                ₹{donor.amount.toLocaleString()}
                            </div>
                            <p style={styles.campaign}>
                                <Target size={14} color="var(--primary)"/> 
                                <span>{donor.campaignTitle}</span>
                            </p>
                        </div>

                        <div style={styles.heartIcon}>
                            <Heart size={16} fill="var(--primary)" color="var(--primary)"/>
                        </div>
                    </div>
                ))}
            </div>

            {donors.length === 0 && (
                <div style={styles.emptyState}>
                    <Heart size={48} color="var(--border)"/>
                    <p>The wall is waiting for its first hero.</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        paddingBottom: '8rem'
    },
    pageHeader: {
        padding: '4rem 0',
        textAlign: 'center',
        marginBottom: '2rem'
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1.25rem',
        borderRadius: '100px',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--primary)',
        marginBottom: '1.5rem'
    },
    mainTitle: {
        fontSize: '3.5rem',
        fontWeight: '800',
        marginBottom: '1rem'
    },
    gradientText: {
        background: 'var(--gradient-main)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        maxWidth: '600px',
        margin: '0 auto'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem'
    },
    card: {
        position: 'relative',
        padding: '2rem',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        textAlign: 'left',
        overflow: 'hidden'
    },
    cardTop: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
    },
    avatar: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'var(--gradient-main)',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: '800'
    },
    donorInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    name: {
        fontSize: '1.2rem',
        fontWeight: '700',
        margin: 0,
        color: '#fff'
    },
    date: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
    },
    contribution: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    amountBadge: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--primary)'
    },
    campaign: {
        fontSize: '0.95rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
    },
    heartIcon: {
        position: 'absolute',
        bottom: '-10px',
        right: '-10px',
        opacity: 0.1,
        transform: 'rotate(-15deg) scale(4)'
    },
    emptyState: {
        textAlign: 'center',
        padding: '5rem',
        color: 'var(--text-secondary)'
    }
};

export default DonorWall;
