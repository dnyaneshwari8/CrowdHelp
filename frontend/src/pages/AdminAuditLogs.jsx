import React, { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../services/api';
import Spinner from '../components/Spinner';
import { History, User, Activity, Calendar, Shield } from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Audit Logs</h1>
                <p>Track all administrative actions performed on the platform.</p>
            </div>

            <div className="card" style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Performed By</th>
                            <th>Target</th>
                            <th>Details</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log._id}>
                                <td>
                                    <span style={{
                                        ...styles.actionBadge,
                                        color: log.action.includes('APPROVED') ? '#4CAF50' : log.action.includes('REJECTED') ? '#F44336' : 'var(--primary)'
                                    }}>
                                        {log.action.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td>
                                    <div style={styles.userCell}>
                                        <strong>{log.performedBy?.name}</strong>
                                        <span>{log.performedBy?.role}</span>
                                    </div>
                                </td>
                                <td>{log.targetModel}</td>
                                <td>{log.details}</td>
                                <td>{new Date(log.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && <p style={styles.empty}>No logs found.</p>}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' },
    header: { marginBottom: '3rem' },
    tableCard: { padding: '1rem', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    actionBadge: { fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' },
    userCell: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    empty: { textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }
};

export default AuditLogs;
