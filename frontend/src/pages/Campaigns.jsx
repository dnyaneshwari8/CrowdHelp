import React, { useState, useEffect } from 'react';
import { fetchCampaigns } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import Spinner from '../components/Spinner';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: 'All', search: '' });

    const categories = ['All', 'Education', 'Health', 'Environment', 'Animal Welfare', 'Disaster Relief', 'Other'];

    useEffect(() => {
        const loadCampaigns = async () => {
            setLoading(true);
            try {
                const response = await fetchCampaigns(filters);
                setCampaigns(response.data.campaigns);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCampaigns();
    }, [filters]);

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Active Campaigns</h1>
            
            <div style={styles.filterBar}>
                <input 
                    type="text" 
                    placeholder="Search campaigns..." 
                    style={styles.searchInput}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <select 
                    style={styles.select}
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {loading ? <Spinner /> : (
                <div style={styles.grid}>
                    {campaigns.length > 0 ? campaigns.map(campaign => (
                        <CampaignCard key={campaign._id} campaign={campaign} />
                    )) : (
                        <p style={styles.noResults}>No campaigns found matching your criteria.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem'
    },
    filterBar: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        justifyContent: 'center'
    },
    searchInput: {
        padding: '0.8rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        width: '300px'
    },
    select: {
        padding: '0.8rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        width: '200px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem'
    },
    noResults: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666',
        marginTop: '2rem'
    }
};

export default Campaigns;
