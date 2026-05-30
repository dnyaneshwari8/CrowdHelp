import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <Link to="/" style={styles.link}>DonationProject</Link>
            </div>
            <ul style={styles.navLinks}>
                <li><Link to="/" style={styles.link}>Home</Link></li>
                <li><Link to="/donations" style={styles.link}>History</Link></li>
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
        borderRadius: '8px'
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    navLinks: {
        display: 'flex',
        listStyle: 'none',
        gap: '1.5rem',
        margin: 0
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1rem'
    }
};

export default Navbar;
