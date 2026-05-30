import React from 'react';

const Spinner = () => {
    return (
        <div style={styles.spinnerContainer}>
            <div style={styles.spinner}></div>
            <p>Processing Payment...</p>
        </div>
    );
};

const styles = {
    spinnerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #646cff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
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
