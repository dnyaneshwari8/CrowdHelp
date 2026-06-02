import React, { useEffect, useState } from 'react';
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
    ExternalLink
} from 'lucide-react';
import { 
    fetchAllUsers, 
    fetchAllDonations, 
    fetchAdvancedAnalytics, 
    toggleBlockUser, 
    fetchAuditLogs,
    exportDonations 
} from '../services/api';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
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
            const response = await toggleBlockUser(userId);
            // Refresh users and logs
            const [usersRes, logsRes] = await Promise.all([fetchAllUsers(), fetchAuditLogs()]);
            setUsers(usersRes.data.users);
            setAuditLogs(logsRes.data.logs);
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Admin Central</h1>
                    <p style={styles.subtitle}>Manage platform activities and security audit logs.</p>
                </div>
                <button onClick={exportDonations} style={styles.exportBtn}>
                    <Download size={18} />
                    Export CSV
                </button>
            </header>

            {/* Stats Grid */}
            {analytics && (
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.iconWrapper, background: 'rgba(138, 180, 248, 0.1)', color: 'var(--primary)' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <p style={styles.statLabel}>Total Donors</p>
                            <h3 style={styles.statValue}>{analytics.totalDonors}</h3>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.iconWrapper, background: 'rgba(52, 168, 83, 0.1)', color: '#34a853' }}>
                            <Megaphone size={24} />
                        </div>
                        <div>
                            <p style={styles.statLabel}>Active Campaigns</p>
                            <h3 style={styles.statValue}>{analytics.totalCampaigns}</h3>
                            <p style={styles.statChange}>{analytics.pendingCampaigns} pending approval</p>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.iconWrapper, background: 'rgba(251, 188, 4, 0.1)', color: '#fbbc04' }}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p style={styles.statLabel}>Verified NGOs</p>
                            <h3 style={styles.statValue}>{analytics.totalNGOs}</h3>
                            <p style={styles.statChange}>{analytics.pendingNGOs} new applications</p>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.iconWrapper, background: 'rgba(234, 67, 53, 0.1)', color: '#ea4335' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p style={styles.statLabel}>Monthly Growth</p>
                            <h3 style={styles.statValue}>₹{analytics.monthlyAmount.toLocaleString()}</h3>
                            <p style={styles.statChange}>{analytics.monthlyCount} donations this month</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={styles.tabBar}>
                {['overview', 'users', 'donations', 'audit'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            ...styles.tabItem,
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent'
                        }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div style={styles.contentArea}>
                {activeTab === 'overview' && (
                    <div style={styles.overviewGrid}>
                        <div style={styles.sectionCard}>
                            <h3 style={styles.sectionTitle}>Recent Audit Logs</h3>
                            <div style={styles.logList}>
                                {auditLogs.slice(0, 6).map(log => (
                                    <div key={log._id} style={styles.logItem}>
                                        <div style={styles.logIcon}>
                                            <Activity size={16} />
                                        </div>
                                        <div style={styles.logDetails}>
                                            <p style={styles.logAction}>{log.action.replace(/_/g, ' ')}</p>
                                            <p style={styles.logInfo}>{log.details}</p>
                                            <p style={styles.logMeta}>
                                                By {log.performedBy?.name || 'System'} • {new Date(log.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={styles.sectionCard}>
                            <h3 style={styles.sectionTitle}>Top Campaigns</h3>
                            <div style={styles.topCampaignsList}>
                                {analytics?.campaignStats.map(camp => (
                                    <div key={camp._id} style={styles.campaignItem}>
                                        <div style={styles.campInfo}>
                                            <p style={styles.campTitle}>{camp.title}</p>
                                            <p style={styles.campAmount}>₹{camp.currentAmount.toLocaleString()} raised</p>
                                        </div>
                                        <div style={styles.campProgressWrapper}>
                                            <div 
                                                style={{ 
                                                    ...styles.campProgressBar, 
                                                    width: `${Math.min((camp.currentAmount / (camp.goalAmount || 1)) * 100, 100)}%` 
                                                }} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div style={styles.sectionCard}>
                        <div style={styles.tableHeader}>
                            <h3 style={styles.sectionTitle}>User Management</h3>
                            <div style={styles.searchBox}>
                                <Search size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search users..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={styles.searchInput}
                                />
                            </div>
                        </div>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Contact</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u._id}>
                                            <td>
                                                <div style={styles.userNameCell}>
                                                    <div style={styles.avatar}>{u.name[0]}</div>
                                                    <div>
                                                        <p style={styles.userName}>{u.name}</p>
                                                        <p style={styles.userEmail}>{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{u.phone || 'N/A'}</td>
                                            <td>
                                                <span style={{ 
                                                    ...styles.badge, 
                                                    background: u.role === 'ADMIN' ? 'rgba(234, 67, 53, 0.1)' : 'rgba(138, 180, 248, 0.1)',
                                                    color: u.role === 'ADMIN' ? '#ea4335' : 'var(--primary)'
                                                }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ 
                                                    ...styles.badge, 
                                                    background: u.isBlocked ? 'rgba(234, 67, 53, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                                                    color: u.isBlocked ? '#ea4335' : '#34a853'
                                                }}>
                                                    {u.isBlocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleBlockToggle(u._id)}
                                                    style={{ 
                                                        ...styles.iconBtn, 
                                                        color: u.isBlocked ? '#34a853' : '#ea4335',
                                                        background: u.isBlocked ? 'rgba(52, 168, 83, 0.1)' : 'rgba(234, 67, 53, 0.1)'
                                                    }}
                                                    title={u.isBlocked ? 'Unblock User' : 'Block User'}
                                                    disabled={u.role === 'ADMIN'}
                                                >
                                                    {u.isBlocked ? <Unlock size={16}/> : <Lock size={16}/>}
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
                    <div style={styles.sectionCard}>
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
                                        <tr key={d._id}>
                                            <td>
                                                <p style={styles.userName}>{d.donorName}</p>
                                                <p style={styles.userEmail}>{d.donorEmail}</p>
                                            </td>
                                            <td>{d.campaignId?.title || 'General'}</td>
                                            <td>₹{d.amount.toLocaleString()}</td>
                                            <td>
                                                <span style={{ 
                                                    ...styles.badge, 
                                                    background: d.status === 'completed' ? 'rgba(52, 168, 83, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                                                    color: d.status === 'completed' ? '#34a853' : '#fbbc04'
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
                    <div style={styles.sectionCard}>
                        <h3 style={styles.sectionTitle}>Security Audit Logs</h3>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Performed By</th>
                                        <th>Details</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLogs.map(log => (
                                        <tr key={log._id}>
                                            <td>
                                                <span style={styles.logActionBadge}>{log.action}</span>
                                            </td>
                                            <td>
                                                <p style={styles.userName}>{log.performedBy?.name || 'System'}</p>
                                                <p style={styles.userEmail}>{log.performedBy?.role}</p>
                                            </td>
                                            <td>{log.details}</td>
                                            <td>{new Date(log.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '2rem', maxWidth: '1400px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' },
    title: { fontSize: '2rem', marginBottom: '0.5rem' },
    subtitle: { color: 'var(--text-secondary)' },
    exportBtn: { background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' },
    statCard: { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.2rem' },
    iconWrapper: { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statLabel: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' },
    statValue: { fontSize: '1.5rem', fontWeight: 'bold' },
    statChange: { fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' },
    tabBar: { display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' },
    tabItem: { background: 'none', border: 'none', padding: '1rem 0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', transition: 'all 0.2s' },
    contentArea: { minHeight: '400px' },
    overviewGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' },
    sectionCard: { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)' },
    sectionTitle: { fontSize: '1.2rem', marginBottom: '1.5rem' },
    logList: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
    logItem: { display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' },
    logIcon: { width: '32px', height: '32px', borderRadius: '8px', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' },
    logDetails: { flex: 1 },
    logAction: { fontWeight: '600', fontSize: '0.9rem', textTransform: 'capitalize' },
    logInfo: { fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0' },
    logMeta: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' },
    topCampaignsList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    campaignItem: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    campInfo: { display: 'flex', justifyContent: 'space-between' },
    campTitle: { fontWeight: '500', fontSize: '0.95rem' },
    campAmount: { color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600' },
    campProgressWrapper: { height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' },
    campProgressBar: { height: '100%', background: 'var(--primary)', borderRadius: '4px' },
    tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-dark)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', width: '300px' },
    searchInput: { background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    userNameCell: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
    avatar: { width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    userName: { fontWeight: '600', fontSize: '0.95rem' },
    userEmail: { fontSize: '0.85rem', color: 'var(--text-secondary)' },
    badge: { padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' },
    iconBtn: { padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
    logActionBadge: { background: 'var(--glass)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' }
};

export default AdminDashboard;
