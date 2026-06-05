import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageHelper';
import { fetchPendingCampaigns, approveCampaign, rejectCampaign } from '../services/api';
import Spinner from '../components/Spinner';
import { Check, X, Eye, Calendar, Target, User, Info } from 'lucide-react';

const AdminCampaignApproval = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        try {
            const res = await fetchPendingCampaigns();
            setCampaigns(res.data.campaigns);
        } catch (error) {
            console.error('Error loading pending campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this campaign?')) return;
        try {
            await approveCampaign(id);
            alert('Campaign approved and live!');
            setSelectedCampaign(null);
            loadPending();
        } catch (error) {
            alert('Approval failed');
        }
    };

    const handleReject = async (id) => {
        if (!remarks) return alert('Please provide remarks for rejection');
        if (!window.confirm('Reject this campaign?')) return;
        try {
            await rejectCampaign(id, remarks);
            alert('Campaign rejected');
            setSelectedCampaign(null);
            loadPending();
        } catch (error) {
            alert('Rejection failed');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Campaign Approval Queue</h1>
                <p>Review and moderate campaigns submitted by NGOs.</p>
            </div>
            
            <div style={styles.grid}>
                {campaigns.map(campaign => (
                    <div key={campaign._id} className="card" style={styles.card}>
                        <div style={styles.imageBox}>
                            <img src={getImageUrl(campaign.image)} alt="Campaign" style={styles.image} />
                            <div style={styles.catBadge}>{campaign.category}</div>
                        </div>
                        <div style={styles.content}>
                            <h3 style={styles.name}>{campaign.title}</h3>
                            <div style={styles.ngoInfo}>
                                <User size={14}/> 
                                <span>{campaign.ngoId?.organizationName || campaign.createdBy?.organizationName || 'Unknown NGO'}</span>
                            </div>
                            
                            <div style={styles.stats}>
                                <div style={styles.stat}>
                                    <Target size={14}/> ₹{campaign.goalAmount.toLocaleString()}
                                </div>
                                <div style={styles.stat}>
                                    <Calendar size={14}/> {new Date(campaign.endDate).toLocaleDateString()}
                                </div>
                            </div>

                            <button onClick={() => setSelectedCampaign(campaign)} style={styles.reviewBtn}>
                                <Info size={16}/> Review Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {campaigns.length === 0 && <p style={styles.noResults}>No campaigns waiting for approval.</p>}

            {/* Review Modal */}
            {selectedCampaign && (
                <div style={styles.modalOverlay}>
                    <div className="card" style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2>Campaign Review</h2>
                            <button onClick={() => setSelectedCampaign(null)} style={styles.closeBtn}><X size={20}/></button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            <img src={getImageUrl(selectedCampaign.image)} alt="Campaign" style={styles.modalImage} />
                            <div style={styles.modalContent}>
                                <h3>{selectedCampaign.title}</h3>
                                <p style={styles.fullDesc}>{selectedCampaign.description}</p>
                                
                                <div style={styles.modalMeta}>
                                    <p><strong>Goal:</strong> ₹{selectedCampaign.goalAmount.toLocaleString()}</p>
                                    <p><strong>Duration:</strong> {new Date(selectedCampaign.startDate).toLocaleDateString()} to {new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                                    <p><strong>NGO:</strong> {selectedCampaign.ngoId?.organizationName || selectedCampaign.createdBy?.organizationName}</p>
                                </div>

                                <div style={styles.remarksBox}>
                                    <label>Admin Remarks (required for rejection)</label>
                                    <textarea 
                                        value={remarks} 
                                        onChange={(e) => setRemarks(e.target.value)} 
                                        placeholder="Feedback for the NGO..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button onClick={() => handleApprove(selectedCampaign._id)} style={styles.approveBtn}><Check size={18}/> Approve & Go Live</button>
                            <button onClick={() => handleReject(selectedCampaign._id)} style={styles.rejectBtn}><X size={18}/> Reject Campaign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' },
    header: { marginBottom: '3rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' },
    card: { padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    imageBox: { height: '180px', position: 'relative' },
    image: { width: '100%', height: '100%', objectFit: 'cover' },
    catBadge: { position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' },
    content: { padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' },
    name: { margin: 0, fontSize: '1.25rem' },
    ngoInfo: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600' },
    stats: { display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' },
    stat: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
    reviewBtn: { marginTop: 'auto', background: 'var(--glass)', color: 'var(--text-primary)', border: '1px solid var(--border)', width: '100%' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '2rem' },
    modal: { width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '0' },
    modalHeader: { padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' },
    closeBtn: { background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 'auto' },
    modalBody: { display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2.5rem', padding: '2.5rem' },
    modalImage: { width: '100%', height: '300px', borderRadius: '16px', objectFit: 'cover' },
    modalContent: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    fullDesc: { lineHeight: '1.6', color: 'var(--text-secondary)' },
    modalMeta: { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', fontSize: '0.95rem' },
    remarksBox: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    modalFooter: { padding: '1.5rem 2.5rem', display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)' },
    approveBtn: { background: '#4CAF50', color: 'white', flex: 1 },
    rejectBtn: { background: '#F44336', color: 'white', flex: 1 },
    noResults: { textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)', fontSize: '1.2rem' }
};

export default AdminCampaignApproval;
