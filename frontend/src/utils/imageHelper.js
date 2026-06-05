export const getImageUrl = (path) => {
    if (!path) return 'https://res.cloudinary.com/dnt/image/upload/v1/crowdhelp_campaigns/placeholder.png'; // Fallback
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
};
