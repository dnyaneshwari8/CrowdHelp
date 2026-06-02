import React, { useState, useEffect } from 'react';
import { fetchNGOApplications, approveNGO, rejectNGO } from '../services/api';
import Spinner from '../components/Spinner';
import { Check, X, Eye, Building2, Mail, Phone, FileText, ExternalLink, Calendar } from 'lucide-react';

const AdminNGOApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const res = await fetchNGOApplications();
            setApplications(res.data.applications);
        } catch (error) {
            console.error('Error loading applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this NGO?')) return;
        try {
            await approveNGO(id, remarks);
            alert('NGO approved successfully');
            setSelectedApp(null);
            loadApplications();
        } catch (error) {
            alert('Approval failed');
        }
    };

    const handleReject = async (id) => {
        if (!remarks) return alert('Please provide remarks for rejection');
        if (!window.confirm('Are you sure you want to reject this NGO?')) return;
        try {
            await rejectNGO(id, remarks);
            alert('NGO rejected successfully');
            setSelectedApp(null);
            loadApplications();
        } catch (error) {
            alert('Rejection failed');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>NGO Applications</h1>
                <p>Review and verify organizations applying for NGO status.</p>
            </div>

            <div className="card" style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Organization</th>
                            <th>Reg Number</th>
                            <th>Contact</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app._id}>
                                <td>
                                    <div style={styles.orgInfo}>
                                        <strong>{app.organizationName}</strong>
                                        <span>{app.userId?.name}</span>
                                    </div>
                                </td>
                                <td>{app.registrationNumber}</td>
                                <td>
                                    <div style={styles.contactCell}>
                                        <span><Mail size={12}/> {app.email}</span>
                                        <span><Phone size={12}/> {app.phone}</span>
                                    </div>
                                </td>
                                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span style={{
                                        ...styles.statusBadge,
                                        backgroundColor: app.status === 'APPROVED' ? 'rgba(76, 175, 80, 0.1)' : app.status === 'REJECTED' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                        color: app.status === 'APPROVED' ? '#4CAF50' : app.status === 'REJECTED' ? '#f44336' : '#FF9800'
                                    }}>
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => setSelectedApp(app)} style={styles.viewBtn}>
                                        <Eye size={16}/> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {applications.length === 0 && <p style={styles.empty}>No applications found.</p>}
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
                <div style={styles.modalOverlay}>
                    <div className="card" style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2>Application Details</h2>
                            <button onClick={() => setSelectedApp(null)} style={styles.closeBtn}><X size={20}/></button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            <div style={styles.detailSection}>
                                <img src={`http://localhost:5000${selectedApp.logo}`} alt="Logo" style={styles.logoPreview} />
                                <div style={styles.mainInfo}>
                                    <h3>{selectedApp.organizationName}</h3>
                                    <p>{selectedApp.description}</p>
                                </div>
                            </div>

                            <div style={styles.gridInfo}>
                                <div style={styles.infoBox}><strong>Reg No:</strong> {selectedApp.registrationNumber}</div>
                                <div style={styles.infoBox}><strong>Email:</strong> {selectedApp.email}</div>
                                <div style={styles.infoBox}><strong>Phone:</strong> {selectedApp.phone}</div>
                                <div style={styles.infoBox}><strong>Website:</strong> <a href={selectedApp.website} target="_blank">{selectedApp.website}</a></div>
                                <div style={styles.infoBox} className="full-width"><strong>Address:</strong> {selectedApp.address}</div>
                            </div>

                            <div style={styles.docs}>
                                <a href={`http://localhost:5000${selectedApp.certificate}`} target="_blank" style={styles.docLink}>
                                    <FileText size={20}/> View Registration Certificate (PDF) <ExternalLink size={16}/>
                                </a>
                            </div>

                            <div style={styles.remarksSection}>
                                <label>Admin Remarks (Optional for approval, required for rejection)</label>
                                <textarea 
                                    value={remarks} 
                                    onChange={(e) => setRemarks(e.target.value)} 
                                    placeholder="Enter feedback or reason for rejection..."
                                />
                            </div>
                        </div>

                        {selectedApp.status === 'PENDING' && (
                            <div style={styles.modalFooter}>
                                <button onClick={() => handleApprove(selectedApp._id)} style={styles.approveBtn}><Check size={18}/> Approve NGO</button>
                                <button onClick={() => handleReject(selectedApp._id)} style={styles.rejectBtn}><X size={18}/> Reject Application</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' },
    header: { marginBottom: '2.5rem' },
    tableCard: { padding: '1rem', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    orgInfo: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    contactCell: { display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' },
    statusBadge: { padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' },
    viewBtn: { padding: '0.5rem 1rem', background: 'var(--glass)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem' },
    empty: { textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '2rem' },
    modal: { width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    closeBtn: { background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', width: 'auto' },
    detailSection: { display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'flex-start' },
    logoPreview: { width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', background: 'var(--bg-surface)' },
    mainInfo: { flex: 1, textAlign: 'left' },
    gridInfo: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', textAlign: 'left' },
    infoBox: { background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' },
    docs: { marginBottom: '2rem' },
    docLink: { display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' },
    remarksSection: { display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' },
    modalFooter: { display: 'flex', gap: '1rem', marginTop: '2.5rem' },
    approveBtn: { background: '#4CAF50', color: 'white', flex: 1 },
    rejectBtn: { background: '#F44336', color: 'white', flex: 1 }
};

export default AdminNGOApplications;
