import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAllSupportMessages, updateSupportMessageStatus } from '../services/api';
import { 
    MessageSquare, 
    CheckCircle, 
    Clock, 
    AlertCircle,
    User,
    Mail,
    Calendar,
    Search,
    Filter
} from 'lucide-react';

const AdminSupport = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const res = await fetchAllSupportMessages();
            setMessages(res.data.messages);
        } catch (error) {
            console.error('Error loading support messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateSupportMessageStatus(id, newStatus);
            loadMessages();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesFilter = filter === 'ALL' || msg.status === filter;
        const matchesSearch = 
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'RESOLVED': return <CheckCircle size={16} color="var(--success)" />;
            case 'IN_PROGRESS': return <Clock size={16} color="var(--warning)" />;
            default: return <AlertCircle size={16} color="var(--info)" />;
        }
    };

    if (loading) return <div style={styles.container}>Loading messages...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Support <span className="gradient-text">Messages</span></h1>
                <p style={styles.subtitle}>Manage and respond to user inquiries and support requests.</p>
            </div>

            <div style={styles.controls}>
                <div style={styles.searchBox}>
                    <Search size={20} color="var(--text-secondary)" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or subject..." 
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={styles.filters}>
                    <Filter size={18} color="var(--text-secondary)" />
                    {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'].map(f => (
                        <button 
                            key={f}
                            style={{
                                ...styles.filterBtn,
                                background: filter === f ? 'var(--primary)' : 'var(--bg-surface)',
                                color: filter === f ? 'white' : 'var(--text-secondary)'
                            }}
                            onClick={() => setFilter(f)}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.messageList}>
                {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
                    <motion.div 
                        key={msg._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={styles.messageCard}
                    >
                        <div style={styles.cardHeader}>
                            <div style={styles.userInfo}>
                                <div style={styles.avatar}>
                                    <User size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <h4 style={styles.userName}>{msg.name}</h4>
                                    <p style={styles.userEmail}><Mail size={12} /> {msg.email}</p>
                                </div>
                            </div>
                            <div style={styles.metaInfo}>
                                <span style={styles.date}><Calendar size={12} /> {new Date(msg.createdAt).toLocaleDateString()}</span>
                                <div style={{
                                    ...styles.statusBadge,
                                    background: msg.status === 'RESOLVED' ? 'rgba(52, 168, 83, 0.1)' : 
                                               msg.status === 'IN_PROGRESS' ? 'rgba(251, 188, 4, 0.1)' : 'rgba(66, 133, 244, 0.1)',
                                    color: msg.status === 'RESOLVED' ? '#34a853' : 
                                           msg.status === 'IN_PROGRESS' ? '#fbbc04' : '#4285f4'
                                }}>
                                    {getStatusIcon(msg.status)}
                                    {msg.status}
                                </div>
                            </div>
                        </div>
                        
                        <div style={styles.cardBody}>
                            <h3 style={styles.subject}>{msg.subject}</h3>
                            <p style={styles.messageText}>{msg.message}</p>
                        </div>

                        <div style={styles.cardFooter}>
                            <div style={styles.actions}>
                                {msg.status !== 'IN_PROGRESS' && msg.status !== 'RESOLVED' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(msg._id, 'IN_PROGRESS')}
                                        style={styles.actionBtn}
                                    >
                                        Mark In Progress
                                    </button>
                                )}
                                {msg.status !== 'RESOLVED' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(msg._id, 'RESOLVED')}
                                        style={{...styles.actionBtn, background: 'var(--success)', color: 'white'}}
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                                <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} style={styles.replyBtn}>
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div style={styles.emptyState}>
                        <MessageSquare size={48} color="var(--text-secondary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>No support messages found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingTop: '100px' },
    header: { marginBottom: '2.5rem' },
    title: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '1.1rem' },
    controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '2rem' },
    searchBox: { 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        background: 'var(--bg-surface)', 
        padding: '0.75rem 1.25rem', 
        borderRadius: '12px',
        border: '1px solid var(--border)'
    },
    searchInput: { background: 'none', border: 'none', color: 'white', flex: 1, fontSize: '1rem', outline: 'none' },
    filters: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    filterBtn: { 
        padding: '0.5rem 1rem', 
        borderRadius: '8px', 
        border: '1px solid var(--border)', 
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.2s'
    },
    messageList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    messageCard: { 
        background: 'var(--bg-surface)', 
        borderRadius: '20px', 
        border: '1px solid var(--border)', 
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
    userInfo: { display: 'flex', gap: '1rem', alignItems: 'center' },
    avatar: { 
        width: '44px', 
        height: '44px', 
        borderRadius: '12px', 
        background: 'rgba(66, 133, 244, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    userName: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.1rem' },
    userEmail: { color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    metaInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' },
    date: { fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    statusBadge: { 
        padding: '0.35rem 0.75rem', 
        borderRadius: '20px', 
        fontSize: '0.75rem', 
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        textTransform: 'uppercase'
    },
    cardBody: { marginBottom: '1.5rem' },
    subject: { fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--primary)' },
    messageText: { color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' },
    cardFooter: { borderTop: '1px solid var(--border)', paddingTop: '1.25rem' },
    actions: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
    actionBtn: { 
        padding: '0.6rem 1.25rem', 
        borderRadius: '10px', 
        border: '1px solid var(--border)', 
        background: 'var(--bg-dark)', 
        color: 'white',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    replyBtn: { 
        padding: '0.6rem 1.25rem', 
        borderRadius: '10px', 
        background: 'var(--primary)', 
        color: 'white',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '600',
        display: 'inline-block'
    },
    emptyState: { textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }
};

export default AdminSupport;
