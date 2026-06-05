import React, { useState, useEffect } from 'react';
import { fetchNGODonations } from '../services/api';
import Spinner from '../components/Spinner';
import { Mail, Calendar, User, Target, IndianRupee, Download } from 'lucide-react';

const NGODonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDonations();
    }, []);

    const loadDonations = async () => {
        try {
            const res = await fetchNGODonations();
            setDonations(res.data.donations);
        } catch (error) {
            console.error('Error fetching NGO donations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Donations Received</h1>
                <p>Track all contributions made to your organization's campaigns.</p>
            </div>

            <div className="card" style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Donor</th>
                            <th>Campaign</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(donation => (
                            <tr key={donation._id}>
                                <td>
                                    <div style={styles.donorInfo}>
                                        <strong>{donation.isAnonymous ? 'Anonymous' : donation.donorName}</strong>
                                        <span>{donation.isAnonymous ? '---' : donation.donorEmail}</span>
                                    </div>
                                </td>
                                <td>{donation.campaignId?.title}</td>
                                <td>
                                    <div style={styles.amount}>
                                        <IndianRupee size={14}/> {donation.amount.toLocaleString()}
                                    </div>
                                </td>
                                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span style={styles.statusBadge}>Completed</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {donations.length === 0 && <p style={styles.empty}>No donations received yet.</p>}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' },
    header: { marginBottom: '3rem' },
    tableCard: { padding: '1rem', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    donorInfo: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    amount: { display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: '700', color: 'var(--primary)' },
    statusBadge: { padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' },
    empty: { textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }
};

export default NGODonations;
