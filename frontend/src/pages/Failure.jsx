import React from 'react';
import { Link } from 'react-router-dom';

const Failure = () => {
    return (
        <div className="card" style={styles.card}>
            <div style={styles.icon}>❌</div>
            <h2 style={styles.title}>Payment Failed</h2>
            <p>Something went wrong with your transaction. Please try again.</p>
            
            <div style={styles.actions}>
                <Link to="/" style={styles.retryBtn}>Retry Donation</Link>
                <Link to="/" style={styles.homeLink}>Back to Home</Link>
            </div>
        </div>
    );
};

const styles = {
    card: {
        padding: '3rem',
        maxWidth: '500px',
        margin: '0 auto'
    },
    icon: {
        fontSize: '4rem',
        marginBottom: '1rem'
    },
    title: {
        color: '#f44336',
        marginBottom: '1.5rem'
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    retryBtn: {
        backgroundColor: '#646cff',
        color: 'white',
        padding: '0.6em 1.2em',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 500
    },
    homeLink: {
        color: '#646cff',
        textDecoration: 'none'
    }
};

export default Failure;
