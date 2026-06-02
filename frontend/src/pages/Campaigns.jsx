import React, { useState, useEffect } from 'react';
import { fetchCampaigns } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import Spinner from '../components/Spinner';
import { Search, Filter, Sparkles, Megaphone } from 'lucide-react';

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
            {/* Page Header Section */}
            <div style={styles.pageHeader}>
                <div style={styles.headerContent}>
                    <div style={styles.badge}>
                        <Sparkles size={14} /> <span>Discover Causes</span>
                    </div>
                    <h1 style={styles.mainTitle}>Support a <span style={styles.gradientText}>Campaign</span></h1>
                    <p style={styles.subtitle}>
                        Browse through our verified campaigns and contribute to making a difference.
                    </p>
                </div>
            </div>

            {/* Filter & Search Section */}
            <div style={styles.filterSection}>
                <div style={styles.searchWrapper}>
                    <Search size={20} style={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by title, cause, or keyword..." 
                        style={styles.searchInput}
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                
                <div style={styles.categoryScroll}>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            style={{
                                ...styles.categoryBtn,
                                backgroundColor: filters.category === cat ? 'var(--primary)' : 'var(--glass)',
                                color: filters.category === cat ? '#000' : 'var(--text-secondary)',
                                border: filters.category === cat ? 'none' : '1px solid var(--border)'
                            }}
                            onClick={() => setFilters({ ...filters, category: cat })}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            {loading ? <Spinner /> : (
                <div style={styles.gridSection}>
                    <div style={styles.resultsCount}>
                        <Megaphone size={18} color="var(--primary)" />
                        <span>Showing {campaigns.length} active campaigns</span>
                    </div>
                    
                    <div style={styles.grid}>
                        {campaigns.length > 0 ? campaigns.map(campaign => (
                            <CampaignCard key={campaign._id} campaign={campaign} />
                        )) : (
                            <div style={styles.noResultsCard}>
                                <div style={styles.noResultsIcon}>?</div>
                                <h2>No campaigns found</h2>
                                <p>Try adjusting your search or filters to find what you're looking for.</p>
                                <button 
                                    style={styles.resetBtn}
                                    onClick={() => setFilters({ category: 'All', search: '' })}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem',
        paddingBottom: '8rem'
    },
    pageHeader: {
        padding: '4rem 0',
        textAlign: 'center',
        marginBottom: '2rem'
    },
    headerContent: {
        maxWidth: '800px',
        margin: '0 auto'
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1.25rem',
        borderRadius: '100px',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--primary)',
        marginBottom: '1.5rem'
    },
    mainTitle: {
        fontSize: '3.5rem',
        fontWeight: '800',
        marginBottom: '1rem',
        letterSpacing: '-0.03em'
    },
    gradientText: {
        background: 'var(--gradient-main)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.6'
    },
    filterSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        marginBottom: '4rem',
        background: 'var(--bg-surface)',
        padding: '2.5rem',
        borderRadius: '32px',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    },
    searchWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    searchIcon: {
        position: 'absolute',
        left: '1.5rem',
        color: 'var(--text-secondary)'
    },
    searchInput: {
        paddingLeft: '4rem',
        height: '60px',
        fontSize: '1.1rem',
        background: 'var(--bg-dark)',
        borderRadius: '16px'
    },
    categoryScroll: {
        display: 'flex',
        gap: '0.75rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
    },
    categoryBtn: {
        whiteSpace: 'nowrap',
        padding: '0.6rem 1.5rem',
        borderRadius: '12px',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        width: 'auto'
    },
    gridSection: {
        marginTop: '2rem'
    },
    resultsCount: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--text-secondary)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2.5rem'
    },
    noResultsCard: {
        gridColumn: '1 / -1',
        padding: '5rem',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        borderRadius: '32px',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
    },
    noResultsIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        marginBottom: '1rem'
    },
    resetBtn: {
        marginTop: '1rem',
        background: 'transparent',
        border: '1px solid var(--primary)',
        color: 'var(--primary)',
        width: 'auto'
    }
};

export default Campaigns;
