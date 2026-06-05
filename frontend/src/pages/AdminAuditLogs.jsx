import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAuditLogs } from '../services/api';
import Spinner from '../components/Spinner';
import { 
    History, 
    User, 
    Activity, 
    Calendar, 
    Shield, 
    Search,
    Filter,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    UserMinus,
    UserPlus,
    AlertCircle
} from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const res = await fetchAuditLogs();
                setLogs(res.data.logs);
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };
        loadLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.performedBy?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionIcon = (action) => {
        if (action.includes('APPROVED')) return <CheckCircle2 size={16} color="var(--success)" />;
        if (action.includes('REJECTED')) return <XCircle size={16} color="var(--danger)" />;
        if (action.includes('BLOCKED')) return <UserMinus size={16} color="var(--danger)" />;
        if (action.includes('ACTIVATED')) return <UserPlus size={16} color="var(--success)" />;
        return <Activity size={16} color="var(--primary)" />;
    };

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerTitle}>
                    <div style={styles.iconBox}>
                        <History size={24} color="var(--primary)" />
                    </div>
                    <div>
                        <h1 style={styles.title}>System Audit Logs</h1>
                        <p style={styles.subtitle}>Track all administrative actions and security events.</p>
                    </div>
                </div>

                <div style={styles.controls}>
                    <div style={styles.searchBox}>
                        <Search size={18} style={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card" 
                style={styles.tableCard}
            >
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Event Type</th>
                                <th>Admin</th>
                                <th>Target</th>
                                <th>Action Details</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log, index) => (
                                <motion.tr 
                                    key={log._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={styles.row}
                                >
                                    <td>
                                        <div style={styles.actionCell}>
                                            {getActionIcon(log.action)}
                                            <span style={styles.actionText}>{log.action.replace(/_/g, ' ')}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={styles.userCell}>
                                            <span style={styles.userName}>{log.performedBy?.name}</span>
                                            <span style={styles.userRole}>{log.performedBy?.role}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={styles.targetBadge}>
                                            {log.targetModel}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={styles.detailsCell}>
                                            {log.details}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={styles.dateCell}>
                                            <Calendar size={14} color="var(--text-muted)" />
                                            <span>{new Date(log.createdAt).toLocaleString()}</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredLogs.length === 0 && (
                    <div style={styles.emptyState}>
                        <AlertCircle size={48} color="var(--text-muted)" />
                        <h3>No matching logs found</h3>
                        <p>Try adjusting your search terms.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1400px', margin: '2rem auto', padding: '0 2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' },
    headerTitle: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    iconBox: { width: '56px', height: '56px', background: 'var(--glass)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' },
    title: { fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '1rem' },
    controls: { display: 'flex', gap: '1rem' },
    searchBox: { position: 'relative', display: 'flex', alignItems: 'center' },
    searchIcon: { position: 'absolute', left: '1.25rem', color: 'var(--text-muted)' },
    searchInput: { padding: '0.8rem 1rem 0.8rem 3.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', width: '300px', fontSize: '0.95rem' },
    tableCard: { padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    row: { borderBottom: '1px solid var(--border)', transition: 'background 0.2s' },
    actionCell: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem' },
    actionText: { fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.02em' },
    userCell: { display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '1.5rem' },
    userName: { fontWeight: '600', color: 'var(--text-primary)' },
    userRole: { fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' },
    targetBadge: { display: 'inline-block', padding: '0.4rem 0.8rem', background: 'var(--glass)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' },
    detailsCell: { fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '1.5rem', maxWidth: '400px' },
    dateCell: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1.5rem' },
    emptyState: { textAlign: 'center', padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }
};

export default AuditLogs;
