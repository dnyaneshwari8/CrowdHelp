import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageHelper';
import { fetchNGOApplications, updateNGOStatus } from '../services/api';
import Spinner from '../components/Spinner';
import { Check, X, Building2, Mail, Phone, ExternalLink } from 'lucide-react';

const AdminNGOManagement = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNGOs();
    }, []);

    const loadNGOs = async () => {
        try {
            const res = await fetchNGOApplications();
            setNgos(res.data.ngos);
        } catch (error) {
            console.error('Error loading NGOs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (ngoId, status) => {
        if (!window.confirm(`Are you sure you want to set status to ${status}?`)) return;
        try {
            await updateNGOStatus(ngoId, status);
            alert(`NGO ${status.toLowerCase()} successfully`);
            loadNGOs();
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>NGO Applications Management</h1>
            
            <div style={styles.grid}>
                {ngos.length > 0 ? ngos.map(ngo => (
                    <div key={ngo._id} className="card" style={styles.card}>
                        <div style={styles.header}>
                            <img 
                                src={getImageUrl(ngo.organizationLogo)} 
                                alt={ngo.organizationName} 
                                style={styles.logo} 
                            />
                            <div>
                                <h3 style={styles.name}>{ngo.organizationName}</h3>
                                <span style={{
                                    ...styles.badge,
                                    backgroundColor: ngo.ngoStatus === 'APPROVED' ? '#e8f5e9' : ngo.ngoStatus === 'REJECTED' ? '#ffebee' : '#fff3e0',
                                    color: ngo.ngoStatus === 'APPROVED' ? '#2e7d32' : ngo.ngoStatus === 'REJECTED' ? '#c62828' : '#ef6c00'
                                }}>
                                    {ngo.ngoStatus}
                                </span>
                            </div>
                        </div>

                        <div style={styles.details}>
                            <p><Mail size={16}/> {ngo.organizationEmail}</p>
                            <p><Phone size={16}/> {ngo.organizationPhone}</p>
                            <p><strong>Reg No:</strong> {ngo.registrationNumber}</p>
                            {ngo.website && (
                                <a href={ngo.website} target="_blank" rel="noreferrer" style={styles.link}>
                                    <ExternalLink size={16}/> Visit Website
                                </a>
                            )}
                        </div>

                        <p style={styles.description}>{ngo.organizationDescription}</p>

                        <div style={styles.actions}>
                            {ngo.ngoStatus !== 'APPROVED' && (
                                <button 
                                    onClick={() => handleStatusUpdate(ngo._id, 'APPROVED')}
                                    style={{...styles.btn, backgroundColor: '#4CAF50'}}
                                >
                                    <Check size={18}/> Approve
                                </button>
                            )}
                            {ngo.ngoStatus !== 'REJECTED' && (
                                <button 
                                    onClick={() => handleStatusUpdate(ngo._id, 'REJECTED')}
                                    style={{...styles.btn, backgroundColor: '#f44336'}}
                                >
                                    <X size={18}/> Reject
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <p style={styles.noResults}>No NGO applications found.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 2rem'
    },
    title: {
        marginBottom: '2rem'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2rem'
    },
    card: {
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    header: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center'
    },
    logo: {
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        objectFit: 'cover'
    },
    name: {
        margin: '0 0 0.5rem 0'
    },
    details: {
        fontSize: '0.9rem',
        color: '#555',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#646cff',
        textDecoration: 'none'
    },
    description: {
        fontSize: '0.95rem',
        lineHeight: '1.5',
        flex: 1
    },
    actions: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
    },
    btn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: 'white',
        padding: '0.75rem',
        borderRadius: '5px'
    },
    badge: {
        padding: '0.2rem 0.6rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 'bold'
    },
    noResults: {
        textAlign: 'center',
        gridColumn: '1 / -1',
        fontSize: '1.2rem',
        color: '#666'
    }
};

export default AdminNGOManagement;
