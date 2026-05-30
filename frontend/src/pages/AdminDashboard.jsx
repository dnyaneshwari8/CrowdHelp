import React, { useEffect, useState } from 'react';
import { fetchAllUsers, fetchAllDonations, fetchAdvancedAnalytics, toggleBlockUser } from '../services/api';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [usersRes, donationsRes, analyticsRes] = await Promise.all([
                    fetchAllUsers(),
                    fetchAllDonations(),
                    fetchAdvancedAnalytics()
                ]);
                setUsers(usersRes.data.users);
                setDonations(donationsRes.data.donations);
                setAnalytics(analyticsRes.data);
            } catch (error) {
                console.error('Error loading admin data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleBlockToggle = async (userId) => {
        try {
            const response = await toggleBlockUser(userId);
            alert(response.message);
            // Refresh users list
            const updatedUsers = users.map(u => 
                u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u
            );
            setUsers(updatedUsers);
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Admin Dashboard</h1>

            {analytics && (
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <h3>Total Donors</h3>
                        <p style={styles.statValue}>{analytics.totalDonors}</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3>Active Campaigns</h3>
                        <p style={styles.statValue}>{analytics.totalCampaigns}</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3>Monthly Total</h3>
                        <p style={styles.statValue}>₹{analytics.monthlyAmount.toLocaleString()}</p>
                    </div>
                </div>
            )}

            <div style={styles.section}>
                <h2>Users Management</h2>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Verified</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                    <td>{u.role}</td>
                                    <td>{u.isVerified ? '✅' : '❌'}</td>
                                    <td>{u.isBlocked ? 'Blocked' : 'Active'}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleBlockToggle(u._id)}
                                            style={{ ...styles.actionBtn, backgroundColor: u.isBlocked ? '#4CAF50' : '#f44336' }}
                                        >
                                            {u.isBlocked ? 'Unblock' : 'Block'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={styles.section}>
                <h2>Donations History</h2>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Donor</th>
                                <th>Amount</th>
                                <th>Order ID</th>
                                <th>Payment ID</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(d => (
                                <tr key={d._id}>
                                    <td>{d.donorName} ({d.donorEmail})</td>
                                    <td>₹{d.amount}</td>
                                    <td>{d.razorpay_order_id}</td>
                                    <td>{d.razorpay_payment_id || 'N/A'}</td>
                                    <td>{d.status}</td>
                                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles = {
    statsContainer: {
        display: 'flex',
        gap: '2rem',
        marginBottom: '2rem'
    },
    statCard: {
        backgroundColor: '#1a1a1a',
        padding: '1.5rem',
        borderRadius: '8px',
        flex: 1,
        textAlign: 'center'
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#646cff'
    },
    section: {
        marginBottom: '3rem'
    },
    tableWrapper: {
        overflowX: 'auto',
        backgroundColor: '#1a1a1a',
        padding: '1rem',
        borderRadius: '8px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        color: 'white',
        textAlign: 'left'
    },
    actionBtn: {
        padding: '0.4rem 0.8rem',
        fontSize: '0.8rem',
        border: 'none',
        borderRadius: '4px',
        color: 'white',
        cursor: 'pointer'
    }
};

export default AdminDashboard;
