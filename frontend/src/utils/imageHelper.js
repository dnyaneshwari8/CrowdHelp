export const getImageUrl = (path) => {
    const placeholder = 'https://placehold.co/600x400/1a1a1a/ffffff?text=CrowdHelp';
    
    if (!path) return placeholder;
    
    // Check if it's the old broken Cloudinary placeholder from account 'dnt'
    if (typeof path === 'string' && path.includes('res.cloudinary.com/dnt')) {
        return placeholder;
    }

    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
};
