import React from 'react';
import { motion } from 'framer-motion';

const Spinner = ({ message = 'Loading impact...' }) => {
    return (
        <div style={styles.spinnerContainer}>
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={styles.spinner}
            />
            <p style={styles.text}>{message}</p>
        </div>
    );
};

const styles = {
    spinnerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 2rem',
        width: '100%'
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '3px solid var(--glass-heavy)',
        borderTop: '3px solid var(--primary)',
        borderRadius: '50%',
    },
    text: {
        marginTop: '1.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        letterSpacing: '0.02em'
    }
};

export default Spinner;
