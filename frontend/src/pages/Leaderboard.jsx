import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../services/api';
import Spinner from '../components/Spinner';
import { Trophy, Award, Medal, Crown, Star } from 'lucide-react';

const Leaderboard = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const res = await fetchLeaderboard();
                setDonors(res.data.leaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        loadLeaderboard();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.pageHeader}>
                <div style={styles.badge}>
                    <Crown size={14} /> <span>Top Donors</span>
                </div>
                <h1 style={styles.mainTitle}>Impact <span style={styles.gradientText}>Leaders</span></h1>
                <p style={styles.subtitle}>
                    Honoring the individuals who have gone above and beyond to support our community.
                </p>
            </div>
            
            <div style={styles.list}>
                {donors.map((donor, index) => (
                    <div key={donor._id} className="card" style={{
                        ...styles.item,
                        background: index === 0 ? 'linear-gradient(135deg, rgba(138, 180, 248, 0.1) 0%, rgba(30, 31, 32, 1) 100%)' : 'var(--bg-surface)',
                        border: index === 0 ? '1px solid var(--primary)' : '1px solid var(--border)'
                    }}>
                        <div style={styles.rankSection}>
                            <div style={{
                                ...styles.rankIcon,
                                color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--text-secondary)'
                            }}>
                                {index === 0 ? <Crown size={32}/> : index === 1 ? <Medal size={28}/> : index === 2 ? <Award size={24}/> : `#${index + 1}`}
                            </div>
                        </div>

                        <div style={styles.donorMain}>
                            <div style={styles.avatar}>
                                {donor.donorName[0].toUpperCase()}
                            </div>
                            <div style={styles.details}>
                                <h3 style={styles.name}>{donor.donorName}</h3>
                                <div style={styles.achievement}>
                                    <Star size={12} fill="var(--primary)" color="var(--primary)"/>
                                    <span>Top Contributor</span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.contribution}>
                            <span style={styles.amountLabel}>Total Contributed</span>
                            <div style={{
                                ...styles.amountValue,
                                color: index === 0 ? 'var(--primary)' : '#fff'
                            }}>
                                ₹{donor.totalDonated.toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {donors.length === 0 && (
                <div style={styles.emptyState}>
                    <Trophy size={48} color="var(--border)"/>
                    <p>No contributors found yet. Be the first!</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
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
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        padding: '2rem',
        gap: '2rem',
        textAlign: 'left',
        transition: 'transform 0.3s ease'
    },
    rankSection: {
        width: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rankIcon: {
        fontSize: '1.5rem',
        fontWeight: '800'
    },
    donorMain: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    avatar: {
        width: '64px',
        height: '64px',
        borderRadius: '20px',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--primary)'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem'
    },
    name: {
        fontSize: '1.4rem',
        fontWeight: '700',
        margin: 0,
        color: '#fff'
    },
    achievement: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        fontWeight: '600'
    },
    contribution: {
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    amountLabel: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: '700'
    },
    amountValue: {
        fontSize: '2rem',
        fontWeight: '900'
    },
    emptyState: {
        textAlign: 'center',
        padding: '5rem',
        color: 'var(--text-secondary)'
    }
};

export default Leaderboard;
