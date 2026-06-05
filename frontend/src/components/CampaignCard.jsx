import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';
import { 
    ArrowRight, 
    Calendar, 
    Target, 
    Clock, 
    Heart,
    Share2,
    ShieldCheck
} from 'lucide-react';

const CampaignCard = ({ campaign }) => {
    const percentage = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
    
    // Calculate days remaining (mock logic if not in data)
    const daysLeft = campaign.daysLeft || 15;

    return (
        <motion.div 
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="card" 
            style={styles.card}
        >
            <div style={styles.imageContainer}>
                <img 
                    src={getImageUrl(campaign.image)} 
                    alt={campaign.title} 
                    style={styles.image} 
                />
                <div style={styles.overlay}>
                    <div className="badge badge-primary" style={styles.categoryBadge}>
                        {campaign.category}
                    </div>
                    <button style={styles.favoriteBtn}>
                        <Heart size={18} />
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.ngoInfo}>
                    <div style={styles.ngoAvatar}>
                        <ShieldCheck size={14} color="var(--success)" />
                    </div>
                    <span style={styles.ngoName}>{campaign.ngoName || 'Verified NGO'}</span>
                </div>

                <h3 style={styles.title}>{campaign.title}</h3>
                <p style={styles.description}>
                    {campaign.description ? campaign.description.substring(0, 85) : ''}...
                </p>
                
                <div style={styles.statsContainer}>
                    <div style={styles.statItem}>
                        <Target size={16} color="var(--primary)" />
                        <span>₹{campaign.goalAmount.toLocaleString()} Goal</span>
                    </div>
                    <div style={styles.statItem}>
                        <Clock size={16} color="var(--warning)" />
                        <span>{daysLeft} days left</span>
                    </div>
                </div>

                <div style={styles.progressSection}>
                    <div style={styles.progressHeader}>
                        <span style={styles.percentageText}>{percentage}% Raised</span>
                        <span style={styles.amountText}>₹{campaign.currentAmount.toLocaleString()}</span>
                    </div>
                    <div style={styles.progressBarBase}>
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={styles.progressBarFill}
                        />
                    </div>
                </div>

                <div style={styles.cardFooter}>
                    <Link to={`/campaigns/${campaign._id}`} className="btn btn-primary" style={styles.donateBtn}>
                        Donate Now
                    </Link>
                    <button style={styles.shareBtn}>
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const styles = {
    card: {
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px solid var(--border)',
        overflow: 'hidden'
    },
    imageContainer: {
        height: '220px',
        position: 'relative',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s ease'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)'
    },
    categoryBadge: {
        backdropFilter: 'blur(8px)',
        fontSize: '0.7rem',
        padding: '0.4rem 0.8rem'
    },
    favoriteBtn: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    content: {
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        flex: 1
    },
    ngoInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.25rem'
    },
    ngoAvatar: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'rgba(52, 168, 83, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ngoName: {
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: '800',
        lineHeight: '1.3',
        margin: 0,
        color: 'var(--text-primary)'
    },
    description: {
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
        margin: 0
    },
    statsContainer: {
        display: 'flex',
        gap: '1.5rem',
        margin: '0.5rem 0'
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        fontWeight: '600',
        color: 'var(--text-muted)'
    },
    progressSection: {
        marginTop: '0.5rem'
    },
    progressHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
    },
    percentageText: {
        fontSize: '0.9rem',
        fontWeight: '800',
        color: 'var(--primary)'
    },
    amountText: {
        fontSize: '0.9rem',
        fontWeight: '700',
        color: 'var(--text-primary)'
    },
    progressBarBase: {
        height: '8px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '100px',
        overflow: 'hidden'
    },
    progressBarFill: {
        height: '100%',
        background: 'linear-gradient(90deg, var(--primary) 0%, #4CAF50 100%)',
        borderRadius: '100px',
        boxShadow: '0 0 10px rgba(138, 180, 248, 0.3)'
    },
    cardFooter: {
        marginTop: 'auto',
        display: 'flex',
        gap: '1rem',
        paddingTop: '1rem'
    },
    donateBtn: {
        flex: 1,
        padding: '0.75rem'
    },
    shareBtn: {
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: 'var(--glass-heavy)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    }
};

export default CampaignCard;
