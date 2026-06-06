/**
 * Global Error Handler Middleware
 * Standardizes all error responses across the API.
 */
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development vs Production error info
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } else {
        // Production: Don't leak sensitive error details
        
        // Mongoose bad ObjectId
        if (err.name === 'CastError') err.message = `Invalid ${err.path}: ${err.value}`;
        
        // Mongoose duplicate key
        if (err.code === 11000) {
            const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
            err.message = `Duplicate field value: ${value}. Please use another value!`;
            err.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            err.message = `Invalid input data. ${errors.join('. ')}`;
            err.statusCode = 400;
        }

        // JWT errors
        if (err.name === 'JsonWebTokenError') {
            err.message = 'Invalid token. Please log in again!';
            err.statusCode = 401;
        }
        if (err.name === 'TokenExpiredError') {
            err.message = 'Your token has expired! Please log in again.';
            err.statusCode = 401;
        }

        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message || 'Something went wrong on our end.'
        });
    }
};

module.exports = errorMiddleware;
