import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNotifications, markNotificationsAsRead } from '../services/api';
import { 
    Home, 
    LayoutDashboard, 
    Heart, 
    User as UserIcon, 
    LogOut, 
    Trophy, 
    Users, 
    Megaphone,
    Building2,
    PlusCircle,
    Bell,
    ChevronDown,
    Menu,
    X,
    Settings,
    Shield
} from 'lucide-react';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            loadNotifications();
            // Poll for notifications every 30 seconds
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            const res = await fetchNotifications();
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkAsRead = async () => {
        try {
            await markNotificationsAsRead();
            setUnreadCount(0);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
        setShowNotifications(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Campaigns', path: '/campaigns', icon: <Megaphone size={18}/> },
        { name: 'Wall', path: '/donor-wall', icon: <Users size={18}/> },
        { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18}/> },
    ];

    return (
        <nav style={{
            ...styles.nav,
            backgroundColor: isScrolled ? 'rgba(15, 17, 20, 0.85)' : 'transparent',
            borderBottomColor: isScrolled ? 'var(--border)' : 'transparent',
            padding: isScrolled ? '0.75rem 0' : '1.25rem 0'
        }}>
            <div className="container" style={styles.navContainer}>
                {/* Logo */}
                <Link to="/" style={styles.logo}>
                    <div style={styles.logoIcon}>C</div>
                    <span style={styles.logoText}>CrowdHelp</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="desktop-nav" style={styles.desktopNav}>
                    <ul style={styles.navLinks}>
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link 
                                    to={link.path} 
                                    style={{
                                        ...styles.link,
                                        color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-secondary)'
                                    }}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div style={styles.divider}></div>

                    <div style={styles.actions}>
                        {user ? (
                            <>
                                {/* Notification Bell */}
                                <div style={styles.relative}>
                                    <button 
                                        onClick={() => {
                                            setShowNotifications(!showNotifications);
                                            if (!showNotifications && unreadCount > 0) {
                                                handleMarkAsRead();
                                            }
                                        }}
                                        style={styles.iconBtn}
                                    >
                                        <Bell size={20} />
                                        {unreadCount > 0 && (
                                            <span style={styles.notificationBadge}>{unreadCount}</span>
                                        )}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                style={styles.dropdown}
                                            >
                                                <div style={styles.dropdownHeader}>
                                                    <span>Notifications</span>
                                                    {unreadCount > 0 && (
                                                        <button onClick={handleMarkAsRead} style={styles.markReadBtn}>
                                                            Mark all as read
                                                        </button>
                                                    )}
                                                </div>
                                                <div style={styles.notificationList}>
                                                    {notifications.length > 0 ? (
                                                        notifications.map(n => (
                                                            <div key={n._id} style={{
                                                                ...styles.dropdownItem,
                                                                opacity: n.isRead ? 0.7 : 1,
                                                                borderLeft: n.isRead ? 'none' : '3px solid var(--primary)'
                                                            }}>
                                                                <div style={styles.notifTitle}>{n.title}</div>
                                                                <div style={styles.notifMsg}>{n.message}</div>
                                                                <div style={styles.notifTime}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div style={styles.emptyNotif}>No notifications yet</div>
                                                    )}
                                                </div>
                                                <Link to="/notifications" style={styles.viewAll}>View All Notifications</Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* User Profile */}
                                <div style={styles.relative}>
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        style={styles.profileBtn}
                                    >
                                        <div style={styles.avatar}>
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        <ChevronDown size={16} />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                style={styles.profileDropdown}
                                            >
                                                <div style={styles.profileHeader}>
                                                    <p style={styles.profileName}>{user.name}</p>
                                                    <p style={styles.profileEmail}>{user.email}</p>
                                                    <span style={styles.roleBadge}>{user.role}</span>
                                                </div>
                                                
                                                <div style={styles.dropdownDivider}></div>
                                                
                                                {user.role === 'ADMIN' ? (
                                                    <>
                                                        <Link to="/admin" style={styles.dropdownLink}><LayoutDashboard size={16}/> Admin Dashboard</Link>
                                                        <Link to="/admin/audit-logs" style={styles.dropdownLink}><Shield size={16}/> Audit Logs</Link>
                                                    </>
                                                ) : user.role === 'NGO' ? (
                                                    <>
                                                        <Link to="/ngo/dashboard" style={styles.dropdownLink}><LayoutDashboard size={16}/> NGO Dashboard</Link>
                                                        <Link to="/ngo/my-campaigns" style={styles.dropdownLink}><PlusCircle size={16}/> My Campaigns</Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link to="/profile" style={styles.dropdownLink}><UserIcon size={16}/> My Profile</Link>
                                                        <Link to="/favorites" style={styles.dropdownLink}><Heart size={16}/> Favorites</Link>
                                                    </>
                                                )}
                                                
                                                <div style={styles.dropdownDivider}></div>
                                                <button onClick={logoutUser} style={styles.logoutBtnFull}>
                                                    <LogOut size={16}/> Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div style={styles.authButtons}>
                                <Link to="/login" style={styles.loginLink}>Log In</Link>
                                <Link to="/register" className="btn btn-primary">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-toggle"
                    style={styles.mobileToggle} 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={styles.mobileMenu}
                    >
                        <ul style={styles.mobileNavLinks}>
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} style={styles.mobileLink}>{link.name}</Link>
                                </li>
                            ))}
                            {user ? (
                                <>
                                    <div style={styles.dropdownDivider}></div>
                                    <li><Link to="/profile" style={styles.mobileLink}>My Profile</Link></li>
                                    <li><button onClick={logoutUser} style={styles.mobileLogout}>Logout</button></li>
                                </>
                            ) : (
                                <>
                                    <div style={styles.dropdownDivider}></div>
                                    <li><Link to="/login" style={styles.mobileLink}>Login</Link></li>
                                    <li><Link to="/register" style={styles.mobileLink}>Register</Link></li>
                                </>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const styles = {
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid transparent',
        transition: 'all 0.3s ease'
    },
    navContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        color: 'var(--text-primary)'
    },
    logoIcon: {
        width: '32px',
        height: '32px',
        background: 'var(--gradient-main)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        fontWeight: '900',
        fontSize: '1.2rem'
    },
    logoText: {
        fontSize: '1.25rem',
        fontWeight: '800',
        letterSpacing: '-0.02em'
    },
    desktopNav: {
        alignItems: 'center',
        gap: '2rem'
    },
    navLinks: {
        display: 'flex',
        listStyle: 'none',
        gap: '2rem'
    },
    link: {
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'color 0.2s'
    },
    divider: {
        width: '1px',
        height: '24px',
        backgroundColor: 'var(--border)'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
    },
    iconBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '10px',
        transition: 'all 0.2s',
        position: 'relative'
    },
    dropdown: {
        position: 'absolute',
        top: 'calc(100% + 1rem)',
        right: 0,
        width: '320px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        zIndex: 1000
    },
    dropdownHeader: {
        padding: '1.25rem',
        borderBottom: '1px solid var(--border)',
        fontWeight: '800',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-muted)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    markReadBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--primary)',
        fontSize: '0.75rem',
        fontWeight: '700',
        cursor: 'pointer',
        padding: 0
    },
    notificationList: {
        maxHeight: '360px',
        overflowY: 'auto'
    },
    dropdownItem: {
        padding: '1.25rem',
        borderBottom: '1px solid var(--border)',
        transition: 'all 0.2s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem'
    },
    notifTitle: {
        fontWeight: '700',
        fontSize: '0.9rem',
        color: 'var(--text-primary)'
    },
    notifMsg: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4'
    },
    notifTime: {
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        marginTop: '0.2rem'
    },
    emptyNotif: {
        padding: '3rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
    },
    viewAll: {
        display: 'block',
        padding: '1rem',
        textAlign: 'center',
        textDecoration: 'none',
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--primary)',
        background: 'rgba(138, 180, 248, 0.05)',
        transition: 'all 0.2s'
    },
    relative: {
        position: 'relative'
    },
    notificationBadge: {
        position: 'absolute',
        top: '2px',
        right: '2px',
        width: '16px',
        height: '16px',
        background: 'var(--error)',
        color: '#fff',
        fontSize: '0.65rem',
        fontWeight: '800',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid var(--bg-dark)'
    },
    profileBtn: {
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        padding: '0.4rem 0.6rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        color: 'var(--text-secondary)'
    },
    avatar: {
        width: '28px',
        height: '28px',
        background: 'var(--primary)',
        borderRadius: '8px',
        color: '#000',
        fontWeight: '700',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    relative: { position: 'relative' },
    dropdown: {
        position: 'absolute',
        top: '120%',
        right: 0,
        width: '300px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-xl)'
    },
    dropdownHeader: { fontWeight: '800', fontSize: '1.1rem', marginBottom: '1rem' },
    dropdownItem: { fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' },
    viewAll: { display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' },
    profileDropdown: {
        position: 'absolute',
        top: '120%',
        right: 0,
        width: '240px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '0.75rem',
        boxShadow: 'var(--shadow-xl)'
    },
    profileHeader: { padding: '1rem' },
    profileName: { fontWeight: '800', fontSize: '1rem', marginBottom: '0.2rem' },
    profileEmail: { fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' },
    roleBadge: { fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: '100px', background: 'var(--primary)', color: '#000', fontWeight: '800' },
    dropdownDivider: { height: '1px', backgroundColor: 'var(--border)', margin: '0.5rem 0' },
    dropdownLink: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '12px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s', fontSize: '0.9rem', fontWeight: '600' },
    logoutBtnFull: { width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '12px', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' },
    authButtons: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    loginLink: { color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' },
    mobileToggle: { background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' },
    mobileMenu: { position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '1.5rem', zIndex: 999 },
    mobileNavLinks: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' },
    mobileLink: { textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600', display: 'block', padding: '0.5rem 0' },
    mobileLogout: { background: 'none', border: 'none', color: 'var(--error)', fontSize: '1.1rem', fontWeight: '600', padding: '0.5rem 0', cursor: 'pointer' }
};

export default Navbar;
