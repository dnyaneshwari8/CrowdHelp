import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeft, 
    Calendar, 
    Target, 
    TrendingUp, 
    Users, 
    Clock,
    CheckCircle2,
    MessageSquare,
    IndianRupee,
    User
} from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/Spinner';

const NGOCampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [campaignRes, donationsRes] = await Promise.all([
                    api.get(`/campaigns/${id}`),
                    api.get(`/ngo/donations?campaignId=${id}`) // Reusing donations API
                ]);
                setCampaign(campaignRes.data.data.campaign);
                // Filter donations for this specific campaign if the API doesn't support campaignId filter yet
                setDonations(donationsRes.data.data.donations.filter(d => d.campaignId?._id === id));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <Spinner />;
    if (!campaign) return <div style={styles.error}>Campaign not found</div>;

    const progress = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
    const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}>
                    <ArrowLeft size={20}/>
                </button>
                <h1 style={styles.title}>Campaign Details</h1>
            </div>

            <div style={styles.mainGrid}>
                {/* Left Column - Campaign Overview */}
                <div style={styles.column}>
                    <div style={styles.card}>
                        <img src={campaign.image} alt={campaign.title} style={styles.campaignImage}/>
                        <div style={styles.content}>
                            <div style={styles.badgeRow}>
                                <span style={styles.categoryBadge}>{campaign.category}</span>
                                <span style={{ 
                                    ...styles.statusBadge, 
                                    background: campaign.status === 'APPROVED' ? '#22c55e20' : '#f59e0b20',
                                    color: campaign.status === 'APPROVED' ? '#22c55e' : '#f59e0b'
                                }}>
                                    {campaign.status}
                                </span>
                            </div>
                            <h2 style={styles.campaignTitle}>{campaign.title}</h2>
                            <p style={styles.description}>{campaign.description}</p>
                            
                            <div style={styles.metaGrid}>
                                <div style={styles.metaItem}>
                                    <Calendar size={18}/>
                                    <div>
                                        <p style={styles.metaLabel}>Start Date</p>
                                        <p style={styles.metaValue}>{new Date(campaign.startDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div style={styles.metaItem}>
                                    <Clock size={18}/>
                                    <div>
                                        <p style={styles.metaLabel}>End Date</p>
                                        <p style={styles.metaValue}>{new Date(campaign.endDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Donation List */}
                    <div style={{ ...styles.card, marginTop: '2rem' }}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>Recent Donations</h3>
                            <span style={styles.donorCount}>{donations.length} Donors</span>
                        </div>
                        <div style={styles.donationList}>
                            {donations.length > 0 ? (
                                donations.map((donation, index) => (
                                    <div key={index} style={styles.donationItem}>
                                        <div style={styles.donorAvatar}>
                                            <User size={18}/>
                                        </div>
                                        <div style={styles.donationInfo}>
                                            <p style={styles.donorName}>{donation.userId?.name || 'Anonymous'}</p>
                                            <p style={styles.donationDate}>{new Date(donation.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div style={styles.donationAmount}>₹{donation.amount.toLocaleString()}</div>
                                    </div>
                                ))
                            ) : (
                                <p style={styles.empty}>No donations yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Stats & Actions */}
                <div style={styles.column}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Funding Progress</h3>
                        <div style={styles.statsBox}>
                            <div style={styles.progressContainer}>
                                <div style={styles.progressHeader}>
                                    <span style={styles.progressVal}>{progress.toFixed(1)}%</span>
                                    <span style={styles.goalText}>Goal: ₹{campaign.goalAmount.toLocaleString()}</span>
                                </div>
                                <div style={styles.progressBarBg}>
                                    <div style={{ ...styles.progressBarFill, width: `${progress}%` }}/>
                                </div>
                            </div>

                            <div style={styles.statsRow}>
                                <div style={styles.statItem}>
                                    <IndianRupee size={24} style={{ color: '#22c55e' }}/>
                                    <div>
                                        <p style={styles.statValMain}>₹{campaign.currentAmount.toLocaleString()}</p>
                                        <p style={styles.statLabelMain}>Raised So Far</p>
                                    </div>
                                </div>
                                <div style={styles.statItem}>
                                    <TrendingUp size={24} style={{ color: '#3b82f6' }}/>
                                    <div>
                                        <p style={styles.statValMain}>{daysLeft > 0 ? daysLeft : 0}</p>
                                        <p style={styles.statLabelMain}>Days Left</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={styles.actionButtons}>
                            <button style={styles.editBtn}>Edit Campaign</button>
                            <Link to="/ngo/updates" style={styles.updateBtn}>
                                <MessageSquare size={18}/>
                                Post Update
                            </Link>
                        </div>
                    </div>

                    <div style={{ ...styles.card, marginTop: '2rem', background: '#3b82f610', borderColor: '#3b82f630' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <CheckCircle2 size={24} style={{ color: '#3b82f6' }}/>
                            <div>
                                <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>Campaign Tip</h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                    Keep your donors engaged by posting regular updates about how their funds are being utilized. 
                                    Successful campaigns post at least 2 updates per month.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    backBtn: { background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '0.6rem', borderRadius: '10px', cursor: 'pointer' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: 'white' },
    mainGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' },
    column: { display: 'flex', flexDirection: 'column' },
    card: { background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' },
    campaignImage: { width: '100%', height: '350px', objectFit: 'cover' },
    content: { padding: '2rem' },
    badgeRow: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' },
    categoryBadge: { background: '#3b82f620', color: '#3b82f6', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
    statusBadge: { padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
    campaignTitle: { fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '1.5rem' },
    description: { color: '#94a3b8', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2rem' },
    metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1.5rem', background: '#0f172a', borderRadius: '12px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b' },
    metaLabel: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    metaValue: { fontSize: '0.95rem', color: 'white', fontWeight: '600' },
    cardHeader: { padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontSize: '1.1rem', fontWeight: '600', color: 'white' },
    donorCount: { fontSize: '0.85rem', color: '#64748b' },
    donationList: { display: 'flex', flexDirection: 'column' },
    donationItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid #334155' },
    donorAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' },
    donationInfo: { flex: 1 },
    donorName: { color: 'white', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' },
    donationDate: { color: '#64748b', fontSize: '0.8rem' },
    donationAmount: { color: '#22c55e', fontWeight: '700', fontSize: '1.1rem' },
    statsBox: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' },
    progressContainer: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    progressVal: { fontSize: '1.5rem', fontWeight: '800', color: '#22c55e' },
    goalText: { fontSize: '0.85rem', color: '#64748b' },
    progressBarBg: { height: '12px', background: '#0f172a', borderRadius: '6px', overflow: 'hidden' },
    progressBarFill: { height: '100%', background: '#22c55e', borderRadius: '6px' },
    statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    statItem: { display: 'flex', alignItems: 'center', gap: '1rem' },
    statValMain: { fontSize: '1.25rem', fontWeight: '700', color: 'white' },
    statLabelMain: { fontSize: '0.75rem', color: '#64748b' },
    actionButtons: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
    editBtn: { background: 'transparent', border: '1px solid #334155', color: 'white', padding: '0.85rem', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' },
    updateBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' },
    empty: { padding: '3rem', textAlign: 'center', color: '#64748b' },
    error: { color: '#ef4444', textAlign: 'center', padding: '4rem' }
};

export default NGOCampaignDetails;
