import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Bell, 
    Check, 
    Trash2, 
    Clock, 
    ExternalLink,
    Megaphone,
    IndianRupee,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Heart,
    Mail
} from 'lucide-react';
import { fetchNGONotifications, markNotificationRead } from '../services/api';
import api from '../services/api';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/notifications?limit=5');
            setNotifications(res.data.data.notifications);
            
            const countRes = await api.get('/notifications/unread-count');
            setUnreadCount(countRes.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 1 minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkRead = async (id, e) => {
        e.stopPropagation();
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'DONATION_SUCCESS':
            case 'NEW_DONATION_RECEIVED':
                return <IndianRupee size={16} color="#22c55e"/>;
            case 'CAMPAIGN_APPROVED':
            case 'NGO_APPLICATION_APPROVED':
                return <CheckCircle2 size={16} color="#22c55e"/>;
            case 'CAMPAIGN_REJECTED':
            case 'NGO_APPLICATION_REJECTED':
                return <XCircle size={16} color="#ef4444"/>;
            case 'GOAL_ACHIEVED':
            case 'CAMPAIGN_COMPLETED':
                return <Megaphone size={16} color="#8b5cf6"/>;
            case 'FAVORITE_SAVED':
                return <Heart size={16} color="#ec4899"/>;
            case 'RECEIPT_GENERATED':
            case 'CERTIFICATE_GENERATED':
                return <ShieldCheck size={16} color="#3b82f6"/>;
            default:
                return <Bell size={16} color="#94a3b8"/>;
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div style={styles.container} ref={dropdownRef}>
            <button 
                style={styles.bellBtn} 
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
            </button>

            {isOpen && (
                <div style={styles.dropdown}>
                    <div style={styles.header}>
                        <h3 style={styles.title}>Notifications</h3>
                        {unreadCount > 0 && (
                            <button style={styles.markAllBtn} onClick={handleMarkAllRead}>
                                <Check size={14}/> Mark all read
                            </button>
                        )}
                    </div>

                    <div style={styles.list}>
                        {loading ? (
                            <div style={styles.empty}>Loading...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div 
                                    key={notif._id} 
                                    style={{
                                        ...styles.item,
                                        backgroundColor: notif.isRead ? 'transparent' : 'rgba(34, 197, 94, 0.05)'
                                    }}
                                    onClick={() => {
                                        if (!notif.isRead) handleMarkRead(notif._id, { stopPropagation: () => {} });
                                        setIsOpen(false);
                                        navigate('/notifications');
                                    }}
                                >
                                    <div style={styles.iconWrapper}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div style={styles.content}>
                                        <div style={styles.notifTitle}>{notif.title}</div>
                                        <p style={styles.message}>{notif.message}</p>
                                        <div style={styles.time}>
                                            <Clock size={10}/> {formatTime(notif.createdAt)}
                                        </div>
                                    </div>
                                    {!notif.isRead && (
                                        <button 
                                            style={styles.readDot} 
                                            onClick={(e) => handleMarkRead(notif._id, e)}
                                            title="Mark as read"
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div style={styles.empty}>
                                <Bell size={32} style={{ color: '#334155', marginBottom: '0.5rem' }}/>
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>

                    <Link to="/notifications" style={styles.footer} onClick={() => setIsOpen(false)}>
                        View all notifications <ExternalLink size={14}/>
                    </Link>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { position: 'relative' },
    bellBtn: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        padding: '0.6rem',
        borderRadius: '10px',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        ':hover': { background: 'rgba(255, 255, 255, 0.1)', color: 'var(--primary)' }
    },
    badge: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        background: '#ef4444',
        color: 'white',
        fontSize: '10px',
        fontWeight: 'bold',
        minWidth: '18px',
        height: '18px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #0f1114',
        padding: '0 4px'
    },
    dropdown: {
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '320px',
        background: '#1e293b',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        zIndex: 1001,
        overflow: 'hidden',
        animation: 'slideIn 0.2s ease-out'
    },
    header: {
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.5)'
    },
    title: { fontSize: '0.95rem', fontWeight: '600', color: 'white', margin: 0 },
    markAllBtn: {
        background: 'transparent',
        border: 'none',
        color: '#22c55e',
        fontSize: '0.75rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '6px',
        ':hover': { background: 'rgba(34, 197, 94, 0.1)' }
    },
    list: { maxHeight: '380px', overflowY: 'auto' },
    item: {
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #334155',
        display: 'flex',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        ':hover': { background: 'rgba(255, 255, 255, 0.02)' }
    },
    iconWrapper: {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    content: { flex: 1, minWidth: 0 },
    notifTitle: { fontSize: '0.85rem', fontWeight: '600', color: 'white', marginBottom: '0.25rem' },
    message: { 
        fontSize: '0.8rem', 
        color: '#94a3b8', 
        margin: 0, 
        lineHeight: '1.4',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    time: { 
        fontSize: '0.7rem', 
        color: '#64748b', 
        marginTop: '0.4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
    },
    readDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#22c55e',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        alignSelf: 'center'
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.85rem',
        background: 'rgba(15, 23, 42, 0.5)',
        color: '#94a3b8',
        textDecoration: 'none',
        fontSize: '0.8rem',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        ':hover': { color: 'white', background: 'rgba(15, 23, 42, 0.8)' }
    },
    empty: {
        padding: '3rem 2rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.85rem'
    }
};

export default NotificationDropdown;
