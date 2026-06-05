import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Megaphone, 
    IndianRupee, 
    ShieldCheck, 
    Activity, 
    TrendingUp, 
    Search,
    Download,
    Lock,
    Unlock,
    ExternalLink,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    LayoutDashboard,
    AlertCircle,
    PlusCircle
} from 'lucide-react';
import { 
    fetchAllUsers, 
    fetchAllDonations, 
    fetchAdvancedAnalytics, 
    toggleBlockUser, 
    fetchAuditLogs,
    exportDonations 
} from '../services/api';
import Skeleton from '../components/Skeleton';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [usersRes, donationsRes, analyticsRes, logsRes] = await Promise.all([
                    fetchAllUsers(),
                    fetchAllDonations(),
                    fetchAdvancedAnalytics(),
                    fetchAuditLogs()
                ]);
                setUsers(usersRes.data.users);
                setDonations(donationsRes.data.donations);
                setAnalytics(analyticsRes.data);
                setAuditLogs(logsRes.data.logs);
            } catch (error) {
                console.error('Error loading admin data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleBlockToggle = async (userId) => {
        try {
            await toggleBlockUser(userId);
            const [usersRes, logsRes] = await Promise.all([fetchAllUsers(), fetchAuditLogs()]);
            setUsers(usersRes.data.users);
            setAuditLogs(logsRes.data.logs);
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportDonations();
        } catch (error) {
            alert('Export failed. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div style={{ ...styles.container, padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
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
            <div className="card" style={{ marginTop: '2rem', padding: '2rem' }}>
                <Skeleton height="500px" />
            </div>
        </div>
    );

    const kpis = analytics ? [
        { label: 'Verified Donors', value: analytics.totalDonors, sub: 'Active contributors', icon: <Users size={20}/>, color: 'var(--primary)', trend: '+4.2%' },
        { label: 'Live Campaigns', value: analytics.totalCampaigns, sub: `${analytics.pendingCampaigns} pending`, icon: <Megaphone size={20}/>, color: 'var(--success)', trend: '+2' },
        { label: 'Partner NGOs', value: analytics.totalNGOs, sub: `${analytics.pendingNGOs} new apps`, icon: <ShieldCheck size={20}/>, color: 'var(--warning)', trend: '+1' },
        { label: 'Monthly Revenue', value: `₹${analytics.monthlyAmount.toLocaleString()}`, sub: `${analytics.monthlyCount} donations`, icon: <TrendingUp size={20}/>, color: 'var(--primary)', trend: `${analytics.monthlyGrowth}%` }
    ] : [];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.container}
        >
            <header style={styles.header}>
                <div style={styles.headerTitle}>
                    <div style={styles.headerBadge}><LayoutDashboard size={14}/> System Admin</div>
                    <h1 style={styles.title}>Platform <span className="gradient-text">Overview</span></h1>
                    <p style={styles.subtitle}>Enterprise management console for CrowdHelp platform.</p>
                </div>
                <div style={styles.headerActions}>
                    <button onClick={handleExport} disabled={exporting} className="btn btn-secondary">
                        <Download size={18} /> {exporting ? 'Exporting...' : 'Export Audit Data'}
                    </button>
                    <button className="btn btn-primary">
                        <PlusCircle size={18} /> Add System User
                    </button>
                </div>
            </header>

            {/* KPI Cards */}
            <div style={styles.kpiGrid}>
                {kpis.map((kpi, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="card" 
                        style={styles.kpiCard}
                    >
                        <div style={styles.kpiTop}>
                            <div style={{...styles.iconWrapper, background: `${kpi.color}15`, color: kpi.color}}>
                                {kpi.icon}
                            </div>
                            <span style={{...styles.trend, color: kpi.trend.includes('+') ? 'var(--success)' : 'var(--error)'}}>
                                {kpi.trend} {kpi.trend.includes('+') ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                            </span>
                        </div>
                        <div style={styles.kpiBottom}>
                            <h3 style={styles.kpiValue}>{kpi.value}</h3>
                            <p style={styles.kpiLabel}>{kpi.label}</p>
                            <p style={styles.kpiSub}>{kpi.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabContainer}>
                <div style={styles.tabs}>
                    {[
                        { id: 'overview', label: 'Overview', icon: <Activity size={18}/> },
                        { id: 'users', label: 'User Management', icon: <Users size={18}/> },
                        { id: 'donations', label: 'Financials', icon: <IndianRupee size={18}/> },
                        { id: 'audit', label: 'Security Logs', icon: <ShieldCheck size={18}/> }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                ...styles.tabItem,
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                                borderBottomColor: activeTab === tab.id ? 'var(--primary)' : 'transparent'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={styles.tabContent}
                >
                    {activeTab === 'overview' && (
                        <div style={styles.overviewGrid}>
                            <div className="card" style={styles.sectionCard}>
                                <div style={styles.sectionHeader}>
                                    <h3 style={styles.sectionTitle}>Performance Trend</h3>
                                    <button style={styles.iconBtn}><MoreVertical size={18}/></button>
                                </div>
                                <div style={styles.chartPlaceholder}>
                                    <p style={{color: 'var(--text-muted)'}}>Revenue chart visualization</p>
                                </div>
                                <div style={styles.statsRow}>
                                    <div style={styles.miniStat}>
                                        <p style={styles.miniLabel}>Weekly Growth</p>
                                        <p style={{...styles.miniValue, color: 'var(--success)'}}>+14.2%</p>
                                    </div>
                                    <div style={styles.miniStat}>
                                        <p style={styles.miniLabel}>Active Sessions</p>
                                        <p style={styles.miniValue}>1,284</p>
                                    </div>
                                    <div style={styles.miniStat}>
                                        <p style={styles.miniLabel}>Conv. Rate</p>
                                        <p style={styles.miniValue}>3.8%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card" style={styles.sectionCard}>
                                <div style={styles.sectionHeader}>
                                    <h3 style={styles.sectionTitle}>Critical Alerts</h3>
                                    <span style={styles.alertCount}>2 New</span>
                                </div>
                                <div style={styles.alertList}>
                                    <div style={styles.alertItem}>
                                        <div style={{...styles.alertIcon, color: 'var(--error)'}}><AlertCircle size={18}/></div>
                                        <div>
                                            <p style={styles.alertTitle}>NGO "Save Earth" failed verification</p>
                                            <p style={styles.alertTime}>15 mins ago</p>
                                        </div>
                                    </div>
                                    <div style={styles.alertItem}>
                                        <div style={{...styles.alertIcon, color: 'var(--warning)'}}><AlertCircle size={18}/></div>
                                        <div>
                                            <p style={styles.alertTitle}>Large donation of ₹1.5L needs review</p>
                                            <p style={styles.alertTime}>1 hour ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.divider}></div>
                                <h3 style={{...styles.sectionTitle, marginTop: '1.5rem'}}>Top Performing NGOs</h3>
                                <div style={styles.ngoList}>
                                    {analytics?.campaignStats.slice(0, 3).map(camp => (
                                        <div key={camp._id} style={styles.ngoItem}>
                                            <div style={styles.ngoAvatar}>{camp.title[0]}</div>
                                            <div style={{flex: 1}}>
                                                <p style={styles.ngoName}>{camp.title}</p>
                                                <div style={styles.ngoProgress}>
                                                    <div style={{...styles.ngoFill, width: `${Math.min((camp.currentAmount / camp.goalAmount) * 100, 100)}%`}}></div>
                                                </div>
                                            </div>
                                            <span style={styles.ngoValue}>₹{camp.currentAmount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="card" style={styles.sectionCard}>
                            <div style={styles.tableTop}>
                                <div style={styles.searchWrapper}>
                                    <Search size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search users by name, email or role..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={styles.searchInput}
                                    />
                                </div>
                                <div style={styles.tableFilters}>
                                    <button style={styles.filterBtn}><Filter size={16}/> Filter</button>
                                </div>
                            </div>
                            
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Member</th>
                                            <th>Account Status</th>
                                            <th>Role</th>
                                            <th>Last Login</th>
                                            <th>Security</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(u => (
                                            <tr key={u._id} style={styles.tr}>
                                                <td>
                                                    <div style={styles.userCell}>
                                                        <div style={styles.userAvatarSmall}>{u.name[0]}</div>
                                                        <div>
                                                            <p style={styles.userName}>{u.name}</p>
                                                            <p style={styles.userEmail}>{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        backgroundColor: u.isBlocked ? 'rgba(234, 67, 53, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                                                        color: u.isBlocked ? 'var(--error)' : 'var(--success)'
                                                    }}>
                                                        {u.isBlocked ? 'Blocked' : 'Active'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={styles.roleBadge}>{u.role}</span>
                                                </td>
                                                <td>{new Date().toLocaleDateString()}</td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleBlockToggle(u._id)}
                                                        style={{...styles.actionBtn, color: u.isBlocked ? 'var(--success)' : 'var(--error)'}}
                                                    >
                                                        {u.isBlocked ? <Unlock size={18}/> : <Lock size={18}/>}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'donations' && (
                        <div className="card" style={styles.sectionCard}>
                            <h3 style={styles.sectionTitle}>Transaction History</h3>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Donor</th>
                                            <th>Campaign</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.map(d => (
                                            <tr key={d._id} style={styles.tr}>
                                                <td>
                                                    <div style={styles.userCell}>
                                                        <div>
                                                            <p style={styles.userName}>{d.donorName}</p>
                                                            <p style={styles.userEmail}>{d.donorEmail}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{d.campaignId?.title || 'General'}</td>
                                                <td>₹{d.amount.toLocaleString()}</td>
                                                <td>
                                                    <span style={{ 
                                                        ...styles.statusBadge, 
                                                        backgroundColor: d.status === 'completed' ? 'rgba(52, 168, 83, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                                                        color: d.status === 'completed' ? 'var(--success)' : 'var(--warning)'
                                                    }}>
                                                        {d.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <div className="card" style={styles.sectionCard}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>System Security Audit Logs</h3>
                            </div>
                            <div style={styles.auditList}>
                                {auditLogs.map(log => (
                                    <div key={log._id} style={styles.auditItem}>
                                        <div style={styles.auditIcon}><Activity size={16}/></div>
                                        <div style={styles.auditMain}>
                                            <p style={styles.auditAction}>{log.action.replace(/_/g, ' ')}</p>
                                            <p style={styles.auditDetails}>{log.details}</p>
                                            <p style={styles.auditMeta}>
                                                <strong>{log.performedBy?.name || 'System'}</strong> • {new Date(log.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div style={styles.auditTag}>{log.action.split('_')[0]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem 0 4rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerTitle: { textAlign: 'left' },
    headerBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' },
    title: { fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '1rem' },
    headerActions: { display: 'flex', gap: '1rem' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' },
    kpiCard: { padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    kpiTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    iconWrapper: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    trend: { fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.2rem' },
    kpiBottom: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    kpiValue: { fontSize: '1.75rem', fontWeight: '800', margin: 0 },
    kpiLabel: { fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 },
    kpiSub: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 },
    tabContainer: { borderBottom: '1px solid var(--border)' },
    tabs: { display: 'flex', gap: '2rem' },
    tabItem: { background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '1rem 0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s' },
    tabContent: { marginTop: '0.5rem' },
    overviewGrid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' },
    sectionCard: { padding: '1.75rem' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: '800', margin: 0 },
    chartPlaceholder: { height: '240px', background: 'var(--glass)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' },
    statsRow: { display: 'flex', justifyContent: 'space-around', padding: '1rem', background: 'var(--glass)', borderRadius: '16px' },
    miniStat: { textAlign: 'center' },
    miniLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' },
    miniValue: { fontSize: '1.1rem', fontWeight: '800' },
    alertCount: { background: 'var(--error)', color: '#fff', fontSize: '0.7rem', fontWeight: '800', padding: '0.25rem 0.6rem', borderRadius: '100px' },
    alertList: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    alertItem: { display: 'flex', gap: '1rem', alignItems: 'flex-start' },
    alertIcon: { width: '36px', height: '36px', background: 'var(--glass)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    alertTitle: { fontSize: '0.9rem', fontWeight: '600', margin: 0, lineHeight: '1.4' },
    alertTime: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 },
    divider: { height: '1px', background: 'var(--border)', margin: '1.5rem 0' },
    ngoList: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    ngoItem: { display: 'flex', alignItems: 'center', gap: '1rem' },
    ngoAvatar: { width: '36px', height: '36px', background: 'var(--glass-heavy)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--primary)' },
    ngoName: { fontSize: '0.9rem', fontWeight: '700', margin: 0 },
    ngoProgress: { height: '6px', background: 'var(--glass)', borderRadius: '10px', marginTop: '0.4rem', overflow: 'hidden' },
    ngoFill: { height: '100%', background: 'var(--gradient-main)', borderRadius: '10px' },
    ngoValue: { fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)' },
    tableTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    searchWrapper: { position: 'relative', flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center' },
    searchInput: { paddingLeft: '3rem', background: 'var(--glass)', borderRadius: '14px' },
    tableFilters: { display: 'flex', gap: '1rem' },
    filterBtn: { background: 'var(--glass)', border: '1px solid var(--border)', padding: '0.75rem 1.25rem', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.2s' },
    userCell: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' },
    userAvatarSmall: { width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '800' },
    userName: { fontWeight: '700', fontSize: '0.95rem', margin: 0 },
    userEmail: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 },
    statusBadge: { padding: '0.35rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800' },
    roleBadge: { padding: '0.35rem 0.8rem', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'all 0.2s' },
    auditList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    auditItem: { display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--glass)' },
    auditIcon: { width: '40px', height: '40px', background: 'var(--bg-dark)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 },
    auditMain: { flex: 1 },
    auditAction: { fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, textTransform: 'capitalize' },
    auditDetails: { fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0' },
    auditMeta: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 },
    auditTag: { fontSize: '0.65rem', fontWeight: '800', padding: '0.25rem 0.6rem', background: 'var(--glass-heavy)', borderRadius: '6px', color: 'var(--text-muted)', textTransform: 'uppercase' }
};

export default AdminDashboard;
