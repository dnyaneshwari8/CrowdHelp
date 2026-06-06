import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserProfile, updateUserProfile, downloadCertificate, changePassword } from '../services/api';
import Spinner from '../components/Spinner';
import { getImageUrl } from '../utils/imageHelper';
import { 
    Camera, 
    Download, 
    Award, 
    Heart, 
    Mail, 
    Phone as PhoneIcon, 
    MapPin, 
    Edit3, 
    ShieldCheck, 
    Lock,
    LogOut,
    CheckCircle2,
    Calendar,
    IndianRupee,
    ChevronRight,
    User as UserIcon,
    Settings,
    ArrowUpRight,
    Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { logoutUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
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

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passData.newPassword !== passData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        try {
            await changePassword({ 
                oldPassword: passData.oldPassword, 
                newPassword: passData.newPassword 
            });
            setIsChangingPassword(false);
            setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            alert('Password changed successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Password change failed');
        }
    };

    if (loading) return <Spinner />;

    const stats = [
        { label: 'Total Donated', value: `₹${profile.stats.totalDonated.toLocaleString()}`, icon: <IndianRupee size={20}/>, color: '#34a853' },
        { label: 'Campaigns Supported', value: profile.stats.count, icon: <Heart size={20}/>, color: '#ea4335' },
        { label: 'Certificates', value: profile.user.certificates.length, icon: <Award size={20}/>, color: 'var(--primary)' },
        { label: 'Impact Rank', value: '#12', icon: <Trophy size={20}/>, color: '#fbbc04' },
    ];

    return (
        <div style={styles.page}>
            <div className="container">
                {/* Dashboard Header */}
                <header style={styles.header}>
                    <div style={styles.profileBrand}>
                        <div style={styles.avatarWrapper}>
                            <img 
                                src={profile.user.profileImage ? getImageUrl(profile.user.profileImage) : `https://ui-avatars.com/api/?name=${profile.user.name}&background=8ab4f8&color=000`} 
                                alt="Profile" 
                                style={styles.profileImg} 
                            />
                            {isEditing && (
                                <label style={styles.cameraBtn}>
                                    <Camera size={16} />
                                    <input type="file" onChange={(e) => setImage(e.target.files[0])} style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>
                        <div style={styles.brandInfo}>
                            <div style={styles.nameRow}>
                                <h1 style={styles.userName}>{profile.user.name}</h1>
                                {profile.user.role === 'NGO' && (
                                    <span style={styles.ngoTag}><ShieldCheck size={14}/> Verified NGO</span>
                                )}
                            </div>
                            <p style={styles.userEmail}>{profile.user.email}</p>
                            <div style={styles.headerActions}>
                                <button onClick={() => setIsEditing(!isEditing)} className="btn btn-secondary" style={styles.miniBtn}>
                                    {isEditing ? 'Cancel' : <><Edit3 size={16}/> Edit Profile</>}
                                </button>
                                <button onClick={logoutUser} className="btn btn-ghost" style={{...styles.miniBtn, color: 'var(--error)'}}>
                                    <LogOut size={16}/> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {isEditing && (
                    <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} style={styles.editSection}>
                        <div className="card" style={styles.editCard}>
                            <h3>Update Profile Information</h3>
                            <form onSubmit={handleUpdate} style={styles.editForm}>
                                <div style={styles.formRow}>
                                    <div className="form-group" style={{flex: 1}}>
                                        <label>Full Name</label>
                                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{flex: 1}}>
                                        <label>Phone Number</label>
                                        <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div style={styles.statsGrid}>
                    {stats.map((stat, i) => (
                        <div key={i} className="card" style={styles.statCard}>
                            <div style={{...styles.statIcon, backgroundColor: `${stat.color}15`, color: stat.color}}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={styles.statLabel}>{stat.label}</p>
                                <h3 style={styles.statValue}>{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.mainGrid}>
                    {/* Left Column */}
                    <div style={styles.colMain}>
                        <div className="card" style={styles.sectionCard}>
                            <div style={styles.sectionHeader}>
                                <h2 style={styles.sectionTitle}><Award size={20} color="var(--primary)"/> Impact Certificates</h2>
                                <span style={styles.countBadge}>{profile.user.certificates.length} Total</span>
                            </div>
                            <div style={styles.certList}>
                                {profile.user.certificates.length > 0 ? profile.user.certificates.map(certId => (
                                    <div key={certId} style={styles.certItem}>
                                        <div style={styles.certIcon}><CheckCircle2 size={24} color="var(--success)"/></div>
                                        <div style={{flex: 1}}>
                                            <p style={styles.certName}>Donation Acknowledgment</p>
                                            <p style={styles.certMeta}>Issued on {new Date().toLocaleDateString()}</p>
                                        </div>
                                        <button onClick={() => downloadCertificate(certId)} style={styles.downloadBtn}>
                                            <Download size={18} />
                                        </button>
                                    </div>
                                )) : (
                                    <div style={styles.emptyState}>
                                        <p>No certificates earned yet. Start donating to make an impact!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card" style={styles.sectionCard}>
                            <div style={styles.sectionHeader}>
                                <h2 style={styles.sectionTitle}><Heart size={20} color="#ea4335"/> Saved Campaigns</h2>
                            </div>
                            <div style={styles.favList}>
                                {profile.user.favorites.length > 0 ? profile.user.favorites.map(fav => (
                                    <div key={fav._id} style={styles.favItem}>
                                        <div style={styles.favThumb}>{fav.title[0]}</div>
                                        <div style={{flex: 1}}>
                                            <p style={styles.favTitle}>{fav.title}</p>
                                            <p style={styles.favCategory}>{fav.category}</p>
                                        </div>
                                        <button onClick={() => window.location.href = `/campaigns/${fav._id}`} style={styles.viewBtn}>
                                            View <ArrowUpRight size={16}/>
                                        </button>
                                    </div>
                                )) : (
                                    <div style={styles.emptyState}>
                                        <p>Your saved campaigns will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={styles.colSide}>
                        <div className="card" style={styles.securityCard}>
                            <div style={styles.sectionHeader}>
                                <h2 style={styles.sectionTitle}><Lock size={20} color="#FF9800"/> Security</h2>
                            </div>
                            {!isChangingPassword ? (
                                <button onClick={() => setIsChangingPassword(true)} style={styles.changePassTrigger}>
                                    <div style={styles.triggerIcon}><Settings size={18}/></div>
                                    <div style={{textAlign: 'left'}}>
                                        <p style={styles.triggerTitle}>Update Password</p>
                                        <p style={styles.triggerSub}>Change your account access</p>
                                    </div>
                                    <ChevronRight size={18} style={{marginLeft: 'auto'}}/>
                                </button>
                            ) : (
                                <form onSubmit={handleChangePassword} style={styles.passForm}>
                                    <div className="form-group">
                                        <input type="password" placeholder="Old Password" value={passData.oldPassword} onChange={(e) => setPassData({...passData, oldPassword: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" placeholder="New Password" value={passData.newPassword} onChange={(e) => setPassData({...passData, newPassword: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" placeholder="Confirm New Password" value={passData.confirmPassword} onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})} required />
                                    </div>
                                    <div style={styles.editActions}>
                                        <button type="submit" className="btn btn-primary" style={{flex: 1}}>Update</button>
                                        <button type="button" onClick={() => setIsChangingPassword(false)} className="btn btn-secondary">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="card" style={styles.supportCard}>
                            <h3 style={styles.sideTitle}>Need Help?</h3>
                            <p style={styles.sideText}>Our support team is available 24/7 for any donation or platform issues.</p>
                            <button className="btn btn-secondary" style={{width: '100%'}}>Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { padding: '6rem 0 10rem', backgroundColor: 'var(--bg-dark)' },
    header: { marginBottom: '4rem' },
    profileBrand: { display: 'flex', gap: '2.5rem', alignItems: 'center' },
    avatarWrapper: { position: 'relative' },
    profileImg: { width: '120px', height: '120px', borderRadius: '32px', border: '4px solid var(--border)', objectFit: 'cover', boxShadow: 'var(--shadow-lg)' },
    cameraBtn: { position: 'absolute', bottom: '-8px', right: '-8px', width: '36px', height: '36px', background: 'var(--primary)', color: '#000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '3px solid var(--bg-dark)' },
    brandInfo: { flex: 1 },
    nameRow: { display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' },
    userName: { fontSize: '2.5rem', fontWeight: '900', margin: 0 },
    ngoTag: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: 'rgba(52, 168, 83, 0.1)', color: '#34a853', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' },
    userEmail: { fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' },
    headerActions: { display: 'flex', gap: '1rem' },
    miniBtn: { padding: '0.6rem 1.25rem', fontSize: '0.9rem', borderRadius: '12px' },
    editSection: { marginBottom: '3rem' },
    editCard: { padding: '2rem' },
    editForm: { display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' },
    formRow: { display: 'flex', gap: '1.5rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' },
    statCard: { padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' },
    statIcon: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statLabel: { fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' },
    statValue: { fontSize: '1.5rem', fontWeight: '800', margin: 0 },
    mainGrid: { display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '2rem' },
    sectionCard: { padding: '2rem', marginBottom: '2rem' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' },
    countBadge: { background: 'var(--glass)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' },
    certList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    certItem: { display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', background: 'var(--glass)', borderRadius: '20px', border: '1px solid var(--border)' },
    certName: { fontSize: '1rem', fontWeight: '700', margin: 0 },
    certMeta: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 },
    downloadBtn: { width: '40px', height: '40px', borderRadius: '10px', background: 'var(--glass-heavy)', border: '1px solid var(--border)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    favList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    favItem: { display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'var(--glass)', borderRadius: '20px', border: '1px solid var(--border)' },
    favThumb: { width: '44px', height: '44px', background: 'var(--gradient-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#000' },
    favTitle: { fontSize: '1rem', fontWeight: '700', margin: 0 },
    favCategory: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 },
    viewBtn: { padding: '0.5rem 1rem', borderRadius: '10px', background: 'var(--glass-heavy)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    colSide: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    securityCard: { padding: '2rem' },
    changePassTrigger: { width: '100%', display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '18px', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s' },
    triggerIcon: { width: '40px', height: '40px', borderRadius: '12px', background: 'var(--glass-heavy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9800' },
    triggerTitle: { fontSize: '0.95rem', fontWeight: '700', margin: 0 },
    triggerSub: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 },
    passForm: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' },
    editActions: { display: 'flex', gap: '1rem', marginTop: '1rem' },
    supportCard: { padding: '2rem', background: 'linear-gradient(rgba(138, 180, 248, 0.05), transparent)', textAlign: 'center' },
    sideTitle: { fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem' },
    sideText: { fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' },
    emptyState: { textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }
};

export default Profile;
