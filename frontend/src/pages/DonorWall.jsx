import React, { useState, useEffect } from 'react';
import { fetchDonorWall } from '../services/api';
import Spinner from '../components/Spinner';

const DonorWall = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDonors = async () => {
            try {
                const res = await fetchDonorWall();
                setDonors(res.data.donorWall);
            } catch (error) {
                console.error('Error fetching donor wall:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDonors();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Wall of Kindness</h1>
            <p style={styles.subHeader}>A public wall dedicated to our generous contributors</p>
            
            <div style={styles.grid}>
                {donors.map((donor, index) => (
                    <div key={index} className="card" style={styles.card}>
                        <div style={styles.avatar}>
                            {donor.donorName[0]}
                        </div>
                        <div style={styles.info}>
                            <h3 style={styles.name}>{donor.donorName}</h3>
                            <p style={styles.campaign}>Supported: <strong>{donor.campaignTitle}</strong></p>
                            <p style={styles.amount}>₹{donor.amount.toLocaleString()}</p>
                            <span style={styles.date}>{new Date(donor.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem'
    },
    header: {
        textAlign: 'center'
    },
    subHeader: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '3rem'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem'
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#646cff',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        flexShrink: 0
    },
    info: {
        flex: 1
    },
    name: {
        margin: 0,
        fontSize: '1.1rem'
    },
    campaign: {
        fontSize: '0.85rem',
        margin: '0.3rem 0',
        color: '#555'
    },
    amount: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#646cff',
        margin: '0.2rem 0'
    },
    date: {
        fontSize: '0.75rem',
        color: '#999'
    }
};

export default DonorWall;
