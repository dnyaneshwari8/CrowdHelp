import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCampaignById, createOrder, verifyPayment, toggleFavorite, fetchUserProfile } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import Skeleton from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageHelper';
import { 
    Heart, 
    Calendar, 
    Target, 
    ShieldCheck, 
    Share2, 
    ArrowLeft,
    Users,
    Info,
    MessageSquare,
    Image as ImageIcon,
    History,
    CheckCircle2,
    Lock
} from 'lucide-react';

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [donating, setDonating] = useState(false);
    const [activeTab, setActiveTab] = useState('about');

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const response = await fetchCampaignById(id);
                setCampaign(response.data.campaign);
                
                if (user) {
                    try {
                        const profile = await fetchUserProfile();
                        if (profile?.data?.user?.favorites) {
                            setIsFav(profile.data.user.favorites.some(fav => String(fav._id) === id));
                        }
                    } catch (favError) {
                        console.warn('Could not load user favorite status:', favError.message);
                    }
                }
            } catch (error) {
                console.error('Error loading details:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
    }, [id, user]);

    const handleFavorite = async () => {
        if (!user) return navigate('/login');
        try {
            const res = await toggleFavorite(id);
            setIsFav(res.isFavorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        if (!amount || amount <= 0) return alert('Enter a valid amount');

        setDonating(true);
        try {
            const order = await createOrder({ 
                amount: Number(amount), 
                campaignId: id,
                isAnonymous 
            });

            const options = {
                key: "rzp_test_SblOacDmUEmet0", 
                amount: order.amount,
                currency: order.currency,
                name: "CrowdHelp",
                description: `Donation for ${campaign.title}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        setDonating(true);
                        const verification = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verification.message === "Payment Verified Successfully") {
                            navigate('/payment-success', { 
                                state: { 
                                    paymentId: response.razorpay_payment_id,
                                    amount: amount,
                                    donationId: verification.donationId
                                } 
                            });
                        }
                    } catch (error) {
                        console.error("Verification Error:", error);
                        navigate('/payment-failure');
                    } finally {
                        setDonating(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone
                },
                theme: { color: "#8ab4f8" },
                modal: { ondismiss: () => setDonating(false) }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error('Donation error:', error);
            if (error.response?.status === 401) {
                alert('Your session has expired. Please log in again.');
                navigate('/login');
            } else {
                alert(error.response?.data?.message || 'Failed to initiate donation');
            }
            setDonating(false);
        }
    };

    if (loading) return (
        <div style={styles.page}>
            <div className="container">
                <div style={styles.breadcrumb}>
                    <Skeleton width="150px" height="20px" />
                </div>
                <div style={styles.grid}>
                    <div style={styles.mainCol}>
                        <Skeleton height="500px" style={{ borderRadius: '24px', marginBottom: '2rem' }} />
                        <Skeleton height="40px" width="70%" style={{ marginBottom: '1rem' }} />
                        <Skeleton height="20px" width="100%" style={{ marginBottom: '1rem' }} />
                        <Skeleton height="20px" width="90%" style={{ marginBottom: '1rem' }} />
                    </div>
                    <div style={styles.sideCol}>
                        <div className="card" style={{ padding: '2rem' }}>
                            <Skeleton height="300px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    if (!campaign) return <div className="container">Campaign not found.</div>;

    const percentage = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);

    return (
        <div style={styles.page}>
            <div className="container">
                <div style={styles.backNav}>
                    <button onClick={() => navigate(-1)} style={styles.backBtn}>
                        <ArrowLeft size={20}/> <span>Back to campaigns</span>
                    </button>
                </div>

                <div style={styles.layout}>
                    <div style={styles.mainCol}>
                        <div style={styles.imageWrapper}>
                            <img src={getImageUrl(campaign.image)} alt={campaign.title} style={styles.image} />
                            <div style={styles.categoryBadge}>{campaign.category}</div>
                        </div>

                        <div style={styles.campaignHeader}>
                            <h1 style={styles.title}>{campaign.title}</h1>
                            <div style={styles.ngoBadge}>
                                <div style={styles.ngoIcon}><ShieldCheck size={16} color="var(--success)"/></div>
                                <span>Verified by {campaign.ngoName || 'Partner NGO'}</span>
                            </div>
                        </div>

                        <div style={styles.tabContainer}>
                            <div style={styles.tabs}>
                                {[
                                    { id: 'about', label: 'About', icon: <Info size={18}/> },
                                    { id: 'updates', label: 'Updates', icon: <History size={18}/> },
                                    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18}/> }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            ...styles.tabBtn,
                                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                                            borderBottomColor: activeTab === tab.id ? 'var(--primary)' : 'transparent'
                                        }}
                                    >
                                        {tab.icon} {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={styles.tabContent}>
                            {activeTab === 'about' && (
                                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={styles.aboutContent}>
                                    <p style={styles.description}>{campaign.description}</p>
                                    
                                    <div style={styles.impactGrid}>
                                        <div style={styles.impactCard}>
                                            <CheckCircle2 size={24} color="var(--success)"/>
                                            <p>100% of your donation goes to the cause</p>
                                        </div>
                                        <div style={styles.impactCard}>
                                            <CheckCircle2 size={24} color="var(--success)"/>
                                            <p>Tax benefits eligible under Section 80G</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === 'updates' && (
                                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={styles.emptyState}>
                                    <MessageSquare size={48} color="var(--text-muted)"/>
                                    <h3>No updates yet</h3>
                                    <p>The organizer hasn't posted any updates yet. Check back soon!</p>
                                </motion.div>
                            )}
                            {activeTab === 'gallery' && (
                                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={styles.galleryGrid}>
                                    <div style={styles.galleryImgWrapper}>
                                        <img src={getImageUrl(campaign.image)} alt="Gallery" style={styles.galleryImg} />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div style={styles.sidebarCol}>
                        <div className="card" style={styles.stickyCard}>
                            <div style={styles.sidebarHeader}>
                                <div style={styles.progressTop}>
                                    <h2 style={styles.amountRaised}>₹{campaign.currentAmount.toLocaleString()}</h2>
                                    <span style={styles.raisedLabel}>raised of ₹{campaign.goalAmount.toLocaleString()} goal</span>
                                </div>
                                <div style={styles.progressBarBase}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        style={styles.progressBarFill}
                                    />
                                </div>
                                <div style={styles.sidebarStats}>
                                    <div style={styles.sideStat}>
                                        <strong>{campaign.donorsCount || 42}</strong>
                                        <span>donors</span>
                                    </div>
                                    <div style={styles.sideStat}>
                                        <strong>12</strong>
                                        <span>days left</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleDonate} style={styles.donateForm}>
                                <div style={styles.inputGroup}>
                                    <span style={styles.currencySymbol}>₹</span>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        placeholder="Enter amount"
                                        required 
                                        style={styles.donateInput}
                                    />
                                </div>

                                <div style={styles.options}>
                                    <label style={styles.checkboxLabel}>
                                        <input 
                                            type="checkbox" 
                                            checked={isAnonymous} 
                                            onChange={(e) => setIsAnonymous(e.target.checked)} 
                                        />
                                        <span>Donate anonymously</span>
                                    </label>
                                </div>

                                <button type="submit" disabled={donating} className="btn btn-primary" style={styles.submitBtn}>
                                    {donating ? 'Connecting...' : 'Donate Now'}
                                </button>
                            </form>

                            <div style={styles.sidebarActions}>
                                <button onClick={handleFavorite} style={{...styles.favBtn, color: isFav ? 'var(--error)' : 'var(--text-primary)'}}>
                                    <Heart fill={isFav ? 'var(--error)' : 'none'} size={20}/>
                                    {isFav ? 'Favorited' : 'Save for later'}
                                </button>
                                <button style={styles.shareBtn}>
                                    <Share2 size={20}/> Share
                                </button>
                            </div>

                            <div style={styles.securityInfo}>
                                <Lock size={14} color="var(--text-muted)"/>
                                <span>Secure transaction via Razorpay</span>
                            </div>
                        </div>

                        <div className="card" style={styles.recentDonorsCard}>
                            <h3 style={styles.recentTitle}>Recent Donors</h3>
                            <div style={styles.donorList}>
                                {[1,2,3].map(i => (
                                    <div key={i} style={styles.donorItem}>
                                        <div style={styles.donorAvatar}>{String.fromCharCode(64+i)}</div>
                                        <div>
                                            <p style={styles.donorName}>Anonymous Donor</p>
                                            <p style={styles.donorAmt}>₹1,000 • 2h ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { padding: '4rem 0 8rem', backgroundColor: 'var(--bg-dark)' },
    backNav: { marginBottom: '2.5rem' },
    backBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: '700' },
    layout: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '5rem', alignItems: 'start' },
    mainCol: { display: 'flex', flexDirection: 'column', gap: '3rem' },
    imageWrapper: { position: 'relative', borderRadius: '40px', overflow: 'hidden', height: '540px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)' },
    image: { width: '100%', height: '100%', objectFit: 'cover' },
    categoryBadge: { position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', color: 'var(--primary)', padding: '0.6rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', border: '1px solid var(--border)' },
    campaignHeader: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    title: { fontSize: '3.5rem', fontWeight: '900', lineHeight: '1.1', margin: 0 },
    ngoBadge: { display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600' },
    ngoIcon: { width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(52, 168, 83, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    tabContainer: { borderBottom: '1px solid var(--border)' },
    tabs: { display: 'flex', gap: '3rem' },
    tabBtn: { background: 'none', border: 'none', padding: '1.5rem 0', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', borderBottom: '3px solid transparent' },
    tabContent: { minHeight: '300px' },
    aboutContent: { display: 'flex', flexDirection: 'column', gap: '2.5rem' },
    description: { fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' },
    impactGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    impactCard: { padding: '1.5rem', background: 'var(--glass)', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '1rem', fontWeight: '600' },
    emptyState: { textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' },
    galleryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' },
    galleryImgWrapper: { borderRadius: '20px', overflow: 'hidden', height: '200px', border: '1px solid var(--border)' },
    galleryImg: { width: '100%', height: '100%', objectFit: 'cover' },
    sidebarCol: { display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '120px' },
    stickyCard: { padding: '2.5rem', background: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' },
    sidebarHeader: { marginBottom: '2.5rem' },
    progressTop: { marginBottom: '1.5rem' },
    amountRaised: { fontSize: '2.5rem', fontWeight: '900', margin: 0 },
    raisedLabel: { fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' },
    progressBarBase: { height: '12px', background: 'var(--glass)', borderRadius: '100px', overflow: 'hidden', margin: '1.5rem 0' },
    progressBarFill: { height: '100%', background: 'var(--gradient-main)', borderRadius: '100px' },
    sidebarStats: { display: 'flex', gap: '3rem' },
    sideStat: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    donateForm: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    inputGroup: { position: 'relative' },
    currencySymbol: { position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-muted)' },
    donateInput: { padding: '1.2rem 1.5rem 1.2rem 3.5rem', fontSize: '1.5rem', fontWeight: '800', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '18px', color: '#fff' },
    options: { display: 'flex', alignItems: 'center' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: 'var(--text-secondary)' },
    submitBtn: { padding: '1.2rem', fontSize: '1.1rem', fontWeight: '800', width: '100%', borderRadius: '18px' },
    sidebarActions: { display: 'flex', gap: '1rem', marginTop: '2rem' },
    favBtn: { flex: 1, padding: '0.8rem', borderRadius: '14px', background: 'var(--glass)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    shareBtn: { flex: 1, padding: '0.8rem', borderRadius: '14px', background: 'var(--glass)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-primary)' },
    securityInfo: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' },
    recentDonorsCard: { padding: '2rem' },
    recentTitle: { fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' },
    donorList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    donorItem: { display: 'flex', gap: '1rem', alignItems: 'center' },
    donorAvatar: { width: '40px', height: '40px', borderRadius: '12px', background: 'var(--glass-heavy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--primary)' },
    donorName: { fontSize: '0.95rem', fontWeight: '700', margin: 0 },
    donorAmt: { fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }
};

export default CampaignDetails;
