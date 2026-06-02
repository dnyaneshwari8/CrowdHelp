import React, { useState, useEffect } from 'react';
import { 
    Bell, 
    CheckCircle2, 
    XCircle, 
    IndianRupee, 
    AlertCircle,
    Check,
    Trash2,
    Megaphone,
    Clock,
    ShieldCheck,
    Heart,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/Spinner';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });

    const fetchNotifications = async (page = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/notifications?page=${page}&limit=15`);
            setNotifications(res.data.data.notifications);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all read:', error);
        }
    };

    const deleteNotification = async (id, e) => {
        e.stopPropagation();
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'DONATION_SUCCESS':
            case 'NEW_DONATION_RECEIVED':
                return <IndianRupee size={24} color="#22c55e"/>;
            case 'CAMPAIGN_APPROVED':
            case 'NGO_APPLICATION_APPROVED':
                return <CheckCircle2 size={24} color="#22c55e"/>;
            case 'CAMPAIGN_REJECTED':
            case 'NGO_APPLICATION_REJECTED':
                return <XCircle size={24} color="#ef4444"/>;
            case 'GOAL_ACHIEVED':
            case 'CAMPAIGN_COMPLETED':
                return <Megaphone size={24} color="#8b5cf6"/>;
            case 'FAVORITE_SAVED':
                return <Heart size={24} color="#ec4899"/>;
            case 'RECEIPT_GENERATED':
            case 'CERTIFICATE_GENERATED':
                return <ShieldCheck size={24} color="#3b82f6"/>;
            default:
                return <Bell size={24} color="#94a3b8"/>;
        }
    };

    if (loading && pagination.page === 1) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>All Notifications</h1>
                    <p style={styles.subtitle}>Stay updated with your account activity</p>
                </div>
                <div style={styles.actions}>
                    <button style={styles.actionBtn} onClick={markAllRead}>
                        <Check size={18}/> Mark all as read
                    </button>
                </div>
            </div>

            <div style={styles.notificationList}>
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div 
                            key={notif._id} 
                            style={{ 
                                ...styles.notificationItem, 
                                borderLeft: notif.isRead ? '4px solid transparent' : '4px solid #22c55e',
                                background: notif.isRead ? '#1e293b' : 'rgba(34, 197, 94, 0.05)'
                            }}
                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                        >
                            <div style={styles.iconWrapper}>
                                {getIcon(notif.type)}
                            </div>
                            <div style={styles.content}>
                                <div style={styles.notifHeader}>
                                    <h3 style={{ 
                                        ...styles.notifTitle, 
                                        fontWeight: notif.isRead ? '500' : '700',
                                        color: notif.isRead ? '#cbd5e1' : 'white'
                                    }}>
                                        {notif.title}
                                    </h3>
                                    <div style={styles.meta}>
                                        <span style={styles.notifTime}>
                                            <Clock size={12}/> {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                        <button 
                                            style={styles.deleteBtn} 
                                            onClick={(e) => deleteNotification(notif._id, e)}
                                            title="Delete notification"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                                <p style={{ 
                                    ...styles.notifMessage,
                                    color: notif.isRead ? '#64748b' : '#94a3b8'
                                }}>
                                    {notif.message}
                                </p>
                            </div>
                            {!notif.isRead && <div style={styles.unreadDot} />}
                        </div>
                    ))
                ) : (
                    <div style={styles.empty}>
                        <Bell size={64} style={{ color: '#334155', marginBottom: '1.5rem' }}/>
                        <h2>No notifications yet</h2>
                        <p>We'll notify you when something important happens.</p>
                    </div>
                )}
            </div>

            {pagination.pages > 1 && (
                <div style={styles.pagination}>
                    <button 
                        style={styles.pageBtn} 
                        disabled={pagination.page === 1}
                        onClick={() => fetchNotifications(pagination.page - 1)}
                    >
                        <ChevronLeft size={20}/> Previous
                    </button>
                    <span style={styles.pageInfo}>Page {pagination.page} of {pagination.pages}</span>
                    <button 
                        style={styles.pageBtn} 
                        disabled={pagination.page === pagination.pages}
                        onClick={() => fetchNotifications(pagination.page + 1)}
                    >
                        Next <ChevronRight size={20}/>
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' },
    title: { fontSize: '2rem', fontWeight: '800', color: 'white', margin: '0 0 0.5rem 0' },
    subtitle: { color: '#94a3b8', margin: 0, fontSize: '1rem' },
    actions: { display: 'flex', gap: '1rem' },
    actionBtn: { 
        background: '#1e293b', 
        border: '1px solid #334155', 
        color: '#22c55e', 
        padding: '0.75rem 1.25rem', 
        borderRadius: '12px', 
        fontSize: '0.9rem', 
        fontWeight: '600', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': { background: '#22c55e10' }
    },
    notificationList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    notificationItem: { 
        padding: '1.5rem', 
        borderRadius: '16px', 
        display: 'flex', 
        gap: '1.5rem', 
        alignItems: 'flex-start',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        border: '1px solid #334155',
        ':hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
    },
    iconWrapper: { 
        width: '48px', 
        height: '48px', 
        borderRadius: '14px', 
        background: '#0f172a', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0,
        border: '1px solid #334155'
    },
    content: { flex: 1 },
    notifHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
    notifTitle: { fontSize: '1.1rem', margin: 0 },
    meta: { display: 'flex', alignItems: 'center', gap: '1rem' },
    notifTime: { fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' },
    deleteBtn: { background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', transition: 'color 0.2s', ':hover': { color: '#ef4444' } },
    notifMessage: { fontSize: '1rem', margin: 0, lineHeight: '1.6' },
    unreadDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', position: 'absolute', top: '1.5rem', right: '1.5rem', boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)' },
    empty: { padding: '5rem 2rem', textAlign: 'center', color: '#64748b', background: '#1e293b', borderRadius: '24px', border: '1px dashed #334155' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '3rem' },
    pageBtn: { 
        background: '#1e293b', 
        border: '1px solid #334155', 
        color: 'white', 
        padding: '0.6rem 1.2rem', 
        borderRadius: '10px', 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        ':disabled': { opacity: 0.4, cursor: 'not-allowed' }
    },
    pageInfo: { color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }
};

export default NotificationsPage;
