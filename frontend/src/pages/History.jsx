import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchMyDonations, downloadReceipt, downloadCertificate } from '../services/api';
import Spinner from '../components/Spinner';
import { 
    History as HistoryIcon, 
    Download, 
    Award, 
    Search, 
    Calendar, 
    IndianRupee, 
    CheckCircle2, 
    ArrowUpRight,
    FileText,
    Inbox
} from 'lucide-react';

const History = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getDonations();
    }, []);

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

    const filteredDonations = donations.filter(d => 
        d.campaignId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={styles.loader}><Spinner /></div>;

    return (
        <div style={styles.page}>
            <div className="container">
                <header style={styles.header}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={styles.badge}><HistoryIcon size={14}/> Transaction History</div>
                        <h1 style={styles.title}>My <span className="gradient-text">Donations</span></h1>
                        <p style={styles.subtitle}>Track your impact and download your receipts and certificates.</p>
                    </motion.div>
                </header>

                <div style={styles.controls}>
                    <div style={styles.searchBox}>
                        <Search size={18} color="var(--text-muted)" />
                        <input 
                            type="text" 
                            placeholder="Search donations by campaign or ID..." 
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredDonations.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={styles.emptyState}
                    >
                        <div style={styles.emptyIcon}><Inbox size={48} color="var(--text-muted)"/></div>
                        <h2 style={styles.emptyTitle}>No donations found</h2>
                        <p style={styles.emptyText}>
                            {searchTerm ? "No results matching your search." : "You haven't made any donations yet. Your impact journey starts here!"}
                        </p>
                        {!searchTerm && <button className="btn btn-primary" onClick={() => window.location.href='/campaigns'}>Explore Campaigns</button>}
                    </motion.div>
                ) : (
                    <div style={styles.tableCard}>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Campaign Details</th>
                                        <th>Amount</th>
                                        <th>Date & ID</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Documents</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDonations.map((donation) => (
                                        <motion.tr 
                                            key={donation._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={styles.tr}
                                        >
                                            <td style={styles.td}>
                                                <div style={styles.campaignCell}>
                                                    <div style={styles.campaignIcon}><HistoryIcon size={18}/></div>
                                                    <div>
                                                        <p style={styles.campaignName}>{donation.campaignId?.title || 'General Fund'}</p>
                                                        <p style={styles.ngoName}>{donation.ngoId?.organizationName || 'Verified NGO'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.amountCell}>
                                                    <IndianRupee size={14}/>
                                                    <span>{donation.amount.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.metaCell}>
                                                    <span style={styles.date}>{new Date(donation.createdAt).toLocaleDateString()}</span>
                                                    <span style={styles.payId}>{donation.razorpay_payment_id}</span>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.statusCell}>
                                                    <CheckCircle2 size={14}/>
                                                    <span>Successful</span>
                                                </div>
                                            </td>
                                            <td style={{ ...styles.td, textAlign: 'right' }}>
                                                <div style={styles.actions}>
                                                    <button 
                                                        onClick={() => downloadReceipt(donation._id)}
                                                        style={styles.actionBtn}
                                                        title="Download Receipt"
                                                    >
                                                        <FileText size={16}/>
                                                        <span>Receipt</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => downloadCertificate(donation._id)}
                                                        style={{...styles.actionBtn, background: 'rgba(52, 168, 83, 0.1)', color: '#34a853'}}
                                                        title="Download Certificate"
                                                    >
                                                        <Award size={16}/>
                                                        <span>Certificate</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-dark)' },
    loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
    header: { marginBottom: '3rem', textAlign: 'center' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--glass)', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '1.5rem' },
    title: { fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' },
    controls: { marginBottom: '2rem' },
    searchBox: { maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', padding: '0.8rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)' },
    searchInput: { background: 'none', border: 'none', color: 'white', fontSize: '1rem', width: '100%', outline: 'none' },
    tableCard: { background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.2s' },
    td: { padding: '1.5rem' },
    campaignCell: { display: 'flex', alignItems: 'center', gap: '1rem' },
    campaignIcon: { width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(66, 133, 244, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' },
    campaignName: { fontWeight: '700', fontSize: '1rem', margin: 0, color: 'var(--text-primary)' },
    ngoName: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 },
    amountCell: { display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: '800', fontSize: '1.1rem' },
    metaCell: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    date: { fontSize: '0.9rem', fontWeight: '600' },
    payId: { fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' },
    statusCell: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' },
    actions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
    actionBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: 'rgba(66, 133, 244, 0.1)', color: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
    emptyState: { textAlign: 'center', padding: '6rem 2rem' },
    emptyIcon: { marginBottom: '2rem' },
    emptyTitle: { fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' },
    emptyText: { color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem auto' }
};

export default History;
