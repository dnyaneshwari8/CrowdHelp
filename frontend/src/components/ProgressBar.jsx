import React from 'react';

const ProgressBar = ({ current, goal }) => {
    const percentage = Math.min(Math.round((current / goal) * 100), 100);

    return (
        <div style={styles.container}>
            <div style={styles.labels}>
                <span style={styles.raised}>₹{current.toLocaleString()}</span>
                <span style={styles.percentage}>{percentage}%</span>
            </div>
            <div style={styles.barBackground}>
                <div style={{ ...styles.barForeground, width: `${percentage}%` }}></div>
            </div>
            <div style={styles.goal}>Goal: ₹{goal.toLocaleString()}</div>
        </div>
    );
};

const styles = {
    container: {
        margin: '1rem 0'
    },
    barBackground: {
        width: '100%',
        height: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '100px',
        overflow: 'hidden',
        border: '1px solid var(--border)'
    },
    barForeground: {
        height: '100%',
        background: 'linear-gradient(90deg, var(--primary) 0%, #4CAF50 100%)',
        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '100px',
        boxShadow: '0 0 10px rgba(138, 180, 248, 0.3)'
    },
    labels: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '0.75rem'
    },
    raised: {
        fontSize: '1.2rem',
        fontWeight: '800',
        color: '#fff'
    },
    percentage: {
        fontSize: '0.9rem',
        fontWeight: '700',
        color: 'var(--primary)'
    },
    goal: {
        textAlign: 'right',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        marginTop: '0.5rem',
        fontWeight: '500'
    }
};

export default ProgressBar;
