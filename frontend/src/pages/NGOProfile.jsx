import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Building2, 
    Mail, 
    Phone, 
    Globe, 
    MapPin, 
    FileText,
    Camera,
    Save,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import api from '../services/api';

const NGOProfile = () => {
    const { user, loginUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [logoPreview, setLogoPreview] = useState(user?.organizationLogo);
    
    const [formData, setFormData] = useState({
        organizationName: user?.organizationName || '',
        organizationDescription: user?.organizationDescription || '',
        organizationPhone: user?.organizationPhone || '',
        registrationNumber: user?.registrationNumber || '',
        website: user?.website || '',
        address: user?.address || '',
        logo: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'logo') {
                if (formData.logo) data.append('organizationLogo', formData.logo);
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            const res = await api.patch('/ngo/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update auth context with new user data
            loginUser(res.data.data.user, localStorage.getItem('token'));
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>NGO Profile</h1>
                <p style={styles.subtitle}>Manage your organization's public information</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.formGrid}>
                {/* Left Column - Logo & Identity */}
                <div style={styles.column}>
                    <div style={styles.card}>
                        <div style={styles.logoSection}>
                            <div style={styles.logoWrapper}>
                                <img src={logoPreview || 'https://placehold.co/150'} alt="Logo" style={styles.logo}/>
                                <label style={styles.uploadOverlay}>
                                    <Camera size={24}/>
                                    <input type="file" hidden onChange={handleLogoChange}/>
                                </label>
                            </div>
                            <h3 style={styles.orgName}>{user?.organizationName}</h3>
                            <p style={styles.regNum}>Reg No: {user?.registrationNumber}</p>
                        </div>
                        <div style={styles.divider}/>
                        <div style={styles.statsRow}>
                            <div style={styles.stat}>
                                <span style={styles.statVal}>12</span>
                                <span style={styles.statLab}>Campaigns</span>
                            </div>
                            <div style={styles.stat}>
                                <span style={styles.statVal}>4.8k</span>
                                <span style={styles.statLab}>Donors</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ ...styles.card, marginTop: '1.5rem' }}>
                        <h3 style={styles.cardTitle}>Status Information</h3>
                        <div style={styles.statusInfo}>
                            <div style={styles.statusItem}>
                                <span style={styles.statusLabel}>Verification Status</span>
                                <span style={{ ...styles.statusBadge, color: '#22c55e', background: '#22c55e15' }}>
                                    <CheckCircle size={14}/> Approved
                                </span>
                            </div>
                            <div style={styles.statusItem}>
                                <span style={styles.statusLabel}>Member Since</span>
                                <span style={styles.statusVal}>{new Date(user?.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Editable Details */}
                <div style={styles.column}>
                    <div style={styles.card}>
                        {message.text && (
                            <div style={{ 
                                ...styles.alert, 
                                backgroundColor: message.type === 'success' ? '#22c55e15' : '#ef444415',
                                color: message.type === 'success' ? '#22c55e' : '#ef4444'
                            }}>
                                {message.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                                <span>{message.text}</span>
                            </div>
                        )}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Building2 size={16}/> Organization Name</label>
                            <input 
                                type="text" 
                                name="organizationName"
                                style={styles.input}
                                value={formData.organizationName}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><FileText size={16}/> Description</label>
                            <textarea 
                                name="organizationDescription"
                                style={styles.textarea}
                                value={formData.organizationDescription}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={styles.row}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><Phone size={16}/> Contact Phone</label>
                                <input 
                                    type="text" 
                                    name="organizationPhone"
                                    style={styles.input}
                                    value={formData.organizationPhone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><Globe size={16}/> Website</label>
                                <input 
                                    type="url" 
                                    name="website"
                                    style={styles.input}
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><MapPin size={16}/> Address</label>
                            <textarea 
                                name="address"
                                style={{ ...styles.textarea, minHeight: '80px' }}
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <button 
                            type="submit" 
                            style={styles.saveBtn}
                            disabled={loading}
                        >
                            <Save size={18}/>
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    header: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: 'white' },
    subtitle: { color: '#94a3b8', fontSize: '0.9rem' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' },
    column: { display: 'flex', flexDirection: 'column' },
    card: { background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '2rem' },
    logoSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' },
    logoWrapper: { width: '120px', height: '120px', borderRadius: '50%', position: 'relative', overflow: 'hidden', border: '3px solid #334155' },
    logo: { width: '100%', height: '100%', objectFit: 'cover' },
    uploadOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s ease', ':hover': { opacity: 1 } },
    orgName: { fontSize: '1.25rem', fontWeight: '700', color: 'white' },
    regNum: { fontSize: '0.85rem', color: '#64748b' },
    divider: { height: '1px', background: '#334155', margin: '1.5rem 0' },
    statsRow: { display: 'flex', justifyContent: 'space-around' },
    stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' },
    statVal: { fontSize: '1.25rem', fontWeight: '700', color: 'white' },
    statLab: { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' },
    cardTitle: { fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' },
    statusInfo: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    statusItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    statusLabel: { color: '#94a3b8', fontSize: '0.9rem' },
    statusBadge: { padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    statusVal: { color: 'white', fontSize: '0.9rem', fontWeight: '500' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' },
    label: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' },
    input: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.85rem 1rem', color: 'white', outline: 'none', transition: 'border-color 0.2s ease', ':focus': { borderColor: '#22c55e' } },
    textarea: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.85rem 1rem', color: 'white', outline: 'none', minHeight: '120px', resize: 'vertical' },
    row: { display: 'flex', gap: '1.5rem' },
    saveBtn: { width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease', marginTop: '1rem' },
    alert: { padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid transparent' }
};

export default NGOProfile;
