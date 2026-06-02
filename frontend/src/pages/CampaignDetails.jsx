import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    fetchCampaignById, 
    createOrder, 
    verifyPayment, 
    toggleFavorite, 
    fetchUserProfile,
    fetchCampaignUpdates 
} from '../services/api';
import ProgressBar from '../components/ProgressBar';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { Heart, Calendar, Target, ShieldCheck, Share2, ArrowLeft, Megaphone, MessageSquare } from 'lucide-react';

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [campaign, setCampaign] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [donating, setDonating] = useState(false);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const [campaignRes, updatesRes] = await Promise.all([
                    fetchCampaignById(id),
                    fetchCampaignUpdates(id)
                ]);
                
                setCampaign(campaignRes.data.campaign);
                setUpdates(updatesRes.data.updates);
                
                if (user) {
                    const profile = await fetchUserProfile();
                    setIsFav(profile.data.user.favorites.some(fav => String(fav._id) === id));
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
            alert('Failed to initiate donation');
            setDonating(false);
        }
    };

    if (loading) return <Spinner />;
    if (!campaign) return <div className="container">Campaign not found.</div>;

    return (
        <div style={styles.container}>
            <div style={styles.backNav}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}>
                    <ArrowLeft size={20}/> Back
                </button>
            </div>

            <div style={styles.layout}>
                <div style={styles.mainContent}>
                    <div style={styles.imageWrapper}>
                        <img src={`http://localhost:5000${campaign.image}`} alt={campaign.title} style={styles.image} />
                        <div style={styles.categoryBadge}>{campaign.category}</div>
                    </div>
                    
                    <div style={styles.header}>
                        <h1 style={styles.title}>{campaign.title}</h1>
                        <div style={styles.headerActions}>
                            <button onClick={handleFavorite} style={{...styles.actionBtn, color: isFav ? '#f44336' : 'var(--text-secondary)'}}>
                                <Heart fill={isFav ? '#f44336' : 'none'} size={24}/>
                            </button>
                            <button style={styles.actionBtn}>
                                <Share2 size={24}/>
                            </button>
                        </div>
                    </div>

                    <div style={styles.meta}>
                        <div style={styles.metaItem}>
                            <Calendar size={18} color="var(--primary)"/>
                            <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                        </div>
                        <div style={styles.metaItem}>
                            <ShieldCheck size={18} color="#4CAF50"/>
                            <span>Verified Cause</span>
                        </div>
                    </div>

                    <div style={styles.descriptionBox}>
                        <h2>About this campaign</h2>
                        <p style={styles.description}>{campaign.description}</p>
                    </div>

                    {/* Campaign Updates Section */}
                    <div style={styles.updatesSection}>
                        <div style={styles.updatesHeader}>
                            <Megaphone size={24} color="var(--primary)"/>
                            <h2>Campaign Updates</h2>
                        </div>
                        <div style={styles.updateList}>
                            {updates.length > 0 ? (
                                updates.map((update, index) => (
                                    <div key={update._id} style={styles.updateCard}>
                                        <div style={styles.updateMeta}>
                                            <span style={styles.updateDate}>
                                                <Calendar size={14}/>
                                                {new Date(update.createdAt).toLocaleDateString()}
                                            </span>
                                            <span style={styles.updateIndex}>Update #{updates.length - index}</span>
                                        </div>
                                        <h3 style={styles.updateTitle}>{update.title}</h3>
                                        <p style={styles.updateContent}>{update.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div style={styles.noUpdates}>
                                    <MessageSquare size={32} color="var(--text-secondary)" style={{ marginBottom: '1rem' }}/>
                                    <p>No updates have been posted yet. Check back soon!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={styles.sidebar}>
                    <div className="card" style={styles.donateCard}>
                        <div style={styles.cardHeader}>
                            <Target size={24} color="var(--primary)"/>
                            <h3>Fundraising Progress</h3>
                        </div>
                        
                        <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />
                        
                        <form onSubmit={handleDonate} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Contribution Amount</label>
                                <div style={styles.inputWrapper}>
                                    <span style={styles.currencyPrefix}>₹</span>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        placeholder="500"
                                        required 
                                        style={styles.input}
                                    />
                                </div>
                            </div>
                            <div style={styles.checkboxGroup}>
                                <input 
                                    type="checkbox" 
                                    checked={isAnonymous} 
                                    onChange={(e) => setIsAnonymous(e.target.checked)} 
                                    id="anonymous"
                                    style={styles.checkbox}
                                />
                                <label htmlFor="anonymous" style={styles.checkboxLabel}>Donate Anonymously</label>
                            </div>
                            <button type="submit" disabled={donating} style={styles.submitBtn}>
                                {donating ? 'Connecting to Razorpay...' : 'Support this Cause'}
                            </button>
                        </form>
                        <p style={styles.secureMsg}>
                            <ShieldCheck size={14}/> Secure payment via Razorpay
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem'
    },
    backNav: {
        marginBottom: '2rem'
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1rem',
        fontWeight: '600'
    },
    layout: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 0.6fr',
        gap: '4rem'
    },
    mainContent: {
        textAlign: 'left'
    },
    imageWrapper: {
        position: 'relative',
        borderRadius: '32px',
        overflow: 'hidden',
        height: '480px',
        marginBottom: '3rem',
        border: '1px solid var(--border)'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    categoryBadge: {
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        color: 'var(--primary)',
        padding: '0.5rem 1.25rem',
        borderRadius: '100px',
        fontSize: '0.85rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        border: '1px solid var(--border)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.5rem',
        gap: '2rem'
    },
    title: {
        fontSize: '3rem',
        lineHeight: '1.2',
        margin: 0
    },
    headerActions: {
        display: 'flex',
        gap: '1rem'
    },
    actionBtn: {
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        padding: '0.75rem',
        borderRadius: '16px',
        color: 'var(--text-primary)',
        width: 'auto'
    },
    meta: {
        display: 'flex',
        gap: '2.5rem',
        marginBottom: '3rem'
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
        fontWeight: '500'
    },
    descriptionBox: {
        paddingTop: '3rem',
        borderTop: '1px solid var(--border)'
    },
    description: {
        marginTop: '1.5rem',
        lineHeight: '1.8',
        color: 'var(--text-secondary)',
        fontSize: '1.15rem'
    },
    updatesSection: {
        marginTop: '4rem',
        paddingTop: '3rem',
        borderTop: '1px solid var(--border)'
    },
    updatesHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
    },
    updateList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    updateCard: {
        background: 'var(--glass)',
        padding: '2rem',
        borderRadius: '24px',
        border: '1px solid var(--border)',
        textAlign: 'left'
    },
    updateMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        fontSize: '0.85rem',
        color: 'var(--primary)',
        fontWeight: '600'
    },
    updateDate: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    updateIndex: {
        background: 'var(--primary-light)',
        padding: '0.25rem 0.75rem',
        borderRadius: '100px',
        color: 'var(--primary)'
    },
    updateTitle: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
        color: 'var(--text-primary)'
    },
    updateContent: {
        lineHeight: '1.7',
        color: 'var(--text-secondary)',
        fontSize: '1.05rem',
        margin: 0
    },
    noUpdates: {
        textAlign: 'center',
        padding: '4rem',
        background: 'var(--glass)',
        borderRadius: '24px',
        border: '1px dashed var(--border)',
        color: 'var(--text-secondary)'
    },
    sidebar: {
        position: 'relative'
    },
    donateCard: {
        position: 'sticky',
        top: '100px',
        padding: '2.5rem'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
    },
    formGroup: {
        marginBottom: '2rem'
    },
    label: {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        marginBottom: '1rem'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    currencyPrefix: {
        position: 'absolute',
        left: '1.25rem',
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'var(--text-primary)'
    },
    input: {
        paddingLeft: '2.5rem',
        fontSize: '1.25rem',
        fontWeight: '700',
        background: 'var(--bg-surface)'
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2.5rem'
    },
    checkbox: {
        width: '20px',
        height: '20px',
        accentColor: 'var(--primary)'
    },
    checkboxLabel: {
        fontSize: '0.95rem',
        color: 'var(--text-secondary)',
        cursor: 'pointer'
    },
    submitBtn: {
        width: '100%',
        padding: '1.25rem',
        fontSize: '1.1rem',
        fontWeight: '700'
    },
    secureMsg: {
        marginTop: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
    }
};

export default CampaignDetails;
