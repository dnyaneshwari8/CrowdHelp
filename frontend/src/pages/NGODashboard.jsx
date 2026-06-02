import React, { useState, useEffect } from 'react';
import { 
    Megaphone, 
    IndianRupee, 
    Users, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    TrendingUp,
    Calendar
} from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/Spinner';

const NGODashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/ngo/dashboard');
                setStats(res.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load dashboard stats');
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Spinner />;
    if (error) return <div style={styles.error}>{error}</div>;

    const statCards = [
        { title: 'Total Campaigns', value: stats.totalCampaigns, icon: <Megaphone size={24}/>, color: '#3b82f6' },
        { title: 'Active Campaigns', value: stats.activeCampaigns, icon: <CheckCircle2 size={24}/>, color: '#22c55e' },
        { title: 'Pending Approval', value: stats.pendingCampaigns, icon: <Clock size={24}/>, color: '#f59e0b' },
        { title: 'Completed', value: stats.completedCampaigns, icon: <TrendingUp size={24}/>, color: '#8b5cf6' },
        { title: 'Total Raised', value: `₹${stats.totalAmountRaised.toLocaleString()}`, icon: <IndianRupee size={24}/>, color: '#10b981' },
        { title: 'Total Donors', value: stats.totalDonors, icon: <Users size={24}/>, color: '#6366f1' }
    ];

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.welcome}>Dashboard Overview</h1>
                    <p style={styles.subtitle}>Welcome back! Here's what's happening with your campaigns.</p>
                </div>
                <div style={styles.dateDisplay}>
                    <Calendar size={18}/>
                    <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={styles.statsGrid}>
                {statCards.map((card, index) => (
                    <div key={index} style={styles.statCard}>
                        <div style={{ ...styles.iconWrapper, backgroundColor: `${card.color}20`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div style={styles.statInfo}>
                            <h3 style={styles.statValue}>{card.value}</h3>
                            <p style={styles.statTitle}>{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.bottomGrid}>
                {/* Recent Activity */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Recent Activity</h2>
                        <button style={styles.viewAll}>View All</button>
                    </div>
                    <div style={styles.activityList}>
                        {stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity, index) => (
                                <div key={index} style={styles.activityItem}>
                                    <div style={{
                                        ...styles.activityIcon,
                                        backgroundColor: activity.type === 'DONATION' ? '#22c55e20' : '#3b82f620',
                                        color: activity.type === 'DONATION' ? '#22c55e' : '#3b82f6'
                                    }}>
                                        {activity.type === 'DONATION' ? <IndianRupee size={16}/> : <Megaphone size={16}/>}
                                    </div>
                                    <div style={styles.activityContent}>
                                        <p style={styles.activityTitle}>
                                            <span style={styles.activityAction}>{activity.action}</span> {activity.title}
                                        </p>
                                        <p style={styles.activityDate}>
                                            {new Date(activity.date).toLocaleString()}
                                        </p>
                                    </div>
                                    {activity.amount && (
                                        <div style={styles.activityAmount}>+₹{activity.amount}</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div style={styles.empty}>No recent activity found.</div>
                        )}
                    </div>
                </div>

                {/* Campaign Performance */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Campaign Performance</h2>
                        <button style={styles.viewAll}>View Campaigns</button>
                    </div>
                    <div style={styles.performanceList}>
                        {stats.campaignPerformance.slice(0, 5).map((campaign, index) => {
                            const progress = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
                            return (
                                <div key={index} style={styles.performanceItem}>
                                    <div style={styles.perfHeader}>
                                        <span style={styles.perfTitle}>{campaign.title}</span>
                                        <span style={styles.perfPercent}>{progress.toFixed(1)}%</span>
                                    </div>
                                    <div style={styles.progressContainer}>
                                        <div style={{ ...styles.progressBar, width: `${progress}%`, backgroundColor: progress >= 100 ? '#22c55e' : '#3b82f6' }} />
                                    </div>
                                    <div style={styles.perfFooter}>
                                        <span>₹{campaign.currentAmount.toLocaleString()} raised</span>
                                        <span>Goal: ₹{campaign.goalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    welcome: { fontSize: '1.75rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' },
    subtitle: { color: '#94a3b8', fontSize: '1rem' },
    dateDisplay: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        padding: '0.6rem 1rem', 
        background: '#1e293b', 
        borderRadius: '10px', 
        color: '#94a3b8',
        fontSize: '0.9rem',
        border: '1px solid #334155'
    },
    statsGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem' 
    },
    statCard: { 
        background: '#1e293b', 
        padding: '1.5rem', 
        borderRadius: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.25rem',
        border: '1px solid #334155'
    },
    iconWrapper: { 
        width: '56px', 
        height: '56px', 
        borderRadius: '14px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    statInfo: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    statValue: { fontSize: '1.5rem', fontWeight: '700', color: 'white' },
    statTitle: { fontSize: '0.9rem', color: '#94a3b8' },
    bottomGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '1.5rem' 
    },
    card: { 
        background: '#1e293b', 
        borderRadius: '16px', 
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column'
    },
    cardHeader: { 
        padding: '1.5rem', 
        borderBottom: '1px solid #334155', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    cardTitle: { fontSize: '1.1rem', fontWeight: '600', color: 'white' },
    viewAll: { color: '#22c55e', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' },
    activityList: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
    activityItem: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        padding: '0.75rem', 
        borderRadius: '12px',
        transition: 'background 0.2s ease',
        ':hover': { background: '#334155' }
    },
    activityIcon: { 
        width: '36px', 
        height: '36px', 
        borderRadius: '10px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    activityContent: { flex: 1 },
    activityTitle: { color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '0.25rem' },
    activityAction: { fontWeight: '600' },
    activityDate: { color: '#64748b', fontSize: '0.75rem' },
    activityAmount: { color: '#22c55e', fontWeight: '700', fontSize: '0.9rem' },
    performanceList: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    performanceItem: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    perfHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    perfTitle: { color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '500' },
    perfPercent: { color: '#22c55e', fontSize: '0.9rem', fontWeight: '600' },
    progressContainer: { height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' },
    perfFooter: { display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem' },
    error: { color: '#ef4444', textAlign: 'center', padding: '2rem' },
    empty: { color: '#64748b', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }
};

export default NGODashboard;
