import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Home, 
    LayoutDashboard, 
    Heart, 
    User as UserIcon, 
    LogOut, 
    Trophy, 
    Users, 
    Megaphone,
    BarChart3,
    Building2,
    PlusCircle,
    History as HistoryIcon,
    Bell
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    return (
        <nav style={styles.nav}>
            <div style={styles.navContainer}>
                <div style={styles.logo}>
                    <Link to="/" style={styles.brandLink}>
                        <div style={styles.logoIcon}>C</div>
                        <span>CrowdHelp</span>
                    </Link>
                </div>
                
                <ul style={styles.navLinks}>
                    <li><Link to="/campaigns" style={styles.link}><Megaphone size={18}/> <span>Campaigns</span></Link></li>
                    <li><Link to="/donor-wall" style={styles.link}><Users size={18}/> <span>Wall</span></Link></li>
                    <li><Link to="/leaderboard" style={styles.link}><Trophy size={18}/> <span>Leaderboard</span></Link></li>
                    
                    {user ? (
                        <>
                            <div style={styles.divider}></div>
                            {user.role === 'ADMIN' ? (
                                <div style={styles.adminGroup}>
                                    <li><Link to="/admin" style={styles.link}><LayoutDashboard size={18}/> <span>Admin</span></Link></li>
                                    <li><Link to="/admin/campaigns" style={styles.link}><Megaphone size={18}/> <span>Manage</span></Link></li>
                                    <li><Link to="/admin/ngo-applications" style={styles.link}><Building2 size={18}/> <span>NGOs</span></Link></li>
                                    <li><Link to="/admin/campaign-approvals" style={styles.link}><PlusCircle size={18}/> <span>Approvals</span></Link></li>
                                </div>
                            ) : user.role === 'NGO' && user.ngoStatus === 'APPROVED' ? (
                                <div style={styles.adminGroup}>
                                    <li><Link to="/ngo/dashboard" style={styles.link}><LayoutDashboard size={18}/> <span>NGO Hub</span></Link></li>
                                    <li><Link to="/ngo/my-campaigns" style={styles.link}><PlusCircle size={18}/> <span>Create</span></Link></li>
                                    <li><Link to="/profile" style={styles.link}><UserIcon size={18}/> <span>Org Profile</span></Link></li>
                                </div>
                            ) : (
                                <>
                                    {user.ngoStatus === 'NONE' && (
                                        <li><Link to="/apply-ngo" style={styles.link}><Building2 size={18}/> <span>Become NGO</span></Link></li>
                                    )}
                                    <li><Link to="/favorites" style={styles.link}><Heart size={18}/> <span>Favorites</span></Link></li>
                                    <li><Link to="/profile" style={styles.link}><UserIcon size={18}/> <span>Profile</span></Link></li>
                                </>
                            )}
                            <div style={{ marginLeft: '0.5rem' }}>
                                <NotificationDropdown />
                            </div>
                            <li>
                                <button onClick={logoutUser} style={styles.logoutBtn}>
                                    <LogOut size={18}/>
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <div style={styles.divider}></div>
                            <li><Link to="/login" style={styles.link}>Login</Link></li>
                            <li><Link to="/register" style={styles.authBtn}>Get Started</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        backgroundColor: 'rgba(15, 17, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 0'
    },
    navContainer: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        fontSize: '1.25rem',
        fontWeight: '800'
    },
    brandLink: {
        color: 'var(--text-primary)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
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
    navLinks: {
        display: 'flex',
        listStyle: 'none',
        gap: '0.5rem',
        margin: 0,
        alignItems: 'center'
    },
    link: {
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 0.8rem',
        borderRadius: '10px',
        transition: 'all 0.2s ease'
    },
    adminGroup: {
        display: 'flex',
        gap: '0.25rem',
        alignItems: 'center'
    },
    divider: {
        width: '1px',
        height: '24px',
        backgroundColor: 'var(--border)',
        margin: '0 0.5rem'
    },
    logoutBtn: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border)',
        color: '#ff4d4d',
        padding: '0.6rem',
        borderRadius: '10px',
        cursor: 'pointer',
        width: 'auto',
        marginLeft: '0.5rem'
    },
    authBtn: {
        backgroundColor: 'var(--primary)',
        color: '#000',
        padding: '0.6rem 1.2rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'all 0.2s ease'
    }
};

export default Navbar;
