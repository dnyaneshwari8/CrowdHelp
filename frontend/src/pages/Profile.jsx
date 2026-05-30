import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile, downloadCertificate } from '../services/api';
import Spinner from '../components/Spinner';
import { Camera, Download, Award, Heart, History as HistoryIcon } from 'lucide-react';

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
                <div style={styles.imageSection}>
                    <img 
                        src={profile.user.profileImage ? `http://localhost:5000${profile.user.profileImage}` : 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        style={styles.profilePic} 
                    />
                    {isEditing && (
                        <label style={styles.uploadLabel}>
                            <Camera size={20} />
                            <input type="file" onChange={(e) => setImage(e.target.files[0])} style={{ display: 'none' }} />
                        </label>
                    )}
                </div>
                
                <div style={styles.headerInfo}>
                    {!isEditing ? (
                        <>
                            <h1>{profile.user.name}</h1>
                            <p>{profile.user.email}</p>
                            <p>{profile.user.phone}</p>
                            <button onClick={() => setIsEditing(true)} style={styles.editBtn}>Edit Profile</button>
                        </>
                    ) : (
                        <form onSubmit={handleUpdate} style={styles.editForm}>
                            <input 
                                type="text" 
                                value={formData.name} 
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                placeholder="Name"
                            />
                            <input 
                                type="text" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                                placeholder="Phone"
                            />
                            <div style={styles.editActions}>
                                <button type="submit" style={styles.saveBtn}>Save</button>
                                <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>

                <div style={styles.stats}>
                    <div style={styles.statItem}>
                        <h3>{profile.stats.count}</h3>
                        <p>Donations</p>
                    </div>
                    <div style={styles.statItem}>
                        <h3>₹{profile.stats.totalDonated.toLocaleString()}</h3>
                        <p>Contributed</p>
                    </div>
                </div>
            </div>

            <div style={styles.sections}>
                <div className="card" style={styles.section}>
                    <h2 style={styles.sectionTitle}><Award /> My Certificates</h2>
                    <div style={styles.list}>
                        {profile.user.certificates.length > 0 ? profile.user.certificates.map(certId => (
                            <div key={certId} style={styles.listItem}>
                                <span>Donation Certificate - {certId.substring(0, 8)}...</span>
                                <button onClick={() => downloadCertificate(certId)} style={styles.downloadBtn}>
                                    <Download size={16} /> Download
                                </button>
                            </div>
                        )) : <p>No certificates earned yet.</p>}
                    </div>
                </div>

                <div className="card" style={styles.section}>
                    <h2 style={styles.sectionTitle}><Heart /> Favorite Campaigns</h2>
                    <div style={styles.list}>
                        {profile.user.favorites.length > 0 ? profile.user.favorites.map(fav => (
                            <div key={fav._id} style={styles.listItem}>
                                <span>{fav.title}</span>
                                <button onClick={() => window.location.href = `/campaigns/${fav._id}`} style={styles.viewBtn}>View</button>
                            </div>
                        )) : <p>No favorites added yet.</p>}
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
        display: 'flex',
        alignItems: 'center',
        gap: '3rem',
        padding: '3rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
    },
    imageSection: {
        position: 'relative'
    },
    profilePic: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '4px solid #646cff'
    },
    uploadLabel: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: '#646cff',
        color: 'white',
        padding: '8px',
        borderRadius: '50%',
        cursor: 'pointer'
    },
    headerInfo: {
        flex: 1,
        textAlign: 'left'
    },
    editBtn: {
        backgroundColor: 'transparent',
        color: '#646cff',
        border: '1px solid #646cff',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        marginTop: '1rem',
        width: 'auto'
    },
    stats: {
        display: 'flex',
        gap: '2rem',
        borderLeft: '1px solid #ddd',
        paddingLeft: '2rem'
    },
    statItem: {
        textAlign: 'center'
    },
    sections: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
    },
    section: {
        padding: '2rem',
        textAlign: 'left'
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1.25rem',
        color: '#646cff',
        marginBottom: '1.5rem'
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
        padding: '0.8rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        fontSize: '0.9rem'
    },
    downloadBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        width: 'auto',
        fontSize: '0.8rem',
        padding: '0.4rem 0.8rem'
    },
    viewBtn: {
        width: 'auto',
        fontSize: '0.8rem',
        padding: '0.4rem 0.8rem'
    },
    editForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    editActions: {
        display: 'flex',
        gap: '0.5rem',
        marginTop: '0.5rem'
    },
    saveBtn: {
        backgroundColor: '#4CAF50',
        width: 'auto',
        padding: '0.4rem 1rem'
    },
    cancelBtn: {
        backgroundColor: '#f44336',
        width: 'auto',
        padding: '0.4rem 1rem'
    }
};

export default Profile;
