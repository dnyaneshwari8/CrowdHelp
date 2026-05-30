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
    BarChart3
} from 'lucide-react';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <Link to="/" style={styles.brandLink}>CrowdHelp</Link>
            </div>
            
            <ul style={styles.navLinks}>
                <li><Link to="/campaigns" style={styles.link}><Megaphone size={18}/> Campaigns</Link></li>
                <li><Link to="/donor-wall" style={styles.link}><Users size={18}/> Donor Wall</Link></li>
                <li><Link to="/leaderboard" style={styles.link}><Trophy size={18}/> Leaderboard</Link></li>
                
                {user ? (
                    <>
                        {user.role === 'ADMIN' ? (
                            <div style={styles.adminGroup}>
                                <li><Link to="/admin/analytics" style={styles.link}><BarChart3 size={18}/> Analytics</Link></li>
                                <li><Link to="/admin/campaigns" style={styles.link}><LayoutDashboard size={18}/> Manage</Link></li>
                                <li><Link to="/admin" style={styles.link}><Users size={18}/> Users</Link></li>
                            </div>
                        ) : (
                            <>
                                <li><Link to="/favorites" style={styles.link}><Heart size={18}/> Favorites</Link></li>
                                <li><Link to="/profile" style={styles.link}><UserIcon size={18}/> Profile</Link></li>
                            </>
                        )}
                        <li>
                            <button onClick={logoutUser} style={styles.logoutBtn}>
                                <LogOut size={18}/> Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" style={styles.link}>Login</Link></li>
                        <li><Link to="/register" style={styles.link}>Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#1a1a1a',
        color: 'white',
        marginBottom: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    brandLink: {
        color: '#646cff',
        textDecoration: 'none'
    },
    navLinks: {
        display: 'flex',
        listStyle: 'none',
        gap: '1.5rem',
        margin: 0,
        alignItems: 'center'
    },
    adminGroup: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        borderLeft: '1px solid #444',
        paddingLeft: '1.5rem'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        transition: 'color 0.2s'
    },
    logoutBtn: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.9rem'
    }
};

export default Navbar;
