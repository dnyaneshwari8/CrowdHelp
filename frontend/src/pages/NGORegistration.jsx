import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitNGOApplication, fetchMyNGOApplication, fetchUserProfile } from '../services/api';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Phone, Globe, MapPin, FileText, Upload, CheckCircle2, XCircle, Clock } from 'lucide-react';

const NGOApplication = () => {
    const navigate = useNavigate();
    const { user, loginUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setDonating] = useState(false);
    const [application, setApplication] = useState(null);
    const [formData, setFormData] = useState({
        organizationName: '',
        description: '',
        registrationNumber: '',
        email: '',
        phone: '',
        website: '',
        address: ''
    });
    const [files, setFiles] = useState({
        logo: null,
        certificate: null
    });

    useEffect(() => {
        const checkApplication = async () => {
            try {
                const res = await fetchMyNGOApplication();
                if (res.data.application) {
                    setApplication(res.data.application);
                    
                    // If application is approved but local user role is still USER, refresh profile
                    if (res.data.application.status === 'APPROVED' && user?.role === 'USER') {
                        const profileRes = await fetchUserProfile();
                        loginUser(profileRes.data.user, localStorage.getItem('token'));
                    }
                }
            } catch (error) {
                console.error('Error fetching application:', error);
            } finally {
                setLoading(false);
            }
        };
        checkApplication();
    }, [user]);

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDonating(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (files.logo) data.append('logo', files.logo);
        if (files.certificate) data.append('certificate', files.certificate);

        try {
            await submitNGOApplication(data);
            alert('Application submitted successfully!');
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || 'Submission failed');
        } finally {
            setDonating(false);
        }
    };

    if (loading) return <Spinner />;

    if (application) {
        return (
            <div style={styles.container}>
                <div className="card" style={styles.statusCard}>
                    {application.status === 'PENDING' && (
                        <>
                            <Clock size={64} color="#FF9800" />
                            <h1>Application Pending</h1>
                            <p>Your application for <strong>{application.organizationName}</strong> is currently under review by our team.</p>
                            <div style={styles.detailsList}>
                                <div style={styles.detailItem}><span>Reg No:</span> {application.registrationNumber}</div>
                                <div style={styles.detailItem}><span>Applied on:</span> {new Date(application.createdAt).toLocaleDateString()}</div>
                            </div>
                        </>
                    )}
                    {application.status === 'APPROVED' && (
                        <>
                            <CheckCircle2 size={64} color="#4CAF50" />
                            <h1>Application Approved!</h1>
                            <p>Congratulations! You are now a verified NGO partner.</p>
                            {user?.role === 'NGO' ? (
                                <button onClick={() => navigate('/ngo/dashboard')} style={styles.dashboardBtn}>Go to NGO Dashboard</button>
                            ) : (
                                <p style={{ color: '#94a3b8' }}>Finalizing your account permissions... Please wait a moment.</p>
                            )}
                        </>
                    )}
                    {application.status === 'REJECTED' && (
                        <>
                            <XCircle size={64} color="#F44336" />
                            <h1>Application Rejected</h1>
                            <p>We're sorry, but your application was not approved at this time.</p>
                            {application.adminRemarks && (
                                <div style={styles.remarks}>
                                    <strong>Admin Remarks:</strong>
                                    <p>{application.adminRemarks}</p>
                                </div>
                            )}
                            <button onClick={() => setApplication(null)} style={styles.retryBtn}>Re-apply with Correct Details</button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.pageHeader}>
                <h1>Become an NGO Partner</h1>
                <p>Submit your details to start raising funds for your organization.</p>
            </div>

            <div className="card" style={styles.formCard}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.section}>
                        <h3>Basic Information</h3>
                        <div style={styles.grid}>
                            <div style={styles.inputGroup}>
                                <label><Building2 size={16}/> Organization Name</label>
                                <input type="text" required value={formData.organizationName} onChange={(e) => setFormData({...formData, organizationName: e.target.value})} placeholder="Legal Organization Name" />
                            </div>
                            <div style={styles.inputGroup}>
                                <label><FileText size={16}/> Registration Number</label>
                                <input type="text" required value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} placeholder="Registration or Tax ID" />
                            </div>
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Organization Description</label>
                            <textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Tell us about your organization's mission and impact..." />
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3>Contact & Web</h3>
                        <div style={styles.grid}>
                            <div style={styles.inputGroup}>
                                <label><Mail size={16}/> Official Email</label>
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="contact@org.com" />
                            </div>
                            <div style={styles.inputGroup}>
                                <label><Phone size={16}/> Contact Phone</label>
                                <input type="text" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" />
                            </div>
                        </div>
                        <div style={styles.grid}>
                            <div style={styles.inputGroup}>
                                <label><Globe size={16}/> Website</label>
                                <input type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} placeholder="https://www.your-org.com" />
                            </div>
                            <div style={styles.inputGroup}>
                                <label><MapPin size={16}/> Address</label>
                                <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Full physical address" />
                            </div>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3>Documents & Media</h3>
                        <div style={styles.grid}>
                            <div style={styles.inputGroup}>
                                <label><Upload size={16}/> Organization Logo</label>
                                <input type="file" name="logo" accept="image/*" onChange={handleFileChange} />
                                <small>Logo image (JPG/PNG)</small>
                            </div>
                            <div style={styles.inputGroup}>
                                <label><Upload size={16}/> Registration Certificate</label>
                                <input type="file" name="certificate" accept="application/pdf" onChange={handleFileChange} />
                                <small>Registration proof (PDF)</small>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={submitting} style={styles.submitBtn}>
                        {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1000px', margin: '2rem auto', padding: '0 2rem' },
    pageHeader: { textAlign: 'center', marginBottom: '3rem' },
    formCard: { padding: '3rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '2.5rem' },
    section: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' },
    label: { fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    submitBtn: { padding: '1rem', fontSize: '1.1rem', fontWeight: '700', marginTop: '1rem' },
    statusCard: { padding: '5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' },
    detailsList: { marginTop: '2rem', textAlign: 'left', background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', width: '100%', maxWidth: '400px' },
    detailItem: { marginBottom: '0.5rem', fontSize: '0.95rem' },
    remarks: { background: 'rgba(244, 67, 54, 0.1)', color: '#f44336', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem', textAlign: 'left' },
    dashboardBtn: { background: '#4CAF50', color: 'white', marginTop: '1rem' },
    retryBtn: { background: 'var(--primary)', color: 'black', marginTop: '1rem' }
};

export default NGOApplication;
