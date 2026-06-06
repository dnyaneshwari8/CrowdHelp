import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllNGOs, toggleBlockUser } from '../services/api';
import Skeleton from '../components/Skeleton';
import { getImageUrl } from '../utils/imageHelper';
import { 
    Shield, 
    ShieldAlert, 
    Globe, 
    Mail, 
    Phone, 
    Search, 
    Filter, 
    ExternalLink, 
    Ban, 
    CheckCircle,
    Building2,
    MapPin,
    Calendar,
    AlertCircle
} from 'lucide-react';

const AdminNGOManagement = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadNGOs();
    }, []);

    const loadNGOs = async () => {
        try {
            const res = await fetchAllNGOs();
            setNgos(res.data.ngos);
        } catch (error) {
            console.error('Error fetching NGOs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (userId, isBlocked) => {
        if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this NGO?`)) return;
        try {
            await toggleBlockUser(userId);
            loadNGOs();
        } catch (error) {
            alert('Action failed');
        }
    };

    const filteredNGOs = ngos.filter(ngo => {
        const matchesSearch = ngo.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ngo.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'blocked' ? ngo.isBlocked : !ngo.isBlocked);
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div style={styles.container}>
            <div style={styles.headerSection}>
                <Skeleton width="300px" height="40px" />
                <Skeleton width="400px" height="50px" />
            </div>
            <div style={styles.grid}>
                {[1, 2, 3, 4].map(i => <Skeleton key={i} height="350px" style={{ borderRadius: '24px' }} />)}
            </div>
        </div>
    );

    return (        <div style={styles.container}>
            <header style={styles.headerSection}>
                <div>
                    <h1 style={styles.title}>Partner <span className="gradient-text">Organizations</span></h1>
                    <p style={styles.subtitle}>Manage and monitor registered NGOs on the platform.</p>
                </div>

                <div style={styles.controls}>
                    <div style={styles.searchBox}>
                        <Search size={18} style={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        style={styles.filterSelect}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All NGOs</option>
                        <option value="active">Active Only</option>
                        <option value="blocked">Blocked Only</option>
                    </select>
                </div>
            </header>

            <div style={styles.grid}>
                <AnimatePresence mode="popLayout">
                    {filteredNGOs.map((ngo, index) => (
                        <motion.div 
                            key={ngo._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="card" 
                            style={styles.card}
                        >
                            <div style={styles.cardHeader}>
                                <img 
                                    src={getImageUrl(ngo.organizationLogo)} 
                                    alt={ngo.organizationName}
                                    style={styles.logo}
                                />
                                <div style={styles.headerInfo}>
                                    <div style={styles.nameRow}>
                                        <h3 style={styles.ngoName}>{ngo.organizationName}</h3>
                                        {ngo.isBlocked && <span style={styles.blockedBadge}>Blocked</span>}
                                    </div>
                                    <p style={styles.email}><Mail size={12}/> {ngo.email}</p>
                                </div>
                            </div>

                            <div style={styles.details}>
                                <div style={styles.detailItem}>
                                    <Globe size={14} color="var(--primary)" />
                                    <a href={ngo.website} target="_blank" rel="noreferrer" style={styles.link}>
                                        {ngo.website?.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                                <div style={styles.detailItem}>
                                    <Phone size={14} color="var(--primary)" />
                                    <span>{ngo.phone || 'No phone provided'}</span>
                                </div>
                                <div style={styles.detailItem}>
                                    <Calendar size={14} color="var(--primary)" />
                                    <span>Joined {new Date(ngo.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <p style={styles.description}>{ngo.description?.substring(0, 120)}...</p>

                            <div style={styles.cardActions}>
                                <button 
                                    onClick={() => window.location.href = `/ngo/${ngo._id}`}
                                    style={styles.viewBtn}
                                >
                                    <ExternalLink size={16} /> Details
                                </button>
                                <button 
                                    onClick={() => handleToggleBlock(ngo._id, ngo.isBlocked)}
                                    style={{
                                        ...styles.blockBtn,
                                        backgroundColor: ngo.isBlocked ? 'rgba(52, 168, 83, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                                        color: ngo.isBlocked ? '#34a853' : '#ea4335'
                                    }}
                                >
                                    {ngo.isBlocked ? <><CheckCircle size={16}/> Unblock</> : <><Ban size={16}/> Block</>}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredNGOs.length === 0 && (
                <div style={styles.emptyState}>
                    <AlertCircle size={48} color="var(--text-muted)" />
                    <h3>No NGOs found</h3>
                    <p>Try adjusting your search or filter settings.</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '1400px', margin: '2rem auto', padding: '0 2rem' },
    headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' },
    title: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '1.1rem' },
    controls: { display: 'flex', gap: '1rem' },
    searchBox: { position: 'relative', display: 'flex', alignItems: 'center' },
    searchIcon: { position: 'absolute', left: '1.25rem', color: 'var(--text-muted)' },
    searchInput: { padding: '0.8rem 1rem 0.8rem 3.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', width: '320px', fontSize: '0.95rem' },
    filterSelect: { padding: '0.8rem 1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' },
    card: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)' },
    cardHeader: { display: 'flex', gap: '1.25rem', alignItems: 'center' },
    logo: { width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '1px solid var(--border)' },
    headerInfo: { flex: 1 },
    nameRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' },
    ngoName: { fontSize: '1.2rem', fontWeight: '800', margin: 0 },
    blockedBadge: { padding: '0.25rem 0.6rem', background: 'rgba(234, 67, 53, 0.1)', color: '#ea4335', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' },
    email: { fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' },
    details: { display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', background: 'var(--glass)', borderRadius: '16px' },
    detailItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' },
    link: { color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' },
    description: { fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 },
    cardActions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    viewBtn: { padding: '0.75rem', borderRadius: '12px', background: 'var(--glass-heavy)', border: '1px solid var(--border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700', cursor: 'pointer' },
    blockBtn: { padding: '0.75rem', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700', cursor: 'pointer' },
    emptyState: { textAlign: 'center', padding: '6rem', gridColumn: '1 / -1' }
};

export default AdminNGOManagement;
