import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNGODocuments } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import Skeleton from '../components/Skeleton';
import { 
    FileText, 
    Download, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Shield, 
    Info,
    ExternalLink,
    AlertTriangle
} from 'lucide-react';

const NGODocuments = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDocs = async () => {
            try {
                const res = await fetchNGODocuments();
                setApplications(res.data.applications);
            } catch (error) {
                console.error('Error loading documents:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDocs();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return { 
                    bg: 'rgba(52, 168, 83, 0.1)', 
                    color: '#34a853', 
                    icon: <CheckCircle size={14}/>,
                    label: 'Verified'
                };
            case 'REJECTED':
                return { 
                    bg: 'rgba(234, 67, 53, 0.1)', 
                    color: '#ea4335', 
                    icon: <XCircle size={14}/>,
                    label: 'Rejected'
                };
            default:
                return { 
                    bg: 'rgba(251, 188, 4, 0.1)', 
                    color: '#fbbc04', 
                    icon: <Clock size={14}/>,
                    label: 'Under Review'
                };
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="NGO">
                <Skeleton width="300px" height="40px" style={{ marginBottom: '2rem' }} />
                <div style={styles.grid}>
                    {[1, 2].map(i => <Skeleton key={i} height="300px" borderRadius="24px" />)}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="NGO">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.container}
            >
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Verification <span className="gradient-text">Documents</span></h1>
                        <p style={styles.subtitle}>Manage your organization's legal documents and verification status.</p>
                    </div>
                </header>

                <div style={styles.alertBox}>
                    <Shield size={24} color="var(--primary)" />
                    <div>
                        <h4 style={styles.alertTitle}>Verification Security</h4>
                        <p style={styles.alertText}>All uploaded documents are stored securely on Cloudinary and are only visible to system administrators for verification purposes.</p>
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Registration Certificates</h2>
                    <div style={styles.grid}>
                        {applications.length > 0 ? applications.map((app) => {
                            const status = getStatusBadge(app.status);
                            return (
                                <motion.div 
                                    key={app._id}
                                    style={styles.docCard}
                                    whileHover={{ y: -5 }}
                                >
                                    <div style={styles.cardHeader}>
                                        <div style={styles.docIcon}>
                                            <FileText size={24} color="var(--primary)" />
                                        </div>
                                        <div style={{ ...styles.statusBadge, backgroundColor: status.bg, color: status.color }}>
                                            {status.icon} {status.label}
                                        </div>
                                    </div>
                                    
                                    <div style={styles.cardBody}>
                                        <h3 style={styles.docName}>NGO Registration Certificate</h3>
                                        <p style={styles.docMeta}>Uploaded on: {new Date(app.createdAt).toLocaleDateString()}</p>
                                        <p style={styles.docMeta}>Reg No: {app.registrationNumber}</p>
                                        
                                        {app.adminRemarks && (
                                            <div style={styles.remarksBox}>
                                                <Info size={14} />
                                                <p style={styles.remarksText}>Admin Remark: {app.adminRemarks}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div style={styles.cardFooter}>
                                        {app.certificate ? (
                                            <a 
                                                href={app.certificate} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style={styles.downloadBtn}
                                            >
                                                <Download size={18} /> View Document
                                            </a>
                                        ) : (
                                            <div style={styles.missingDoc}>
                                                <AlertTriangle size={16} /> No file attached
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        }) : (
                            <div style={styles.emptyState}>
                                <FileText size={48} color="var(--text-muted)" />
                                <p>No documents found. Your application might be in progress.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={styles.helpSection}>
                    <h3 style={styles.helpTitle}>Need to update your documents?</h3>
                    <p style={styles.helpText}>If your registration has changed or you need to re-verify, please contact our support team to unlock document updates for your profile.</p>
                    <button className="btn btn-secondary" onClick={() => window.location.href='/contact'}>Contact Support</button>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '3rem' },
    title: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '1.1rem' },
    alertBox: { 
        display: 'flex', 
        gap: '1.5rem', 
        padding: '1.5rem', 
        background: 'rgba(66, 133, 244, 0.05)', 
        borderRadius: '20px', 
        border: '1px solid var(--border)',
        marginBottom: '3rem',
        alignItems: 'center'
    },
    alertTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' },
    alertText: { color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' },
    section: { marginBottom: '4rem' },
    sectionTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' },
    docCard: { 
        background: 'var(--bg-surface)', 
        borderRadius: '24px', 
        border: '1px solid var(--border)', 
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    docIcon: { 
        width: '48px', 
        height: '48px', 
        borderRadius: '12px', 
        background: 'rgba(66, 133, 244, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    statusBadge: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        padding: '0.5rem 1rem', 
        borderRadius: '100px', 
        fontSize: '0.8rem', 
        fontWeight: '700' 
    },
    cardBody: { flex: 1 },
    docName: { fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' },
    docMeta: { fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' },
    remarksBox: { 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: 'var(--bg-dark)', 
        borderRadius: '12px', 
        display: 'flex', 
        gap: '0.75rem', 
        alignItems: 'flex-start',
        border: '1px solid var(--border)'
    },
    remarksText: { fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' },
    cardFooter: { borderTop: '1px solid var(--border)', paddingTop: '1.5rem' },
    downloadBtn: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '0.75rem', 
        width: '100%', 
        padding: '1rem', 
        background: 'var(--primary)', 
        color: 'white', 
        borderRadius: '12px', 
        textDecoration: 'none', 
        fontWeight: '700',
        transition: 'transform 0.2s'
    },
    missingDoc: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', fontSize: '0.9rem', justifyContent: 'center' },
    helpSection: { 
        textAlign: 'center', 
        padding: '4rem 2rem', 
        background: 'var(--bg-surface)', 
        borderRadius: '32px', 
        border: '1px solid var(--border)' 
    },
    helpTitle: { fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' },
    helpText: { color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' },
    emptyState: { textAlign: 'center', gridColumn: '1 / -1', padding: '4rem', color: 'var(--text-muted)' }
};

export default NGODocuments;
