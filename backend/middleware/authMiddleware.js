const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes and check for valid JWT
 */
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // 1) Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'You are not logged in. Please log in to get access.' });
        }

        // 2) Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists. Please log in again.' });
        }

        // 4) Check if user is blocked
        if (currentUser.isBlocked) {
            return res.status(403).json({ message: 'Your account is blocked. Please contact support.' });
        }

        // Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Your token has expired. Please log in again.' });
        }
        
        res.status(500).json({ message: 'Internal Server Error in authentication middleware', error: error.message });
    }
};

/**
 * Middleware to restrict access based on user roles
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array like ['ADMIN']
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }
        next();
    };
};
