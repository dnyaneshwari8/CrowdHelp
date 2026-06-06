import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, role }) => {
    return (
        <div style={styles.layout}>
            <Sidebar role={role} />
            <main style={styles.main}>
                <div style={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
};

const styles = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        paddingTop: '80px' // Height of Navbar
    },
    main: {
        flex: 1,
        overflowX: 'hidden'
    },
    content: {
        padding: '2.5rem',
        maxWidth: '1600px',
        margin: '0 auto'
    }
};

export default DashboardLayout;
