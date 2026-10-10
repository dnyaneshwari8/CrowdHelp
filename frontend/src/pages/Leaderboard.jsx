import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../services/api';
import Spinner from '../components/Spinner';
import { Trophy, Award, Medal, Crown, Users, Heart, TrendingUp, Repeat } from 'lucide-react';

const TIER_CONFIG = {
    'Diamond Champion':  { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.4)' },
    'Platinum Guardian': { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.35)' },
    'Gold Benefactor':   { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.35)' },
    'Silver Supporter':  { color: '#cbd5e1', bg: 'rgba(203,213,225,0.10)', border: 'rgba(203,213,225,0.3)' },
    'Bronze Friend':     { color: '#cd7f32', bg: 'rgba(205,127,50,0.10)',  border: 'rgba(205,127,50,0.3)'  },
};

const Leaderboard = () => {
    const [donors, setDonors] = useState([]);
    const [stats, setStats] = useState({ totalRaised: 0, totalDonations: 0, totalDonors: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const res = await fetchLeaderboard();
                setDonors(res.data.leaderboard || []);
                setStats(res.data.stats || { totalRaised: 0, totalDonations: 0, totalDonors: 0 });
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

            {/* ── Page Header ── */}
            <div style={styles.pageHeader}>
                <div style={styles.headerBadge}>
                    <Crown size={14} /> <span>Impact Leaderboard</span>
                </div>
                <h1 style={styles.mainTitle}>
                    Top <span style={styles.gradientText}>Impact Leaders</span>
                </h1>
                <p style={styles.subtitle}>
                    Honoring the generous donors who have made the biggest difference in our community.
                </p>
            </div>

            {/* ── Platform Stats Bar ── */}
            <div style={styles.statsBar}>
                <div style={styles.statItem}>
                    <TrendingUp size={20} color="var(--primary)" />
                    <div>
                        <div style={styles.statValue}>₹{(stats.totalRaised || 0).toLocaleString()}</div>
                        <div style={styles.statLabel}>Total Raised</div>
                    </div>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.statItem}>
                    <Heart size={20} color="#ef4444" />
                    <div>
                        <div style={styles.statValue}>{(stats.totalDonations || 0).toLocaleString()}</div>
                        <div style={styles.statLabel}>Donations Made</div>
                    </div>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.statItem}>
                    <Users size={20} color="#34a853" />
                    <div>
                        <div style={styles.statValue}>{(stats.totalDonors || 0).toLocaleString()}</div>
                        <div style={styles.statLabel}>Unique Donors</div>
                    </div>
                </div>
            </div>

            {/* ── Tier Legend ── */}
            <div style={styles.tierLegend}>
                {Object.entries(TIER_CONFIG).map(([tier, cfg]) => (
                    <div key={tier} style={{ ...styles.tierPill, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{tier}</span>
                    </div>
                ))}
            </div>

            {/* ── Leaderboard List ── */}
            <div style={styles.list}>
                {donors.map((donor, index) => {
                    const tier = donor.tier || 'Bronze Friend';
                    const tierCfg = TIER_CONFIG[tier] || TIER_CONFIG['Bronze Friend'];
                    const isTop3 = index < 3;
                    const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

                    return (
                        <div
                            key={donor._id || index}
                            className="card"
                            style={{
                                ...styles.item,
                                background: isTop3
                                    ? `linear-gradient(135deg, ${tierCfg.bg} 0%, var(--bg-surface) 100%)`
                                    : 'var(--bg-surface)',
                                border: isTop3
                                    ? `1px solid ${tierCfg.border}`
                                    : '1px solid var(--border)',
                                boxShadow: isTop3 ? `0 4px 24px ${tierCfg.bg}` : undefined,
                            }}
                        >
                            {/* Rank */}
                            <div style={styles.rankSection}>
                                <div style={{ color: rankColors[index] || 'var(--text-muted)', ...styles.rankIconWrap }}>
                                    {index === 0
                                        ? <Crown size={30} />
                                        : index === 1
                                            ? <Medal size={26} />
                                            : index === 2
                                                ? <Award size={22} />
                                                : <span style={styles.rankNum}>#{index + 1}</span>
                                    }
                                </div>
                            </div>

                            {/* Avatar + Name */}
                            <div style={styles.donorMain}>
                                <div style={{ ...styles.avatar, borderColor: tierCfg.border, color: tierCfg.color }}>
                                    {(donor.donorName || '?')[0].toUpperCase()}
                                </div>
                                <div style={styles.details}>
                                    <h3 style={styles.name}>{donor.donorName}</h3>
                                    <div style={{ ...styles.tierBadge, background: tierCfg.bg, border: `1px solid ${tierCfg.border}`, color: tierCfg.color }}>
                                        <span>{donor.tierIcon}</span>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{tier}</span>
                                    </div>
                                    {donor.donationCount > 0 && (
                                        <div style={styles.donationCount}>
                                            <Repeat size={11} />
                                            <span>{donor.donationCount} donation{donor.donationCount > 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Amount */}
                            <div style={styles.contribution}>
                                <span style={styles.amountLabel}>Total Contributed</span>
                                <div style={{ ...styles.amountValue, color: isTop3 ? tierCfg.color : '#fff' }}>
                                    ₹{(donor.totalDonated || 0).toLocaleString()}
                                </div>
                                {donor.lastDonationDate && (
                                    <span style={styles.lastDate}>
                                        Last: {new Date(donor.lastDonationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {donors.length === 0 && (
                <div style={styles.emptyState}>
                    <Trophy size={48} color="var(--border)" />
                    <p>No contributors found yet. Be the first!</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '2rem', paddingBottom: '8rem' },
    pageHeader: { padding: '4rem 0 2.5rem', textAlign: 'center' },
    headerBadge: {
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.45rem 1.25rem', borderRadius: '100px',
        background: 'var(--glass)', border: '1px solid var(--border)',
        fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.25rem',
    },
    mainTitle: { fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' },
    gradientText: { background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 },

    statsBar: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '1.5rem 2.5rem', marginBottom: '2rem', flexWrap: 'wrap',
    },
    statItem: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    statValue: { fontSize: '1.3rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 },
    statLabel: { fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
    statDivider: { width: '1px', height: '40px', background: 'var(--border)' },

    tierLegend: { display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '2rem' },
    tierPill: { padding: '0.35rem 0.9rem', borderRadius: '100px', cursor: 'default' },

    list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    item: {
        display: 'flex', alignItems: 'center', padding: '1.5rem 2rem',
        gap: '1.5rem', textAlign: 'left', transition: 'transform 0.25s ease, box-shadow 0.25s ease', borderRadius: '20px',
    },

    rankSection: { minWidth: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    rankIconWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    rankNum: { fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-muted)' },

    donorMain: { flex: 1, display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: 0 },
    avatar: {
        width: '56px', height: '56px', borderRadius: '16px', background: 'var(--glass)',
        border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', fontWeight: 800, flexShrink: 0,
    },
    details: { display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 0 },
    name: { fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    tierBadge: {
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
        padding: '0.25rem 0.7rem', borderRadius: '100px', width: 'fit-content',
    },
    donationCount: { display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 },

    contribution: { textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 },
    amountLabel: { fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 },
    amountValue: { fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' },
    lastDate: { fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 },

    emptyState: { textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' },
};

export default Leaderboard;


