import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile, downloadCertificate } from '../services/api';
import Spinner from '../components/Spinner';
import { Camera, Download, Award, Heart, Mail, Phone as PhoneIcon, MapPin, Edit3, ShieldCheck } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [image, setImage] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await fetchUserProfile();
            setProfile(res.data);
            setFormData({ name: res.data.user.name, phone: res.data.user.phone });
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('phone', formData.phone);
        if (image) data.append('profileImage', image);

        try {
            await updateUserProfile(data);
            setIsEditing(false);
            loadProfile();
            alert('Profile updated successfully');
        } catch (error) {
            alert('Update failed');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div className="card" style={styles.profileHeader}>
                <div style={styles.headerTop}>
                    <div style={styles.imageSection}>
                        <img 
                            src={profile.user.profileImage ? `http://localhost:5000${profile.user.profileImage}` : 'https://placehold.co/150'} 
                            alt="Profile" 
                            style={styles.profilePic} 
                        />
                        {isEditing && (
                            <label style={styles.uploadLabel}>
                                <Camera size={18} />
                                <input type="file" onChange={(e) => setImage(e.target.files[0])} style={{ display: 'none' }} />
                            </label>
                        )}
                    </div>
                    
                    <div style={styles.headerInfo}>
                        {!isEditing ? (
                            <>
                                <h1 style={styles.name}>{profile.user.name}</h1>
                                <div style={styles.contactInfo}>
                                    <span><Mail size={16}/> {profile.user.email}</span>
                                    <span><PhoneIcon size={16}/> {profile.user.phone}</span>
                                </div>
                                {profile.user.ngoStatus !== 'NONE' && (
                                    <div style={{
                                        ...styles.ngoStatusBadge,
                                        backgroundColor: profile.user.ngoStatus === 'APPROVED' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                        color: profile.user.ngoStatus === 'APPROVED' ? '#4CAF50' : '#FF9800'
                                    }}>
                                        <ShieldCheck size={14}/> {profile.user.ngoStatus} NGO
                                    </div>
                                )}
                                <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
                                    <Edit3 size={16}/> Edit Profile
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleUpdate} style={styles.editForm}>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                    placeholder="Full Name"
                                    style={styles.editInput}
                                />
                                <input 
                                    type="text" 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                                    placeholder="Phone Number"
                                    style={styles.editInput}
                                />
                                <div style={styles.editActions}>
                                    <button type="submit" style={styles.saveBtn}>Save Changes</button>
                                    <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div style={styles.statsRow}>
                    <div style={styles.statItem}>
                        <div style={styles.statValue}>{profile.stats.count}</div>
                        <div style={styles.statLabel}>Total Donations</div>
                    </div>
                    <div style={styles.statItem}>
                        <div style={styles.statValue}>₹{profile.stats.totalDonated.toLocaleString()}</div>
                        <div style={styles.statLabel}>Total Contributed</div>
                    </div>
                </div>
            </div>

            <div style={styles.sections}>
                <div className="card" style={styles.section}>
                    <h2 style={styles.sectionTitle}><Award color="var(--primary)"/> My Certificates</h2>
                    <div style={styles.list}>
                        {profile.user.certificates.length > 0 ? profile.user.certificates.map(certId => (
                            <div key={certId} style={styles.listItem}>
                                <div style={styles.itemInfo}>
                                    <span style={styles.itemTitle}>Donation Certificate</span>
                                    <span style={styles.itemId}>#{certId.substring(0, 8)}</span>
                                </div>
                                <button onClick={() => downloadCertificate(certId)} style={styles.downloadBtn}>
                                    <Download size={16} />
                                </button>
                            </div>
                        )) : <p style={styles.emptyMsg}>No certificates earned yet.</p>}
                    </div>
                </div>

                <div className="card" style={styles.section}>
                    <h2 style={styles.sectionTitle}><Heart color="#f44336"/> Saved Campaigns</h2>
                    <div style={styles.list}>
                        {profile.user.favorites.length > 0 ? profile.user.favorites.map(fav => (
                            <div key={fav._id} style={styles.listItem}>
                                <div style={styles.itemInfo}>
                                    <span style={styles.itemTitle}>{fav.title}</span>
                                    <span style={styles.itemCategory}>{fav.category}</span>
                                </div>
                                <button onClick={() => window.location.href = `/campaigns/${fav._id}`} style={styles.viewBtn}>
                                    View
                                </button>
                            </div>
                        )) : <p style={styles.emptyMsg}>No favorites added yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '0 2rem'
    },
    profileHeader: {
        padding: '3rem',
        marginBottom: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem'
    },
    headerTop: {
        display: 'flex',
        alignItems: 'center',
        gap: '3rem',
        flexWrap: 'wrap'
    },
    imageSection: {
        position: 'relative'
    },
    profilePic: {
        width: '140px',
        height: '140px',
        borderRadius: '32px',
        objectFit: 'cover',
        border: '4px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
    },
    uploadLabel: {
        position: 'absolute',
        bottom: '-10px',
        right: '-10px',
        backgroundColor: 'var(--primary)',
        color: '#000',
        padding: '10px',
        borderRadius: '14px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(138, 180, 248, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerInfo: {
        flex: 1,
        textAlign: 'left'
    },
    name: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
        fontWeight: '800'
    },
    contactInfo: {
        display: 'flex',
        gap: '1.5rem',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
        marginBottom: '1.5rem'
    },
    ngoStatusBadge: {
        padding: '0.5rem 1rem',
        borderRadius: '100px',
        fontSize: '0.85rem',
        fontWeight: '700',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem'
    },
    editBtn: {
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        padding: '0.6rem 1.2rem',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '600',
        width: 'auto'
    },
    editForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '400px'
    },
    editInput: {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        padding: '0.8rem 1rem'
    },
    editActions: {
        display: 'flex',
        gap: '1rem'
    },
    saveBtn: {
        backgroundColor: 'var(--primary)',
        color: '#000',
        width: 'auto'
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        width: 'auto'
    },
    statsRow: {
        display: 'flex',
        gap: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border)'
    },
    statItem: {
        textAlign: 'left'
    },
    statValue: {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#fff'
    },
    statLabel: {
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    sections: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
    },
    section: {
        padding: '2.5rem'
    },
    sectionTitle: {
        fontSize: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem',
        background: 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)'
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        textAlign: 'left'
    },
    itemTitle: {
        fontWeight: '700',
        color: '#fff'
    },
    itemId: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
    },
    itemCategory: {
        fontSize: '0.8rem',
        color: 'var(--primary)',
        fontWeight: '600'
    },
    downloadBtn: {
        padding: '0.75rem',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        color: 'var(--text-primary)',
        width: 'auto'
    },
    viewBtn: {
        padding: '0.5rem 1.25rem',
        borderRadius: '10px',
        fontSize: '0.85rem',
        width: 'auto',
        background: 'var(--glass)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)'
    },
    emptyMsg: {
        color: 'var(--text-secondary)',
        fontSize: '0.95rem'
    }
};

export default Profile;
