import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Megaphone, 
    ShieldCheck, 
    Activity, 
    Bell, 
    Settings, 
    HelpCircle,
    Building2,
    History,
    FileText,
    PieChart
} from 'lucide-react';

const Sidebar = ({ role }) => {
    const location = useLocation();

    const adminLinks = [
        { label: 'Overview', icon: <LayoutDashboard size={20}/>, path: '/admin' },
        { label: 'User Management', icon: <Users size={20}/>, path: '/admin/users' },
        { label: 'NGO Applications', icon: <Building2 size={20}/>, path: '/admin/ngo-applications' },
        { label: 'Campaign Approval', icon: <Megaphone size={20}/>, path: '/admin/campaign-approval' },
        { label: 'Support Messages', icon: <HelpCircle size={20}/>, path: '/admin/support' },
        { label: 'Audit Logs', icon: <ShieldCheck size={20}/>, path: '/admin/audit-logs' },
    ];

    const ngoLinks = [
        { label: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/ngo-dashboard' },
        { label: 'My Campaigns', icon: <Megaphone size={20}/>, path: '/ngo/my-campaigns' },
        { label: 'Donations', icon: <History size={20}/>, path: '/ngo/donations' },
        { label: 'Documents', icon: <FileText size={20}/>, path: '/ngo/documents' },
        { label: 'Analytics', icon: <PieChart size={20}/>, path: '/ngo/analytics' },
        { label: 'Profile', icon: <Building2 size={20}/>, path: '/profile' },
    ];

    const links = role === 'ADMIN' ? adminLinks : ngoLinks;

    return (
        <aside style={styles.sidebar}>
            <div style={styles.sidebarContent}>
                <div style={styles.navGroup}>
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                style={{
                                    ...styles.navLink,
                                    backgroundColor: isActive ? 'rgba(66, 133, 244, 0.1)' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                    borderRight: isActive ? '3px solid var(--primary)' : 'none'
                                }}
                            >
                                {link.icon}
                                <span style={styles.navLabel}>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div style={styles.sidebarFooter}>
                    <Link to="/profile" style={styles.navLink}>
                        <Settings size={20} />
                        <span style={styles.navLabel}>Settings</span>
                    </Link>
                    <Link to="/contact" style={styles.navLink}>
                        <HelpCircle size={20} />
                        <span style={styles.navLabel}>Help Center</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: '260px',
        height: 'calc(100vh - 80px)',
        position: 'sticky',
        top: '80px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column'
    },
    sidebarContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0'
    },
    navGroup: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.85rem 1.5rem',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'all 0.2s ease'
    },
    navLabel: {
        whiteSpace: 'nowrap'
    },
    sidebarFooter: {
        padding: '1.5rem 0',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    }
};

export default Sidebar;
