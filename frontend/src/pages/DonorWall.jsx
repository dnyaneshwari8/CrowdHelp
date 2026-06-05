import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchDonorWall } from '../services/api';
import Spinner from '../components/Spinner';
import { Heart, Calendar, Target, User, Sparkles, Quote, Award } from 'lucide-react';

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
        <div style={styles.page}>
            <div className="container">
                <header style={styles.header}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={styles.headerContent}
                    >
                        <div style={styles.badge}>
                            <Sparkles size={14} /> <span>Wall of Kindness</span>
                        </div>
                        <h1 style={styles.title}>The <span className="gradient-text">Supporters</span> Circle</h1>
                        <p style={styles.subtitle}>
                            Celebrating the heroes who fuel our mission. Every contribution is a step towards a better world.
                        </p>
                    </motion.div>
                </header>
                
                <div style={styles.grid}>
                    {donors.map((donor, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="card" 
                            style={styles.donorCard}
                        >
                            <div style={styles.cardTop}>
                                <div style={styles.avatarWrapper}>
                                    {donor.donorName === 'Anonymous' ? (
                                        <div style={styles.anonAvatar}><User size={24}/></div>
                                    ) : (
                                        <div style={styles.nameAvatar}>{donor.donorName[0]}</div>
                                    )}
                                    <div style={styles.heartFloat}><Heart size={12} fill="var(--error)" color="var(--error)"/></div>
                                </div>
                                <div style={styles.donorMeta}>
                                    <h3 style={styles.donorName}>{donor.donorName}</h3>
                                    <p style={styles.dateText}>{new Date(donor.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div style={styles.contribution}>
                                <div style={styles.amountBox}>
                                    <span style={styles.currency}>₹</span>
                                    <span style={styles.amount}>{donor.amount.toLocaleString()}</span>
                                </div>
                                <div style={styles.campaignLink}>
                                    <Target size={14} color="var(--primary)"/>
                                    <span>{donor.campaignTitle}</span>
                                </div>
                            </div>

                            <div style={styles.quoteIcon}><Quote size={20}/></div>
                        </motion.div>
                    ))}
                </div>

                {donors.length === 0 && (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}><Award size={48} color="var(--text-muted)"/></div>
                        <h3>Be the first hero</h3>
                        <p>The wall is waiting for its first act of kindness. Start a campaign or donate today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { padding: '8rem 0 10rem', backgroundColor: 'var(--bg-dark)' },
    header: { textAlign: 'center', marginBottom: '6rem' },
    headerContent: { maxWidth: '700px', margin: '0 auto' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.25rem', borderRadius: '100px', background: 'var(--glass)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '1.5rem' },
    title: { fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.25rem' },
    subtitle: { fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
    donorCard: { padding: '2rem', position: 'relative', overflow: 'hidden' },
    cardTop: { display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' },
    avatarWrapper: { position: 'relative' },
    nameAvatar: { width: '56px', height: '56px', borderRadius: '16px', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', color: '#000' },
    anonAvatar: { width: '56px', height: '56px', borderRadius: '16px', background: 'var(--glass-heavy)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' },
    heartFloat: { position: 'absolute', top: '-5px', right: '-5px', background: 'var(--bg-dark)', padding: '4px', borderRadius: '50%', display: 'flex' },
    donorMeta: { textAlign: 'left' },
    donorName: { fontSize: '1.1rem', fontWeight: '800', margin: 0 },
    dateText: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' },
    contribution: { textAlign: 'left' },
    amountBox: { display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '0.75rem' },
    currency: { fontSize: '1rem', fontWeight: '700', color: 'var(--success)' },
    amount: { fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-primary)' },
    campaignLink: { display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' },
    quoteIcon: { position: 'absolute', bottom: '1rem', right: '1.5rem', opacity: 0.1, color: 'var(--primary)' },
    emptyState: { textAlign: 'center', padding: '10rem 0', color: 'var(--text-muted)' },
    emptyIcon: { width: '80px', height: '80px', borderRadius: '50%', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }
};

export default DonorWall;
