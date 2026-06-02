import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    Download, 
    Calendar,
    User,
    ChevronLeft,
    ChevronRight,
    IndianRupee
} from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/Spinner';

const NGODonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDonations(1);
    }, []);

    const fetchDonations = async (page) => {
        try {
            const res = await api.get(`/ngo/donations?page=${page}`);
            setDonations(res.data.data.donations);
            setPagination(res.data.data.pagination);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleExport = () => {
        // In a real app, this would trigger a CSV download
        alert('Exporting donations to CSV...');
    };

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Donations Received</h1>
                    <p style={styles.subtitle}>Track all contributions across your campaigns</p>
                </div>
                <button onClick={handleExport} style={styles.exportBtn}>
                    <Download size={18}/>
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div style={styles.filterBar}>
                <div style={styles.searchWrapper}>
                    <Search size={18} style={styles.searchIcon}/>
                    <input 
                        type="text" 
                        placeholder="Search donor name or campaign..." 
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={styles.filters}>
                    <button style={styles.filterBtn}><Filter size={18}/> Filter</button>
                    <button style={styles.filterBtn}><Calendar size={18}/> Date Range</button>
                </div>
            </div>

            {/* Donations Table */}
            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Donor</th>
                            <th style={styles.th}>Campaign</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation) => (
                            <tr key={donation._id} style={styles.tr}>
                                <td style={styles.td}>
                                    <div style={styles.donorInfo}>
                                        <div style={styles.avatar}>
                                            <User size={16}/>
                                        </div>
                                        <div style={styles.donorText}>
                                            <span style={styles.donorName}>{donation.userId?.name || 'Anonymous'}</span>
                                            <span style={styles.donorEmail}>{donation.userId?.email || 'N/A'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <span style={styles.campaignName}>{donation.campaignId?.title}</span>
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.amount}>₹{donation.amount.toLocaleString()}</div>
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.date}>{new Date(donation.createdAt).toLocaleDateString()}</div>
                                    <div style={styles.time}>{new Date(donation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </td>
                                <td style={styles.td}>
                                    <span style={styles.statusBadge}>Success</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {donations.length === 0 && (
                    <div style={styles.empty}>No donations received yet.</div>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div style={styles.pagination}>
                    <button 
                        disabled={pagination.page === 1}
                        onClick={() => fetchDonations(pagination.page - 1)}
                        style={styles.pageBtn}
                    >
                        <ChevronLeft size={20}/>
                    </button>
                    <span style={styles.pageInfo}>Page {pagination.page} of {pagination.pages}</span>
                    <button 
                        disabled={pagination.page === pagination.pages}
                        onClick={() => fetchDonations(pagination.page + 1)}
                        style={styles.pageBtn}
                    >
                        <ChevronRight size={20}/>
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' },
    subtitle: { color: '#94a3b8', fontSize: '0.9rem' },
    exportBtn: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        background: '#1e293b', 
        border: '1px solid #334155', 
        color: 'white', 
        padding: '0.6rem 1rem', 
        borderRadius: '10px', 
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    filterBar: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    searchWrapper: { position: 'relative', flex: 1, minWidth: '300px' },
    searchIcon: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' },
    searchInput: { 
        width: '100%', 
        padding: '0.75rem 1rem 0.75rem 2.75rem', 
        background: '#1e293b', 
        border: '1px solid #334155', 
        borderRadius: '10px', 
        color: 'white',
        outline: 'none'
    },
    filters: { display: 'flex', gap: '0.75rem' },
    filterBtn: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        background: '#1e293b', 
        border: '1px solid #334155', 
        color: '#94a3b8', 
        padding: '0.75rem 1rem', 
        borderRadius: '10px', 
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    tableCard: { background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '1.25rem 1.5rem', background: '#0f172a', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
    tr: { borderBottom: '1px solid #334155' },
    td: { padding: '1.25rem 1.5rem', color: '#e2e8f0', verticalAlign: 'middle' },
    donorInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
    avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#94a3b8' },
    donorText: { display: 'flex', flexDirection: 'column' },
    donorName: { fontWeight: '600', color: 'white', fontSize: '0.9rem' },
    donorEmail: { fontSize: '0.75rem', color: '#64748b' },
    campaignName: { fontSize: '0.9rem', color: '#cbd5e1' },
    amount: { fontWeight: '700', color: '#22c55e', fontSize: '1rem' },
    date: { fontSize: '0.9rem', color: '#e2e8f0' },
    time: { fontSize: '0.75rem', color: '#64748b' },
    statusBadge: { padding: '0.25rem 0.75rem', borderRadius: '20px', background: '#22c55e20', color: '#22c55e', fontSize: '0.75rem', fontWeight: '600' },
    empty: { padding: '4rem', textAlign: 'center', color: '#64748b' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' },
    pageBtn: { background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', disabled: { opacity: 0.5, cursor: 'not-allowed' } },
    pageInfo: { color: '#94a3b8', fontSize: '0.9rem' }
};

export default NGODonations;
