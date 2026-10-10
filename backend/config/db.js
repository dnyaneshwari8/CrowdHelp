const mongoose = require('mongoose');

let mongoServerInstance = null;

const connectDB = async () => {
    mongoose.set('strictQuery', false);

    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crowdhelp';
    
    // First attempt: Connect to configured MongoDB URI (local or Atlas)
    try {
        console.log(`Connecting to MongoDB at: ${uri}...`);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
        console.log(' MongoDB Connected Successfully to:', mongoose.connection.host);
        return;
    } catch (error) {
        console.warn(`\n[Database Warning] Could not connect to external/local MongoDB (${error.message}).`);
        console.log(' Initiating seamless embedded MongoMemoryServer fallback for zero-config execution...');
    }

    // Fallback: Start MongoMemoryServer so the app runs without any manual installation
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServerInstance = await MongoMemoryServer.create({
            instance: {
                dbName: 'crowdhelp'
            }
        });
        const memoryUri = mongoServerInstance.getUri();
        await mongoose.connect(memoryUri);
        console.log(' Connected to Embedded MongoMemoryServer successfully at:', memoryUri);
    } catch (fallbackError) {
        console.error('--- CRITICAL MONGODB CONNECTION ERROR ---');
        console.error('Error:', fallbackError.message);
        console.error('-----------------------------------------');
        process.exit(1);
    }
};

module.exports = connectDB;
