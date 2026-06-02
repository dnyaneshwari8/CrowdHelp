import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    Upload, 
    Trash2, 
    CheckCircle, 
    AlertCircle,
    Eye,
    Image as ImageIcon
} from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/Spinner';

const NGODocuments = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/ngo/documents');
            setData(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    const documents = [
        { 
            id: 'reg_cert', 
            name: 'Registration Certificate', 
            type: 'PDF/Image', 
            status: 'Verified', 
            date: 'May 12, 2026',
            value: data.registrationNumber
        },
        { 
            id: 'org_logo', 
            name: 'Organization Logo', 
            type: 'Image (PNG/JPG)', 
            status: 'Active', 
            date: 'May 12, 2026',
            value: data.logo,
            isImage: true
        }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Organization Documents</h1>
                <p style={styles.subtitle}>Manage your NGO's verification and identity documents</p>
            </div>

            <div style={styles.grid}>
                {documents.map((doc) => (
                    <div key={doc.id} style={styles.docCard}>
                        <div style={styles.docIconWrapper}>
                            {doc.isImage ? <ImageIcon size={32}/> : <FileText size={32}/>}
                        </div>
                        <div style={styles.docInfo}>
                            <h3 style={styles.docName}>{doc.name}</h3>
                            <p style={styles.docType}>{doc.type}</p>
                            <div style={styles.statusRow}>
                                <span style={styles.statusBadge}>
                                    <CheckCircle size={14}/> {doc.status}
                                </span>
                                <span style={styles.docDate}>Updated: {doc.date}</span>
                            </div>
                        </div>
                        
                        {doc.isImage && doc.value ? (
                            <img src={doc.value} alt={doc.name} style={styles.previewThumb}/>
                        ) : (
                            <div style={styles.docValue}>{doc.value}</div>
                        )}

                        <div style={styles.docActions}>
                            <button style={styles.actionBtn} title="View"><Eye size={18}/></button>
                            <button style={styles.actionBtn} title="Replace"><Upload size={18}/></button>
                            <button style={{ ...styles.actionBtn, color: '#ef4444' }} title="Delete"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}

                {/* Upload New Card */}
                <div style={styles.uploadCard}>
                    <div style={styles.uploadIcon}><Upload size={40}/></div>
                    <h3 style={styles.uploadTitle}>Upload New Document</h3>
                    <p style={styles.uploadText}>Add additional supporting documents for your NGO profile.</p>
                    <button style={styles.uploadBtn}>Select File</button>
                </div>
            </div>

            <div style={styles.notice}>
                <AlertCircle size={20}/>
                <p>
                    Replacing core registration documents may trigger a re-verification of your NGO account by our administrators.
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    header: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: 'white' },
    subtitle: { color: '#94a3b8', fontSize: '0.9rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' },
    docCard: { 
        background: '#1e293b', 
        borderRadius: '16px', 
        border: '1px solid #334155', 
        padding: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5rem',
        position: 'relative'
    },
    docIconWrapper: { width: '64px', height: '64px', borderRadius: '12px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' },
    docInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    docName: { fontSize: '1.1rem', fontWeight: '600', color: 'white' },
    docType: { fontSize: '0.85rem', color: '#64748b' },
    statusRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
    statusBadge: { display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#22c55e', fontSize: '0.75rem', fontWeight: '600' },
    docDate: { fontSize: '0.75rem', color: '#475569' },
    docValue: { fontSize: '0.8rem', color: '#94a3b8', background: '#0f172a', padding: '0.4rem 0.8rem', borderRadius: '6px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' },
    previewThumb: { width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #334155' },
    docActions: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    actionBtn: { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'all 0.2s ease', ':hover': { background: '#334155', color: 'white' } },
    uploadCard: { 
        background: 'transparent', 
        borderRadius: '16px', 
        border: '2px dashed #334155', 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
        ':hover': { borderColor: '#22c55e' }
    },
    uploadIcon: { color: '#334155' },
    uploadTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#e2e8f0' },
    uploadText: { fontSize: '0.85rem', color: '#64748b', maxWidth: '250px' },
    uploadBtn: { background: '#334155', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
    notice: { background: '#f59e0b10', border: '1px solid #f59e0b30', padding: '1.25rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', color: '#f59e0b', fontSize: '0.9rem' }
};

export default NGODocuments;
