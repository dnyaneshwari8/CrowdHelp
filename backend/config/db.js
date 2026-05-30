const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7/8 changes
        mongoose.set('strictQuery', false);
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully to:', mongoose.connection.host);
    } catch (error) {
        console.error('--- MONGODB CONNECTION ERROR ---');
        console.error('Error:', error.message);
        console.error('Tip: If you are on Windows, try using 127.0.0.1 instead of localhost in MONGODB_URI');
        console.error('---------------------------------');
        process.exit(1);
    }
};

module.exports = connectDB;
