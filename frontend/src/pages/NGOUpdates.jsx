import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    MessageSquare, 
    Calendar, 
    Send,
    AlertCircle,
    Megaphone,
    Trash2,
    CheckCircle
} from 'lucide-react';
import { fetchNGOCampaigns, fetchNGOUpdates, postNGOUpdate, deleteNGOUpdate } from '../services/api';
import Spinner from '../components/Spinner';

const NGOUpdates = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        campaignId: '',
        title: '',
        content: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [campaignsRes, updatesRes] = await Promise.all([
                fetchNGOCampaigns(),
                fetchNGOUpdates()
            ]);

            // Support both 'APPROVED' (new) and 'Active' (old) statuses
            const approved = campaignsRes.data.campaigns.filter(c => 
                c.status === 'APPROVED' || c.status === 'Active' || c.status === 'ACTIVE'
            );
            setCampaigns(approved);
            setUpdates(updatesRes.data.updates);

            if (approved.length > 0) {
                setFormData(prev => ({ ...prev, campaignId: approved[0]._id }));
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchUpdatesData = async () => {
        try {
            const res = await fetchNGOUpdates();
            setUpdates(res.data.updates);
        } catch (err) {
            console.error('Error fetching updates:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            await postNGOUpdate(formData);
            setMessage({ type: 'success', text: 'Update posted successfully!' });
            setFormData({ ...formData, title: '', content: '' });
            fetchUpdatesData();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to post update' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this update?')) return;
        
        try {
            await deleteNGOUpdate(id);
            setUpdates(updates.filter(u => u._id !== id));
        } catch (err) {
            alert('Failed to delete update');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Campaign Updates</h1>
                <p style={styles.subtitle}>Keep your donors informed about the progress</p>
            </div>

            <div style={styles.grid}>
                {/* Left Side: Post Update Form */}
                <div style={styles.formColumn}>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <Plus size={20}/>
                            <h2 style={styles.cardTitle}>Post New Update</h2>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            {campaigns.length === 0 ? (
                                <div style={styles.noCampaignsAlert}>
                                    <AlertCircle size={20}/>
                                    <span>You don't have any approved campaigns yet. You can only post updates for approved campaigns.</span>
                                </div>
                            ) : (
                                <>
                                    {message.text && (
                                        <div style={{ 
                                            ...styles.alert, 
                                            backgroundColor: message.type === 'success' ? '#22c55e15' : '#ef444415',
                                            color: message.type === 'success' ? '#22c55e' : '#ef4444',
                                            border: `1px solid ${message.type === 'success' ? '#22c55e30' : '#ef444430'}`
                                        }}>
                                            {message.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                                            <span>{message.text}</span>
                                        </div>
                                    )}

                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Select Campaign</label>
                                        <select 
                                            style={styles.select}
                                            value={formData.campaignId}
                                            onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                                            required
                                        >
                                            {campaigns.map(c => (
                                                <option key={c._id} value={c._id}>{c.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Update Title</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g., Phase 1 Completed"
                                            style={styles.input}
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Content</label>
                                        <textarea 
                                            placeholder="Describe the update in detail..."
                                            style={styles.textarea}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        style={styles.submitBtn}
                                        disabled={submitting}
                                    >
                                        <Send size={18}/>
                                        {submitting ? 'Posting...' : 'Post Update'}
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>

                {/* Right Side: Manage Updates */}
                <div style={styles.listColumn}>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <MessageSquare size={20}/>
                            <h2 style={styles.cardTitle}>Recent Updates</h2>
                        </div>
                        <div style={styles.updateList}>
                            {updates.length > 0 ? (
                                updates.map(update => (
                                    <div key={update._id} style={styles.updateItem}>
                                        <div style={styles.updateHeader}>
                                            <h4 style={styles.updateTitle}>{update.title}</h4>
                                            <button 
                                                style={styles.deleteBtn}
                                                onClick={() => handleDelete(update._id)}
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                        <p style={styles.updateCampaign}>Campaign: {update.campaignId?.title}</p>
                                        <p style={styles.updateContent}>{update.content}</p>
                                        <div style={styles.updateFooter}>
                                            <Calendar size={14}/>
                                            <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={styles.empty}>
                                    <Megaphone size={32} style={{ marginBottom: '1rem', color: '#475569' }}/>
                                    <p>No updates posted yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    header: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: 'white' },
    subtitle: { color: '#94a3b8', fontSize: '0.9rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
    formColumn: { display: 'flex', flexDirection: 'column' },
    listColumn: { display: 'flex', flexDirection: 'column' },
    card: { background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden', height: 'fit-content' },
    cardHeader: { padding: '1.25rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' },
    cardTitle: { fontSize: '1.1rem', fontWeight: '600' },
    form: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    label: { color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' },
    input: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.85rem 1rem', color: 'white', outline: 'none' },
    textarea: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.85rem 1rem', color: 'white', outline: 'none', minHeight: '150px', resize: 'vertical' },
    select: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.85rem 1rem', color: 'white', outline: 'none' },
    submitBtn: { 
        background: '#22c55e', 
        color: 'white', 
        border: 'none', 
        padding: '1rem', 
        borderRadius: '12px', 
        fontWeight: '700', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '0.75rem', 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':disabled': { opacity: 0.5, cursor: 'not-allowed' }
    },
    alert: { padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' },
    noCampaignsAlert: { padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', background: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b30', fontSize: '0.9rem', lineHeight: '1.5' },
    updateList: { maxHeight: '600px', overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    updateItem: { background: '#0f172a', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' },
    updateHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
    updateTitle: { color: 'white', fontWeight: '600', fontSize: '1rem' },
    deleteBtn: { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', ':hover': { color: '#ef4444' } },
    updateCampaign: { color: '#22c55e', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.75rem' },
    updateContent: { color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' },
    updateFooter: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem' },
    empty: { padding: '3rem', textAlign: 'center', color: '#64748b' }
};

export default NGOUpdates;
