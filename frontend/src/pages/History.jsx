import React, { useEffect, useState } from 'react';
import { fetchMyDonations, downloadReceipt, downloadCertificate } from '../services/api';
import Spinner from '../components/Spinner';

const History = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDonations = async () => {
            try {
                const response = await fetchMyDonations();
                setDonations(response.data.donations);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        getDonations();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <h2>My Donation History</h2>
            {donations.length === 0 ? (
                <p>No successful donations found.</p>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Amount</th>
                                <th>Payment ID</th>
                                <th>Date</th>
                                <th>Receipt</th>
                                <th>Certificate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <tr key={donation._id}>
                                    <td>{donation.campaignId?.title || 'General'}</td>
                                    <td>₹{donation.amount}</td>
                                    <td>{donation.razorpay_payment_id}</td>
                                    <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button 
                                            onClick={() => downloadReceipt(donation._id)}
                                            style={styles.btn}
                                        >
                                            Receipt
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => downloadCertificate(donation._id)}
                                            style={{...styles.btn, backgroundColor: '#4CAF50'}}
                                        >
                                            Certificate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '1rem',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    tableWrapper: {
        overflowX: 'auto',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        padding: '1rem'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        color: 'white'
    },
    btn: {
        padding: '0.4rem 0.8rem',
        fontSize: '0.8rem',
        width: 'auto',
        backgroundColor: '#646cff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default History;
