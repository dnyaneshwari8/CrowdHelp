import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Image as ImageIcon, 
    Calendar, 
    Target, 
    Tag, 
    AlignLeft, 
    Type,
    ArrowLeft,
    Upload,
    AlertCircle
} from 'lucide-react';
import api from '../services/api';

const NGOCreateCampaign = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Education',
        goalAmount: '',
        startDate: '',
        endDate: '',
        image: null
    });

    const categories = ['Education', 'Health', 'Environment', 'Animal Welfare', 'Disaster Relief', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic Validation
        if (Number(formData.goalAmount) <= 0) {
            setError('Goal amount must be positive');
            setLoading(false);
            return;
        }

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end <= start) {
            setError('End date must be after start date');
            setLoading(false);
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            await api.post('/ngo/campaigns', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/ngo/my-campaigns');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create campaign');
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}>
                    <ArrowLeft size={20}/>
                </button>
                <h1 style={styles.title}>Create New Campaign</h1>
            </div>

            <div style={styles.formCard}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.errorAlert}>
                            <AlertCircle size={20}/>
                            <span>{error}</span>
                        </div>
                    )}

                    <div style={styles.grid}>
                        {/* Left Column - Details */}
                        <div style={styles.formColumn}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><Type size={18}/> Campaign Title</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    required
                                    placeholder="Enter a compelling title"
                                    style={styles.input}
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}><AlignLeft size={18}/> Description</label>
                                <textarea 
                                    name="description"
                                    required
                                    placeholder="Explain your cause and how the funds will be used..."
                                    style={styles.textarea}
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={styles.row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}><Tag size={18}/> Category</label>
                                    <select 
                                        name="category"
                                        style={styles.select}
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}><Target size={18}/> Goal Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        name="goalAmount"
                                        required
                                        placeholder="50000"
                                        style={styles.input}
                                        value={formData.goalAmount}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div style={styles.row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}><Calendar size={18}/> Start Date</label>
                                    <input 
                                        type="date" 
                                        name="startDate"
                                        required
                                        style={styles.input}
                                        value={formData.startDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}><Calendar size={18}/> End Date</label>
                                    <input 
                                        type="date" 
                                        name="endDate"
                                        required
                                        style={styles.input}
                                        value={formData.endDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Image Upload */}
                        <div style={styles.imageColumn}>
                            <label style={styles.label}><ImageIcon size={18}/> Campaign Image</label>
                            <div 
                                style={{ 
                                    ...styles.imageUploadArea,
                                    backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                                    border: imagePreview ? 'none' : '2px dashed #334155'
                                }}
                                onClick={() => document.getElementById('image-input').click()}
                            >
                                {!imagePreview && (
                                    <div style={styles.uploadPlaceholder}>
                                        <Upload size={40} style={{ color: '#64748b', marginBottom: '1rem' }}/>
                                        <p style={styles.uploadText}>Click to upload campaign image</p>
                                        <p style={styles.uploadSubtext}>JPG, PNG or WEBP (Recommended: 1200x600)</p>
                                    </div>
                                )}
                                {imagePreview && <div style={styles.imageOverlay}>Click to Change</div>}
                            </div>
                            <input 
                                id="image-input"
                                type="file" 
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                            
                            <div style={styles.infoBox}>
                                <AlertCircle size={20} style={{ color: '#3b82f6' }}/>
                                <p style={styles.infoText}>
                                    Your campaign will be reviewed by our admin team before going live. 
                                    This usually takes 24-48 hours.
                                </p>
                            </div>

                            <button 
                                type="submit" 
                                style={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? 'Creating Campaign...' : 'Submit for Approval'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' },
    header: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    backBtn: { background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '0.6rem', borderRadius: '10px', cursor: 'pointer' },
    title: { fontSize: '1.75rem', fontWeight: '700', color: 'white' },
    formCard: { background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '2rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    grid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' },
    formColumn: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    imageColumn: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 },
    label: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' },
    input: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.85rem 1rem', color: 'white', outline: 'none' },
    textarea: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.85rem 1rem', color: 'white', outline: 'none', minHeight: '150px', resize: 'vertical' },
    select: { background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.85rem 1rem', color: 'white', outline: 'none', appearance: 'none' },
    row: { display: 'flex', gap: '1.5rem' },
    imageUploadArea: { 
        height: '250px', 
        borderRadius: '12px', 
        cursor: 'pointer', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadPlaceholder: { textAlign: 'center', padding: '2rem' },
    uploadText: { color: '#e2e8f0', fontWeight: '600', marginBottom: '0.5rem' },
    uploadSubtext: { color: '#64748b', fontSize: '0.8rem' },
    imageOverlay: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: 'rgba(0,0,0,0.6)', 
        color: 'white', 
        padding: '0.75rem', 
        textAlign: 'center',
        fontSize: '0.9rem',
        opacity: 0,
        transition: 'opacity 0.2s ease',
        ':hover': { opacity: 1 }
    },
    infoBox: { background: '#3b82f615', border: '1px solid #3b82f630', padding: '1.25rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' },
    infoText: { color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' },
    submitBtn: { 
        background: '#22c55e', 
        color: 'white', 
        border: 'none', 
        padding: '1rem', 
        borderRadius: '12px', 
        fontWeight: '700', 
        fontSize: '1rem', 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':disabled': { opacity: 0.7, cursor: 'not-allowed' }
    },
    errorAlert: { 
        background: '#ef444415', 
        border: '1px solid #ef444430', 
        color: '#ef4444', 
        padding: '1rem', 
        borderRadius: '10px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        fontSize: '0.9rem'
    }
};

export default NGOCreateCampaign;
