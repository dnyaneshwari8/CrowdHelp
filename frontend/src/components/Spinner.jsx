import React from 'react';

const Spinner = ({ message = 'Loading...' }) => {
    return (
        <div style={styles.spinnerContainer}>
            <div style={styles.spinner}></div>
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
        padding: '2rem',
        minHeight: '200px'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #1e293b',
        borderTop: '4px solid #22c55e',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
    },
    text: {
        color: '#94a3b8',
        fontSize: '0.9rem'
    }
};

// Add CSS animation to document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);

export default Spinner;
