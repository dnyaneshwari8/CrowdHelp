import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { ArrowRight } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
    return (
        <div className="card" style={styles.card}>
            <div style={styles.imageContainer}>
                <img 
                    src={`http://localhost:5000${campaign.image}`} 
                    alt={campaign.title} 
                    style={styles.image} 
                />
                <div style={styles.categoryBadge}>{campaign.category}</div>
            </div>
            <div style={styles.content}>
                <h3 style={styles.title}>{campaign.title}</h3>
                <p style={styles.description}>
                    {campaign.description ? campaign.description.substring(0, 100) : ''}...
                </p>
                
                <div style={styles.progressSection}>
                    <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />
                </div>

                <Link to={`/campaigns/${campaign._id}`} style={styles.button}>
                    View Details <ArrowRight size={18}/>
                </Link>
            </div>
        </div>
    );
};

const styles = {
    card: {
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        background: 'var(--bg-card)',
        height: '100%'
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: '220px',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s ease'
    },
    categoryBadge: {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        color: 'var(--primary)',
        padding: '0.4rem 1rem',
        borderRadius: '100px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: '1px solid var(--border)'
    },
    content: {
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    title: {
        margin: '0 0 1rem 0',
        fontSize: '1.4rem',
        lineHeight: '1.3',
        color: '#fff'
    },
    description: {
        fontSize: '0.95rem',
        color: 'var(--text-secondary)',
        marginBottom: '2rem',
        lineHeight: '1.5',
        flex: 1
    },
    progressSection: {
        marginBottom: '2rem'
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        backgroundColor: 'var(--glass)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        padding: '0.8rem',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        fontSize: '0.95rem'
    }
};

export default CampaignCard;
