import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

const CampaignCard = ({ campaign }) => {
    return (
        <div className="card" style={styles.card}>
            <img 
                src={`http://localhost:5000${campaign.image}`} 
                alt={campaign.title} 
                style={styles.image} 
            />
            <div style={styles.content}>
                <span style={styles.category}>{campaign.category}</span>
                <h3 style={styles.title}>{campaign.title}</h3>
                <p style={styles.description}>
                    {campaign.description ? campaign.description.substring(0, 100) : ''}...
                </p>
                <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />
                <Link to={`/campaigns/${campaign._id}`} style={styles.button}>
                    View Details
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
        textAlign: 'left'
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover'
    },
    content: {
        padding: '1.5rem'
    },
    category: {
        fontSize: '0.8rem',
        color: '#646cff',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    title: {
        margin: '0.5rem 0',
        fontSize: '1.25rem'
    },
    description: {
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '1rem'
    },
    button: {
        display: 'block',
        textAlign: 'center',
        backgroundColor: '#646cff',
        color: 'white',
        padding: '0.6rem',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '1rem'
    }
};

export default CampaignCard;
