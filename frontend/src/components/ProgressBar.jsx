import React from 'react';

const ProgressBar = ({ current, goal }) => {
    const percentage = Math.min(Math.round((current / goal) * 100), 100);

    return (
        <div style={styles.container}>
            <div style={styles.barBackground}>
                <div style={{ ...styles.barForeground, width: `${percentage}%` }}></div>
            </div>
            <div style={styles.labels}>
                <span>₹{current.toLocaleString()} raised</span>
                <span>{percentage}%</span>
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
        height: '10px',
        backgroundColor: '#eee',
        borderRadius: '5px',
        overflow: 'hidden'
    },
    barForeground: {
        height: '100%',
        backgroundColor: '#646cff',
        transition: 'width 0.5s ease-in-out'
    },
    labels: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '5px',
        fontSize: '0.9rem',
        fontWeight: 'bold'
    },
    goal: {
        textAlign: 'right',
        fontSize: '0.8rem',
        color: '#666'
    }
};

export default ProgressBar;
