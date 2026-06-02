import React, { useState, useEffect } from 'react';
import { fetchCampaigns, fetchAllCampaignsAdmin, fetchNGOCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminCampaigns = () => {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Education',
        goalAmount: '',
        startDate: '',
        endDate: ''
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (user) {
            loadCampaigns();
        }
    }, [user]);

    const loadCampaigns = async () => {
        try {
            let res;
            if (user?.role === 'ADMIN') {
                res = await fetchAllCampaignsAdmin();
            } else if (user?.role === 'NGO') {
                res = await fetchNGOCampaigns();
            } else {
                res = await fetchCampaigns();
            }
            setCampaigns(res.data.campaigns);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (campaign) => {
        setEditingCampaign(campaign);
        setFormData({
            title: campaign.title || '',
            description: campaign.description || '',
            category: campaign.category || 'Education',
            goalAmount: campaign.goalAmount || '',
            startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
            endDate: campaign.endDate ? campaign.endDate.split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            try {
                await deleteCampaign(id);
                loadCampaigns();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            if (editingCampaign) {
                await updateCampaign(editingCampaign._id, data);
            } else {
                await createCampaign(data);
            }
            setShowModal(false);
            setEditingCampaign(null);
            setImage(null);
            loadCampaigns();
            alert('Campaign saved successfully');
        } catch (error) {
            console.error('Operation failed:', error);
            const msg = error.response?.data?.message || 'Operation failed. Please check if all fields are filled correctly.';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Manage Campaigns</h1>
                <button onClick={() => { setEditingCampaign(null); setShowModal(true); }} style={styles.addBtn}>
                    <Plus size={20} /> Create New Campaign
                </button>
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Goal</th>
                            <th>Raised</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map(c => (
                            <tr key={c._id}>
                                <td><img src={`http://localhost:5000${c.image}`} alt="" style={styles.thumbnail} /></td>
                                <td>{c.title}</td>
                                <td>{c.category}</td>
                                <td>₹{c.goalAmount.toLocaleString()}</td>
                                <td>₹{c.currentAmount.toLocaleString()}</td>
                                <td>{c.status}</td>
                                <td style={styles.actions}>
                                    <button onClick={() => handleEdit(c)} style={styles.editBtn}><Edit size={16} /></button>
                                    {user?.role === 'ADMIN' && (
                                        <button onClick={() => handleDelete(c._id)} style={styles.deleteBtn}><Trash2 size={16} /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div className="card" style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2>{editingCampaign ? 'Edit Campaign' : 'New Campaign'}</h2>
                            <button onClick={() => setShowModal(false)} style={styles.closeBtn}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required style={styles.textarea} />
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option value="Education">Education</option>
                                <option value="Health">Health</option>
                                <option value="Environment">Environment</option>
                                <option value="Animal Welfare">Animal Welfare</option>
                                <option value="Disaster Relief">Disaster Relief</option>
                                <option value="Other">Other</option>
                            </select>
                            <input type="number" placeholder="Goal Amount" value={formData.goalAmount} onChange={e => setFormData({...formData, goalAmount: e.target.value})} required />
                            <div style={styles.row}>
                                <div style={{flex: 1}}>
                                    <label>Start Date</label>
                                    <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                                </div>
                                <div style={{flex: 1}}>
                                    <label>End Date</label>
                                    <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                                </div>
                            </div>
                            <input type="file" onChange={e => setImage(e.target.files[0])} required={!editingCampaign} />
                            <button type="submit" style={styles.submitBtn}>Save Campaign</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' },
    tableWrapper: { overflowX: 'auto', backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px' },
    table: { width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'left' },
    thumbnail: { width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' },
    actions: { display: 'flex', gap: '0.5rem' },
    editBtn: { backgroundColor: '#FF9800', width: 'auto', padding: '0.4rem' },
    deleteBtn: { backgroundColor: '#F44336', width: 'auto', padding: '0.4rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { 
        width: '100%', 
        maxWidth: '600px', 
        padding: '3rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        border: '1px solid var(--border)'
    },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    closeBtn: { background: 'none', border: 'none', color: '#666', cursor: 'pointer' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    textarea: { 
        height: '120px', 
        padding: '1rem', 
        borderRadius: '12px', 
        backgroundColor: 'var(--bg-surface)', 
        color: 'var(--text-primary)', 
        border: '1px solid var(--border)',
        fontSize: '1rem',
        fontFamily: 'inherit'
    },
    row: { display: 'flex', gap: '1.25rem' },
    submitBtn: { marginTop: '1rem', padding: '1rem' }
};

export default AdminCampaigns;
