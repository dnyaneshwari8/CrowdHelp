import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    PlusCircle, 
    Megaphone, 
    IndianRupee, 
    BarChart3, 
    ChevronRight,
    Menu,
    X,
    Bell,
    FileText,
    RefreshCw,
    Settings,
    LogOut as LogoutIcon
} from 'lucide-react';

const NGOLayout = () => {
    const { user, logoutUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { path: '/ngo/dashboard', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
        { path: '/ngo/create-campaign', icon: <PlusCircle size={20}/>, label: 'Create Campaign' },
        { path: '/ngo/my-campaigns', icon: <Megaphone size={20}/>, label: 'My Campaigns' },
        { path: '/ngo/donations', icon: <IndianRupee size={20}/>, label: 'Donations Received' },
        { path: '/ngo/analytics', icon: <BarChart3 size={20}/>, label: 'Analytics' },
        { path: '/ngo/updates', icon: <RefreshCw size={20}/>, label: 'Campaign Updates' },
        { path: '/ngo/documents', icon: <FileText size={20}/>, label: 'Documents' },
        { path: '/ngo/notifications', icon: <Bell size={20}/>, label: 'Notifications' },
        { path: '/ngo/profile', icon: <Settings size={20}/>, label: 'NGO Profile' }
    ];

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={{
                ...styles.sidebar,
                left: isMobile ? (isMobileMenuOpen ? '0' : '-280px') : '0',
            }}>
                <div style={styles.sidebarHeader}>
                    <div style={styles.logoIcon}>N</div>
                    <h3 style={styles.logoText}>NGO Dashboard</h3>
                </div>
                <nav style={styles.nav}>
                    {menuItems.map(item => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{
                                ...styles.navLink,
                                backgroundColor: location.pathname === item.path ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                                color: location.pathname === item.path ? '#22c55e' : '#94a3b8'
                            }}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {location.pathname === item.path && <ChevronRight size={16} style={styles.activeIndicator}/>}
                        </Link>
                    ))}
                </nav>
                <div style={styles.sidebarFooter}>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <LogoutIcon size={20}/>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{
                ...styles.mainWrapper,
                marginLeft: isMobile ? '0' : '280px'
            }}>
                {/* Top Navbar */}
                <header style={styles.topNavbar}>
                    <div style={styles.headerLeft}>
                        {isMobile && (
                            <button style={styles.mobileToggle} onClick={toggleMobileMenu}>
                                <Menu size={24}/>
                            </button>
                        )}
                        <h2 style={styles.pageTitle}>
                            {menuItems.find(item => item.path === location.pathname)?.label || 'NGO Panel'}
                        </h2>
                    </div>
                    <div style={styles.headerRight}>
                        <Link to="/ngo/notifications" style={styles.iconBtn}>
                            <Bell size={20}/>
                            <span style={styles.badge}></span>
                        </Link>
                        <div style={styles.userProfile}>
                            {!isMobile && (
                                <div style={styles.userInfo}>
                                    <span style={styles.userName}>{user?.organizationName || user?.name}</span>
                                    <span style={styles.userRole}>Approved NGO</span>
                                </div>
                            )}
                            <img 
                                src={user?.organizationLogo || 'https://placehold.co/40'} 
                                alt="NGO Logo" 
                                style={styles.userAvatar}
                                onClick={() => navigate('/ngo/profile')}
                            />
                        </div>
                    </div>
                </header>

                <main style={styles.mainContent}>
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile */}
            {isMobile && isMobileMenuOpen && (
                <div style={styles.overlay} onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#0f172a' },
    sidebar: { 
        width: '280px', 
        background: '#1e293b', 
        borderRight: '1px solid #334155', 
        padding: '1.5rem 1rem', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'fixed',
        top: 0,
        bottom: 0,
        zIndex: 1001,
        transition: 'left 0.3s ease'
    },
    sidebarHeader: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        padding: '0 1rem', 
        marginBottom: '2.5rem' 
    },
    logoIcon: {
        width: '32px',
        height: '32px',
        background: '#22c55e',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem'
    },
    logoText: { fontSize: '1.1rem', fontWeight: '700', color: 'white' },
    nav: { display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 },
    navLink: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.85rem', 
        padding: '0.85rem 1rem', 
        borderRadius: '10px', 
        textDecoration: 'none', 
        transition: 'all 0.2s ease', 
        position: 'relative',
        fontSize: '0.95rem'
    },
    activeIndicator: { position: 'absolute', right: '1rem' },
    sidebarFooter: { marginTop: 'auto', padding: '1rem 0' },
    logoutBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.85rem 1rem',
        borderRadius: '10px',
        background: 'transparent',
        border: 'none',
        color: '#f87171',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '0.95rem'
    },
    mainWrapper: { flex: 1, display: 'flex', flexDirection: 'column' },
    topNavbar: {
        height: '70px',
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
    mobileToggle: { 
        background: 'transparent', 
        border: 'none', 
        color: 'white', 
        cursor: 'pointer',
        padding: '0',
        display: 'flex',
        alignItems: 'center'
    },
    pageTitle: { fontSize: '1.25rem', fontWeight: '600', color: 'white' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    iconBtn: { 
        position: 'relative', 
        color: '#94a3b8', 
        background: 'transparent', 
        border: 'none', 
        cursor: 'pointer' 
    },
    badge: {
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: '8px',
        height: '8px',
        background: '#ef4444',
        borderRadius: '50%',
        border: '2px solid #1e293b'
    },
    userProfile: { display: 'flex', alignItems: 'center', gap: '1rem' },
    userInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' },
    userName: { color: 'white', fontWeight: '500', fontSize: '0.9rem' },
    userRole: { color: '#64748b', fontSize: '0.75rem' },
    userAvatar: { 
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        border: '2px solid #334155',
        objectFit: 'cover',
        cursor: 'pointer'
    },
    mainContent: { padding: '2rem', background: '#0f172a', minHeight: 'calc(100vh - 70px)' },
    overlay: { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(0,0,0,0.5)', 
        zIndex: 1000 
    }
};

export default NGOLayout;
