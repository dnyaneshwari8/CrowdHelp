import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCampaignById, createOrder, verifyPayment, toggleFavorite, fetchUserProfile } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

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

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const response = await fetchCampaignById(id);
                setCampaign(response.data.campaign);
                
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
                name: "Donation Project",
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
                theme: { color: "#646cff" },
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
            <div style={styles.mainContent}>
                <img src={`http://localhost:5000${campaign.image}`} alt={campaign.title} style={styles.image} />
                <div style={styles.header}>
                    <div>
                        <span style={styles.category}>{campaign.category}</span>
                        <h1 style={styles.title}>{campaign.title}</h1>
                    </div>
                    <button onClick={handleFavorite} style={{...styles.favBtn, color: isFav ? 'red' : '#666'}}>
                        <Heart fill={isFav ? 'red' : 'none'} />
                    </button>
                </div>
                <p style={styles.description}>{campaign.description}</p>
            </div>

            <div style={styles.sidebar}>
                <div className="card" style={styles.donateCard}>
                    <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />
                    
                    <form onSubmit={handleDonate} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label>Amount (INR)</label>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                placeholder="Enter amount"
                                required 
                            />
                        </div>
                        <div style={styles.checkboxGroup}>
                            <input 
                                type="checkbox" 
                                checked={isAnonymous} 
                                onChange={(e) => setIsAnonymous(e.target.checked)} 
                                id="anonymous"
                            />
                            <label htmlFor="anonymous">Donate Anonymously</label>
                        </div>
                        <button type="submit" disabled={donating} style={styles.submitBtn}>
                            {donating ? 'Processing...' : 'Support this Campaign'}
                        </button>
                    </form>
                </div>
                <div style={styles.info}>
                    <p>Starts: {new Date(campaign.startDate).toLocaleDateString()}</p>
                    <p>Ends: {new Date(campaign.endDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem'
    },
    image: {
        width: '100%',
        height: '400px',
        objectFit: 'cover',
        borderRadius: '10px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '1.5rem 0'
    },
    category: {
        color: '#646cff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '0.9rem'
    },
    title: {
        margin: '0.5rem 0'
    },
    favBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px'
    },
    description: {
        lineHeight: '1.6',
        color: '#333',
        fontSize: '1.1rem'
    },
    donateCard: {
        position: 'sticky',
        top: '2rem'
    },
    form: {
        marginTop: '1.5rem'
    },
    formGroup: {
        marginBottom: '1rem'
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        fontSize: '0.9rem'
    },
    submitBtn: {
        width: '100%',
        backgroundColor: '#646cff',
        color: 'white',
        padding: '1rem',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '1.1rem'
    },
    info: {
        marginTop: '2rem',
        fontSize: '0.9rem',
        color: '#666'
    }
};

export default CampaignDetails;
