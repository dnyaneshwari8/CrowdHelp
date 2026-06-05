import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCampaigns } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import Spinner from '../components/Spinner';
import { 
    Search, 
    Filter, 
    Sparkles, 
    Megaphone, 
    X, 
    ChevronDown, 
    SlidersHorizontal,
    LayoutGrid,
    LayoutList,
    AlertCircle
} from 'lucide-react';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, pages: 1, current: 1 });
    const [filters, setFilters] = useState({ 
        category: 'All', 
        search: '', 
        sort: 'newest',
        page: 1 
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    const categories = ['All', 'Education', 'Health', 'Environment', 'Animal Welfare', 'Disaster Relief', 'Other'];

    useEffect(() => {
        const loadCampaigns = async () => {
            setLoading(true);
            try {
                const response = await fetchCampaigns(filters);
                setCampaigns(response.data.campaigns);
                setPagination({
                    total: response.total,
                    pages: response.pages,
                    current: filters.page
                });
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCampaigns();
    }, [filters]);

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.heroSection}>
                <div className="container">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={styles.heroContent}
                    >
                        <div style={styles.badge}>
                            <Sparkles size={14} /> <span>Discover Opportunities</span>
                        </div>
                        <h1 style={styles.heroTitle}>Support Causes That <span className="gradient-text">Change Lives</span></h1>
                        <p style={styles.heroSub}>
                            Every verified campaign on CrowdHelp is vetted for maximum impact and transparency.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Controls Section */}
            <section style={styles.controlsSection}>
                <div className="container">
                    <div style={styles.controlsWrapper}>
                        <div style={styles.searchBox}>
                            <Search size={20} style={styles.searchIcon} />
                            <input 
                                type="text" 
                                placeholder="Search by title, NGO, or cause..." 
                                style={styles.searchInput}
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                            {filters.search && (
                                <button onClick={() => setFilters({...filters, search: ''})} style={styles.clearSearch}>
                                    <X size={16}/>
                                </button>
                            )}
                        </div>
                        
                        <div style={styles.actionButtons}>
                            <button 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                style={{
                                    ...styles.filterToggle,
                                    backgroundColor: isFilterOpen ? 'var(--primary)' : 'var(--glass)',
                                    color: isFilterOpen ? '#000' : 'var(--text-primary)'
                                }}
                            >
                                <SlidersHorizontal size={18}/>
                                <span>Filters</span>
                            </button>
                            <div style={styles.viewToggle}>
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    style={{...styles.viewBtn, color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)'}}
                                >
                                    <LayoutGrid size={20}/>
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    style={{...styles.viewBtn, color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)'}}
                                >
                                    <LayoutList size={20}/>
                                </button>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={styles.filterDrawer}
                            >
                                <div style={styles.filterGrid}>
                                <div style={styles.filterGroup}>
                                    <label style={styles.filterLabel}>Sort By</label>
                                    <select 
                                        style={styles.select}
                                        value={filters.sort}
                                        onChange={(e) => setFilters({...filters, sort: e.target.value, page: 1})}
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="goal_high">Goal: High to Low</option>
                                        <option value="goal_low">Goal: Low to High</option>
                                        <option value="most_raised">Most Raised</option>
                                    </select>
                                </div>
                                <div style={styles.filterGroup}>
                                    <label style={styles.filterLabel}>Category</label>
                                    <div style={styles.categoryWrap}>
                                        {categories.map(cat => (
                                            <button 
                                                key={cat}
                                                onClick={() => setFilters({...filters, category: cat, page: 1})}
                                                style={{
                                                    ...styles.catTag,
                                                    backgroundColor: filters.category === cat ? 'var(--primary)' : 'var(--bg-dark)',
                                                    color: filters.category === cat ? '#000' : 'var(--text-secondary)',
                                                    borderColor: filters.category === cat ? 'var(--primary)' : 'var(--border)'
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Results Section */}
            <section style={styles.resultsSection}>
                <div className="container">
                    <div style={styles.resultsHeader}>
                        <div style={styles.countInfo}>
                            <Megaphone size={18} color="var(--primary)" />
                            <span>Showing {campaigns.length} verified campaigns</span>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div style={styles.skeletonGrid}>
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="card" style={styles.skeletonCard}>
                                    <div style={styles.skeletonImg}></div>
                                    <div style={styles.skeletonContent}>
                                        <div style={styles.skeletonLine}></div>
                                        <div style={{...styles.skeletonLine, width: '60%'}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={viewMode === 'grid' ? styles.grid : styles.list}>
                            {campaigns.length > 0 ? campaigns.map(campaign => (
                                <CampaignCard key={campaign._id} campaign={campaign} />
                            )) : (
                                <div style={styles.emptyState}>
                                    <div style={styles.emptyIcon}>
                                        <AlertCircle size={40} color="var(--text-muted)"/>
                                    </div>
                                    <h2 style={styles.emptyTitle}>No campaigns found</h2>
                                    <p style={styles.emptySub}>We couldn't find any campaigns matching your criteria. Try adjusting your filters or search terms.</p>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => setFilters({ category: 'All', search: '', sort: 'newest', page: 1 })}
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div style={styles.pagination}>
                            <button 
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                style={{...styles.pageBtn, opacity: filters.page === 1 ? 0.5 : 1}}
                            >
                                Previous
                            </button>
                            <div style={styles.pageNumbers}>
                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button 
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        style={{
                                            ...styles.pageBtn,
                                            backgroundColor: filters.page === i + 1 ? 'var(--primary)' : 'transparent',
                                            color: filters.page === i + 1 ? '#000' : 'var(--text-primary)'
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page === pagination.pages}
                                style={{...styles.pageBtn, opacity: filters.page === pagination.pages ? 0.5 : 1}}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

const styles = {
    page: { backgroundColor: 'var(--bg-dark)', minHeight: '100vh' },
    heroSection: { padding: '8rem 0 4rem', background: 'radial-gradient(circle at 50% 0%, rgba(138, 180, 248, 0.05) 0%, transparent 70%)' },
    heroContent: { textAlign: 'center', maxWidth: '800px', margin: '0 auto' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.25rem', borderRadius: '100px', background: 'var(--glass)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '1.5rem' },
    heroTitle: { fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.1' },
    heroSub: { fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6' },
    controlsSection: { padding: '2rem 0', position: 'sticky', top: '80px', zIndex: 900, backgroundColor: 'rgba(15, 17, 20, 0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' },
    controlsWrapper: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
    searchBox: { position: 'relative', flex: 1, display: 'flex', alignItems: 'center' },
    searchIcon: { position: 'absolute', left: '1.5rem', color: 'var(--text-muted)' },
    searchInput: { padding: '1rem 3.5rem', fontSize: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', color: '#fff' },
    clearSearch: { position: 'absolute', right: '1.25rem', background: 'var(--glass)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    actionButtons: { display: 'flex', gap: '1rem', alignItems: 'center' },
    filterToggle: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.5rem', borderRadius: '14px', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s' },
    viewToggle: { display: 'flex', background: 'var(--bg-surface)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border)' },
    viewBtn: { background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    filterDrawer: { marginTop: '1.5rem', padding: '2rem', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden' },
    filterGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' },
    filterLabel: { display: 'block', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' },
    categoryWrap: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem' },
    catTag: { padding: '0.6rem 1.25rem', borderRadius: '100px', border: '1px solid var(--border)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
    resultsSection: { padding: '4rem 0 10rem' },
    resultsHeader: { marginBottom: '2.5rem' },
    countInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: '700', color: 'var(--text-secondary)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' },
    list: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '8rem 0' },
    emptyIcon: { width: '80px', height: '80px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' },
    emptyTitle: { fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' },
    emptySub: { fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' },
    skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' },
    skeletonCard: { height: '450px', padding: 0, overflow: 'hidden' },
    skeletonImg: { height: '220px', background: 'var(--glass)', width: '100%' },
    skeletonContent: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
    skeletonLine: { height: '20px', background: 'var(--glass)', borderRadius: '4px', width: '100%' },
    select: { padding: '0.8rem 1.25rem', borderRadius: '12px', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: '#fff', fontSize: '1rem', width: '100%', cursor: 'pointer' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '5rem' },
    pageNumbers: { display: 'flex', gap: '0.5rem' },
    pageBtn: { padding: '0.6rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s', background: 'transparent', color: 'var(--text-primary)' }
};

export default Campaigns;
