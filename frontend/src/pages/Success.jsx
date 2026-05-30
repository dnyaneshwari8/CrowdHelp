import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { downloadReceipt } from '../services/api';

const Success = () => {
    const location = useLocation();
    const { paymentId, amount, donationId } = location.state || {};

    if (!paymentId) {
        return (
            <div className="card">
                <h2>No payment details found.</h2>
                <Link to="/">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="card" style={styles.card}>
            <div style={styles.icon}>✅</div>
            <h2 style={styles.title}>Payment Successful!</h2>
            <p>Thank you for your generous donation.</p>
            
            <div style={styles.details}>
                <p><strong>Payment ID:</strong> {paymentId}</p>
                <p><strong>Amount:</strong> ₹{amount}</p>
            </div>

            <div style={styles.actions}>
                <button 
                    onClick={() => downloadReceipt(donationId)}
                    style={styles.downloadBtn}
                >
                    Download Receipt (PDF)
                </button>
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
        color: '#4CAF50',
        marginBottom: '1.5rem'
    },
    details: {
        backgroundColor: '#f9f9f9',
        padding: '1rem',
        borderRadius: '8px',
        margin: '1.5rem 0',
        textAlign: 'left',
        color: '#333'
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    downloadBtn: {
        backgroundColor: '#646cff',
        color: 'white'
    },
    homeLink: {
        color: '#646cff',
        textDecoration: 'none'
    }
};

export default Success;
