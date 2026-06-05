import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchNGODashboard } from '../services/api';
import Skeleton from '../components/Skeleton';
import { 
    LayoutDashboard, 
    Megaphone, 
    IndianRupee, 
    TrendingUp, 
    Target, 
    Sparkles, 
    ChevronRight,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
} from 'lucide-react';

const NGODashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchNGODashboard();
                setData(res.data);
            } catch (error) {
                console.error('Error loading NGO dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <Skeleton width="300px" height="40px" style={{ marginBottom: '1rem' }} />
                    <Skeleton width="450px" height="20px" />
                </div>
            </div>
            <div style={styles.kpiGrid}>
                {[1,2,3,4].map(i => (
                    <div key={i} className="card" style={styles.kpiCard}>
                        <Skeleton height="120px" />
                    </div>
                ))}
            </div>
            <div style={styles.dashboardGrid}>
                <div style={styles.mainCol}>
                    <div className="card" style={styles.sectionCard}>
                        <Skeleton height="400px" />
                    </div>
                </div>
                <div style={styles.sideCol}>
                    <div className="card" style={styles.sectionCard}>
                        <Skeleton height="400px" />
                    </div>
                </div>
            </div>
        </div>
    );

    const kpis = [
        { label: 'Total Raised', value: `₹${data.totalAmountRaised.toLocaleString()}`, change: '+12.5%', trend: 'up', icon: <IndianRupee size={24}/>, color: '#34a853' },
        { label: 'Active Campaigns', value: data.activeCampaigns, change: '+2', trend: 'up', icon: <Megaphone size={24}/>, color: 'var(--primary)' },
        { label: 'Total Donors', value: data.totalDonations, change: '+18', trend: 'up', icon: <Users size={24}/>, color: '#FF9800' },
        { label: 'Avg. Donation', value: `₹${Math.round(data.totalAmountRaised / (data.totalDonations || 1)).toLocaleString()}`, change: '-2.4%', trend: 'down', icon: <TrendingUp size={24}/>, color: '#9c27b0' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.container}
        >
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Welcome back, <span className="gradient-text">Organization</span></h1>
                    <p style={styles.subtitle}>Here's what's happening with your campaigns today.</p>
                </div>
                <div style={styles.headerActions}>
                    <button style={styles.dateFilter}><Calendar size={16}/> Last 30 Days</button>
                    <Link to="/ngo/my-campaigns" className="btn btn-primary">Create Campaign</Link>
                </div>
            </div>
            
            <div style={styles.kpiGrid}>
                {kpis.map((kpi, i) => (
                    <div key={i} className="card" style={styles.kpiCard}>
                        <div style={styles.kpiHeader}>
                            <div style={{...styles.iconBox, backgroundColor: `${kpi.color}15`, color: kpi.color}}>
                                {kpi.icon}
                            </div>
                            <div style={{...styles.trendBadge, color: kpi.trend === 'up' ? 'var(--success)' : 'var(--error)'}}>
                                {kpi.trend === 'up' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                                {kpi.change}
                            </div>
                        </div>
                        <div style={styles.kpiInfo}>
                            <p style={styles.kpiLabel}>{kpi.label}</p>
                            <h3 style={styles.kpiValue}>{kpi.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.dashboardGrid}>
                <div style={styles.mainCol}>
                    <div className="card" style={styles.sectionCard}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Campaign Performance</h3>
                            <Link to="/ngo/my-campaigns" style={styles.viewAll}>View All</Link>
                        </div>
                        
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Campaign</th>
                                        <th>Status</th>
                                        <th>Progress</th>
                                        <th>Raised</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.campaignPerformance.map(campaign => {
                                        const progress = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
                                        return (
                                            <tr key={campaign._id} style={styles.tr}>
                                                <td>
                                                    <div style={styles.campCell}>
                                                        <div style={styles.campThumb}>
                                                            {campaign.title[0]}
                                                        </div>
                                                        <div>
                                                            <p style={styles.campTitle}>{campaign.title}</p>
                                                            <p style={styles.campGoal}>Goal: ₹{campaign.goalAmount.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        backgroundColor: campaign.status === 'APPROVED' ? 'rgba(52, 168, 83, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                                                        color: campaign.status === 'APPROVED' ? '#34a853' : '#fbbc04'
                                                    }}>
                                                        {campaign.status.toLowerCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={styles.progressContainer}>
                                                        <div style={styles.progressBar}>
                                                            <div style={{...styles.progressFill, width: `${progress}%`}}></div>
                                                        </div>
                                                        <span style={styles.progressText}>{progress}%</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p style={styles.raisedAmt}>₹{campaign.currentAmount.toLocaleString()}</p>
                                                </td>
                                                <td>
                                                    <button style={styles.actionBtn}><MoreHorizontal size={18}/></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={styles.sideCol}>
                    <div className="card" style={styles.impactCard}>
                        <h3 style={styles.sectionTitle}>Impact Pulse</h3>
                        <div style={styles.impactList}>
                            <div style={styles.impactItem}>
                                <div style={styles.impactIcon}><Users size={16}/></div>
                                <div>
                                    <p style={styles.impactText}>New donor contributed ₹5,000</p>
                                    <p style={styles.impactTime}>2 hours ago</p>
                                </div>
                            </div>
                            <div style={styles.impactItem}>
                                <div style={styles.impactIcon}><Target size={16}/></div>
                                <div>
                                    <p style={styles.impactText}>Campaign reached 75% goal</p>
                                    <p style={styles.impactTime}>5 hours ago</p>
                                </div>
                            </div>
                            <div style={styles.impactItem}>
                                <div style={styles.impactIcon}><Sparkles size={16}/></div>
                                <div>
                                    <p style={styles.impactText}>Your NGO was featured</p>
                                    <p style={styles.impactTime}>Yesterday</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-secondary" style={{width: '100%', marginTop: '1rem'}}>
                            View Full Report
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2.5rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    title: { fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '1rem' },
    headerActions: { display: 'flex', gap: '1rem', alignItems: 'center' },
    dateFilter: { background: 'var(--glass)', border: '1px solid var(--border)', padding: '0.6rem 1rem', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' },
    kpiCard: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    kpiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    iconBox: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    trendBadge: { display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '700', padding: '0.25rem 0.5rem', borderRadius: '8px', background: 'var(--glass)' },
    kpiInfo: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    kpiLabel: { fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' },
    kpiValue: { fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 },
    dashboardGrid: { display: 'grid', gridTemplateColumns: '1.5fr 0.5fr', gap: '1.5rem' },
    mainCol: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    sectionCard: { padding: '1.5rem' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: '800', margin: 0 },
    viewAll: { color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '700', textDecoration: 'none' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tr: { borderBottom: '1px solid var(--border)' },
    campCell: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' },
    campThumb: { width: '40px', height: '40px', background: 'var(--glass-heavy)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--primary)' },
    campTitle: { fontSize: '0.95rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' },
    campGoal: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 },
    statusBadge: { padding: '0.3rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'capitalize' },
    progressContainer: { display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '120px' },
    progressBar: { flex: 1, height: '6px', background: 'var(--glass)', borderRadius: '10px', overflow: 'hidden' },
    progressFill: { height: '100%', background: 'var(--gradient-main)', borderRadius: '10px' },
    progressText: { fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' },
    raisedAmt: { fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' },
    actionBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' },
    sideCol: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    impactCard: { padding: '1.5rem' },
    impactList: { display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' },
    impactItem: { display: 'flex', gap: '1rem' },
    impactIcon: { width: '32px', height: '32px', borderRadius: '8px', background: 'var(--glass)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 },
    impactText: { fontSize: '0.9rem', fontWeight: '600', margin: 0, color: 'var(--text-primary)', lineHeight: '1.4' },
    impactTime: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }
};

export default NGODashboard;
