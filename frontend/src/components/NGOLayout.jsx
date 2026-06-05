import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Megaphone, 
    IndianRupee, 
    BarChart3, 
    User,
    ChevronRight,
    Menu,
    X,
    FileText,
    Bell,
    Settings,
    HelpCircle
} from 'lucide-react';

const NGOLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { path: '/ngo/dashboard', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
        { path: '/ngo/my-campaigns', icon: <Megaphone size={20}/>, label: 'Campaigns' },
        { path: '/ngo/donations', icon: <IndianRupee size={20}/>, label: 'Donations' },
        { path: '/ngo/analytics', icon: <BarChart3 size={20}/>, label: 'Analytics' },
        { path: '/ngo/documents', icon: <FileText size={20}/>, label: 'Documents' },
    ];

    const bottomItems = [
        { path: '/profile', icon: <User size={20}/>, label: 'Profile' },
        { path: '/support', icon: <HelpCircle size={20}/>, label: 'Help & Support' },
    ];

    return (
        <div style={styles.container}>
            {/* Mobile Header Toggle */}
            <div style={styles.mobileHeader}>
                <h3 style={styles.logoText}>CrowdHelp NGO</h3>
                <button style={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </div>

            {/* Sidebar */}
            <aside style={{
                ...styles.sidebar,
                transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
            }} className="ngo-sidebar">
                <div style={styles.sidebarHeader}>
                    <div style={styles.brand}>
                        <div style={styles.logoIcon}>C</div>
                        <h3 style={styles.logoText}>NGO Hub</h3>
                    </div>
                </div>

                <div style={styles.navSection}>
                    <p style={styles.sectionLabel}>Main Menu</p>
                    <nav style={styles.nav}>
                        {menuItems.map(item => (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{
                                    ...styles.navLink,
                                    backgroundColor: location.pathname === item.path ? 'var(--glass-heavy)' : 'transparent',
                                    color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-secondary)'
                                }}
                            >
                                <span style={styles.iconBox}>{item.icon}</span>
                                <span>{item.label}</span>
                                {location.pathname === item.path && (
                                    <motion.div layoutId="active" style={styles.activeDot} />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div style={styles.navSection}>
                    <p style={styles.sectionLabel}>Account</p>
                    <nav style={styles.nav}>
                        {bottomItems.map(item => (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                style={styles.navLink}
                            >
                                <span style={styles.iconBox}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div style={styles.sidebarFooter}>
                    <div style={styles.upgradeCard}>
                        <p style={styles.upgradeTitle}>Verified NGO</p>
                        <p style={styles.upgradeText}>Trusted by CrowdHelp community.</p>
                    </div>
                </div>
            </aside>
            
            {/* Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={styles.overlay} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                    />
                )}
            </AnimatePresence>

            <main style={styles.mainContent}>
                <div style={styles.topBar}>
                    <div style={styles.breadcrumb}>
                        <span>NGO Hub</span>
                        <ChevronRight size={14} />
                        <span style={{color: 'var(--text-primary)'}}>
                            {menuItems.find(m => m.path === location.pathname)?.label || 'Overview'}
                        </span>
                    </div>
                    <div style={styles.topActions}>
                        <button style={styles.iconAction}><Bell size={20}/></button>
                        <Link to="/profile" style={styles.userBadge}>
                            <div style={styles.userAvatar}>N</div>
                        </Link>
                    </div>
                </div>
                <div style={styles.contentInner}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' },
    mobileHeader: {
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: 'var(--bg-surface)',
        padding: '0 1.5rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1001,
        borderBottom: '1px solid var(--border)'
    },
    sidebar: { 
        width: '280px', 
        background: 'var(--bg-surface)', 
        borderRight: '1px solid var(--border)', 
        padding: '2rem 1.25rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2.5rem',
        position: 'fixed',
        top: 0,
        bottom: 0,
        zIndex: 1000,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    sidebarHeader: { marginBottom: '1rem' },
    brand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    logoIcon: { width: '32px', height: '32px', background: 'var(--gradient-main)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '900' },
    logoText: { fontSize: '1.25rem', fontWeight: '800', margin: 0 },
    navSection: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    sectionLabel: { fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', paddingLeft: '1rem' },
    nav: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    navLink: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        padding: '0.8rem 1rem', 
        borderRadius: '14px', 
        textDecoration: 'none', 
        transition: 'all 0.2s ease', 
        position: 'relative',
        fontSize: '0.95rem',
        fontWeight: '600'
    },
    iconBox: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    activeDot: { position: 'absolute', right: '12px', width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' },
    sidebarFooter: { marginTop: 'auto' },
    upgradeCard: { background: 'var(--glass)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '20px' },
    upgradeTitle: { fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.4rem' },
    upgradeText: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 },
    mainContent: { flex: 1, marginLeft: '280px', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    topBar: { height: '80px', padding: '0 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(15, 17, 20, 0.5)', backdropFilter: 'blur(10px)' },
    breadcrumb: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' },
    topActions: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    iconAction: { background: 'var(--glass)', border: '1px solid var(--border)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' },
    userBadge: { display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' },
    userAvatar: { width: '40px', height: '40px', background: 'var(--gradient-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '800' },
    contentInner: { padding: '3rem', flex: 1 },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 999 },
    mobileToggle: { background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }
};

// Responsive Styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style")
    styleSheet.innerText = `
        @media (max-width: 992px) {
            .ngo-sidebar { transform: translateX(-100%); }
            .ngo-main-content { margin-left: 0 !important; }
            .mobile-header-active { display: flex !important; }
        }
        @media (min-width: 993px) {
            .ngo-sidebar { transform: translateX(0) !important; }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default NGOLayout;
