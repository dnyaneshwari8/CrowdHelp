import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchNGODashboard, fetchNotifications } from '../services/api';
import Skeleton from '../components/Skeleton';
import DashboardLayout from '../components/DashboardLayout';
import { getImageUrl } from '../utils/imageHelper';
import { 
    LineElement, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    Tooltip, 
    Legend, 
    Chart as ChartJS 
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    LineElement, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    Tooltip, 
    Legend
);

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
    MoreHorizontal,
    CheckCircle2
} from 'lucide-react';

const NGODashboard = () => {
    const [data, setData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [res, notifs] = await Promise.all([
                    fetchNGODashboard(),
                    fetchNotifications()
                ]);
                setData(res.data);
                setNotifications(notifs.data.notifications);
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

    const kpis = data ? [
        { 
            label: 'Total Raised', 
            value: `₹${data.totalAmountRaised.toLocaleString()}`, 
            change: `${data.monthlyGrowth >= 0 ? '+' : ''}${data.monthlyGrowth}%`, 
            trend: data.monthlyGrowth >= 0 ? 'up' : 'down', 
            icon: <IndianRupee size={24}/>, 
            color: '#34a853' 
        },
        { 
            label: 'Active Campaigns', 
            value: data.activeCampaigns, 
            change: `${data.totalCampaigns} total`, 
            trend: 'up', 
            icon: <Megaphone size={24}/>, 
            color: 'var(--primary)' 
        },
        { 
            label: 'Unique Donors', 
            value: data.uniqueDonors || 0, 
            change: 'Supporters', 
            trend: 'up', 
            icon: <Users size={24}/>, 
            color: '#FF9800' 
        },
        { 
            label: 'Avg. Donation', 
            value: `₹${Math.round(data.totalAmountRaised / (data.totalDonations || 1)).toLocaleString()}`, 
            change: `${data.totalDonations} gifts`, 
            trend: 'up', 
            icon: <TrendingUp size={24}/>, 
            color: '#9c27b0' 
        },
    ] : [];

    const trendData = {
        labels: data?.trend.map(t => {
            const date = new Date(t._id.year, t._id.month - 1);
            return date.toLocaleString('default', { month: 'short' });
        }) || [],
        datasets: [
            {
                label: 'Raised (₹)',
                data: data?.trend.map(t => t.amount) || [],
                fill: true,
                borderColor: '#34a853',
                backgroundColor: 'rgba(52, 168, 83, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#34a853'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e1f20',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }
            }
        }
    };

    return (
        <DashboardLayout role="NGO">
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
                                <h3 style={styles.sectionTitle}>Donation Trend</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <TrendingUp size={16} color="var(--success)"/>
                                    <span style={{color: 'var(--success)', fontWeight: '700'}}>+{data?.monthlyGrowth}%</span>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <Line data={trendData} options={chartOptions} height={80} />
                            </div>
                        </div>

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
                                                            <img 
                                                                src={getImageUrl(campaign.image)} 
                                                                alt={campaign.title} 
                                                                style={styles.campThumb} 
                                                            />
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

                        <div className="card" style={styles.sectionCard}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>Recent Donations</h3>
                                <Link to="/ngo/donations" style={styles.viewAll}>View All</Link>
                            </div>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Donor</th>
                                            <th>Campaign</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.recentDonations.map(donation => (
                                            <tr key={donation._id} style={styles.tr}>
                                                <td style={{ padding: '1rem 0' }}>
                                                    <div style={styles.donorCell}>
                                                        <div style={styles.donorAvatar}>{donation.userId?.name[0]}</div>
                                                        <div>
                                                            <p style={styles.campTitle}>{donation.userId?.name || 'Anonymous'}</p>
                                                            <p style={styles.campGoal}>{donation.userId?.email || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><p style={styles.campTitle}>{donation.campaignId?.title}</p></td>
                                                <td><p style={styles.raisedAmt}>₹{donation.amount.toLocaleString()}</p></td>
                                                <td><p style={styles.campGoal}>{new Date(donation.createdAt).toLocaleDateString()}</p></td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: '700' }}>
                                                        <CheckCircle2 size={14}/> Verified
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div style={styles.sideCol}>
                        <div className="card" style={styles.impactCard}>
                            <h3 style={styles.sectionTitle}>Impact Pulse</h3>
                            <div style={styles.impactList}>
                                {notifications.length > 0 ? notifications.slice(0, 5).map(notif => (
                                    <div key={notif._id} style={styles.impactItem}>
                                        <div style={styles.impactIcon}>
                                            {notif.type === 'DONATION_RECEIVED' ? <Users size={16}/> : 
                                             notif.type === 'GOAL_ACHIEVED' ? <Target size={16}/> : <Sparkles size={16}/>}
                                        </div>
                                        <div>
                                            <p style={styles.impactText}>{notif.message}</p>
                                            <p style={styles.impactTime}>{new Date(notif.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent activity.</p>
                                )}
                            </div>
                            <button className="btn btn-secondary" style={{width: '100%', marginTop: '1.5rem'}} onClick={() => navigate('/notifications')}>
                                View All Notifications
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
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
    campThumb: { width: '40px', height: '40px', background: 'var(--glass-heavy)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--primary)', objectFit: 'cover' },
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
