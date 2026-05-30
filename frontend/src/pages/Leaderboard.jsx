import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../services/api';
import Spinner from '../components/Spinner';

const Leaderboard = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const res = await fetchLeaderboard();
                setDonors(res.data.leaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        loadLeaderboard();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Top Contributors</h1>
            <p style={styles.subHeader}>Celebrating our most generous supporters</p>
            
            <div style={styles.list}>
                {donors.map((donor, index) => (
                    <div key={donor._id} className="card" style={styles.item}>
                        <div style={styles.rank}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div style={styles.donorInfo}>
                            <h3 style={styles.name}>{donor.donorName}</h3>
                        </div>
                        <div style={styles.amount}>
                            ₹{donor.totalDonated.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
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
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        padding: '1.5rem',
        justifyContent: 'space-between'
    },
    rank: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        width: '50px'
    },
    donorInfo: {
        flex: 1
    },
    name: {
        margin: 0
    },
    amount: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#646cff'
    }
};

export default Leaderboard;
