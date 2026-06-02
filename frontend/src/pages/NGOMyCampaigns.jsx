import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Plus, 
    Search, 
    Filter, 
    Eye, 
    Edit, 
    Trash2, 
    MoreVertical,
    CheckCircle,
    Clock,
    XCircle,
    CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/Spinner';

const NGOMyCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await api.get('/ngo/my-campaigns');
            setCampaigns(res.data.data.campaigns);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            try {
                await api.delete(`/ngo/campaigns/${id}`);
                setCampaigns(campaigns.filter(c => c._id !== id));
            } catch (err) {
                alert('Failed to delete campaign');
            }
        }
    };

    const filteredCampaigns = campaigns.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Campaigns</h1>
                <Link to="/ngo/create-campaign" style={styles.createBtn}>
                    <Plus size={20}/>
                    <span>Create New Campaign</span>
                </Link>
            </div>

            {/* Filters */}
            <div style={styles.filterBar}>
                <div style={styles.searchWrapper}>
                    <Search size={18} style={styles.searchIcon}/>
                    <input 
                        type="text" 
                        placeholder="Search campaigns..." 
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={styles.filterGroup}>
                    <Filter size={18} style={styles.filterIcon}/>
                    <select 
                        style={styles.select}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Campaign</th>
                            <th style={styles.th}>Goal</th>
                            <th style={styles.th}>Raised</th>
                            <th style={styles.th}>Progress</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCampaigns.map((campaign) => {
                            const progress = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
                            return (
                                <tr key={campaign._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.campaignInfo}>
                                            <img src={campaign.image} alt={campaign.title} style={styles.campaignImg}/>
                                            <div style={styles.campaignText}>
                                                <span style={styles.campaignName}>{campaign.title}</span>
                                                <span style={styles.campaignCat}>{campaign.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={styles.td}>₹{campaign.goalAmount.toLocaleString()}</td>
                                    <td style={styles.td}>₹{campaign.currentAmount.toLocaleString()}</td>
                                    <td style={styles.td}>
                                        <div style={styles.progressCell}>
                                            <div style={styles.progressBg}>
                                                <div style={{ ...styles.progressFill, width: `${progress}%` }}/>
                                            </div>
                                            <span style={styles.progressText}>{progress.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ 
                                            ...styles.statusBadge, 
                                            backgroundColor: getStatusColor(campaign.status) + '20',
                                            color: getStatusColor(campaign.status)
                                        }}>
                                            {getStatusIcon(campaign.status)}
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actionGroup}>
                                            <Link to={`/ngo/campaign/${campaign._id}`} style={styles.actionBtn} title="View Details">
                                                <Eye size={18}/>
                                            </Link>
                                            <button style={styles.actionBtn} title="Edit">
                                                <Edit size={18}/>
                                            </button>
                                            <button 
                                                style={{ ...styles.actionBtn, color: '#ef4444' }} 
                                                title="Delete"
                                                onClick={() => handleDelete(campaign._id)}
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredCampaigns.length === 0 && (
                    <div style={styles.empty}>No campaigns found matching your criteria.</div>
                )}
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'APPROVED': return '#22c55e';
        case 'PENDING': return '#f59e0b';
        case 'REJECTED': return '#ef4444';
        case 'COMPLETED': return '#8b5cf6';
        default: return '#94a3b8';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'APPROVED': return <CheckCircle size={14} style={{ marginRight: '4px' }}/>;
        case 'PENDING': return <Clock size={14} style={{ marginRight: '4px' }}/>;
        case 'REJECTED': return <XCircle size={14} style={{ marginRight: '4px' }}/>;
        case 'COMPLETED': return <CheckCircle2 size={14} style={{ marginRight: '4px' }}/>;
        default: return null;
    }
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: 'white' },
    createBtn: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        background: '#22c55e', 
        color: 'white', 
        padding: '0.75rem 1.25rem', 
        borderRadius: '10px', 
        textDecoration: 'none', 
        fontWeight: '600',
        transition: 'transform 0.2s ease'
    },
    filterBar: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        gap: '1rem',
        flexWrap: 'wrap'
    },
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
    filterGroup: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#1e293b', padding: '0 1rem', borderRadius: '10px', border: '1px solid #334155' },
    filterIcon: { color: '#64748b' },
    select: { background: 'transparent', border: 'none', color: 'white', padding: '0.75rem 0', outline: 'none', cursor: 'pointer' },
    tableCard: { background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '1.25rem 1.5rem', background: '#0f172a', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
    tr: { borderBottom: '1px solid #334155', transition: 'background 0.2s ease' },
    td: { padding: '1.25rem 1.5rem', color: '#e2e8f0', verticalAlign: 'middle' },
    campaignInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
    campaignImg: { width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' },
    campaignText: { display: 'flex', flexDirection: 'column' },
    campaignName: { fontWeight: '600', color: 'white' },
    campaignCat: { fontSize: '0.8rem', color: '#64748b' },
    progressCell: { display: 'flex', alignItems: 'center', gap: '1rem' },
    progressBg: { flex: 1, height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' },
    progressFill: { height: '100%', background: '#3b82f6', borderRadius: '3px' },
    progressText: { fontSize: '0.85rem', fontWeight: '600', minWidth: '35px' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
    actionGroup: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    actionBtn: { 
        background: 'transparent', 
        border: 'none', 
        color: '#94a3b8', 
        cursor: 'pointer', 
        padding: '0.5rem', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        ':hover': { background: '#334155', color: 'white' }
    },
    empty: { padding: '3rem', textAlign: 'center', color: '#64748b' }
};

export default NGOMyCampaigns;
