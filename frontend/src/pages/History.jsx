import React, { useEffect, useState } from 'react';
import { fetchDonations, downloadReceipt } from '../services/api';
import Spinner from '../components/Spinner';

const History = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDonations = async () => {
            try {
                const data = await fetchDonations();
                setDonations(data);
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
            <h2>Donation History</h2>
            {donations.length === 0 ? (
                <p>No successful donations found.</p>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Donor Name</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <tr key={donation._id}>
                                    <td>{donation.donorName}</td>
                                    <td>{donation.donorEmail}</td>
                                    <td>₹{donation.amount}</td>
                                    <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button 
                                            onClick={() => downloadReceipt(donation._id)}
                                            style={styles.btn}
                                        >
                                            Download
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
        maxWidth: '1000px',
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
        width: 'auto'
    }
};

// Add CSS for table borders
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  th, td {
    padding: 12px;
    border-bottom: 1px solid #333;
  }
  th {
    color: #646cff;
  }
`;
document.head.appendChild(styleSheet);

export default History;
