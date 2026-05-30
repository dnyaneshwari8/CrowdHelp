import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import Spinner from '../components/Spinner';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const res = await fetchUserProfile();
                setFavorites(res.data.user.favorites);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };
        loadFavorites();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div style={styles.container}>
            <h1>My Favorite Campaigns</h1>
            <div style={styles.grid}>
                {favorites.length > 0 ? favorites.map(campaign => (
                    <CampaignCard key={campaign._id} campaign={campaign} />
                )) : (
                    <p>You haven't added any campaigns to your favorites yet.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
    }
};

export default Favorites;
