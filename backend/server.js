const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load environment variables at the VERY TOP
dotenv.config();

// 2. Import other modules AFTER dotenv.config()
const connectDB = require('./config/db');
const donationRoutes = require('./routes/donationRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logger Middleware (To see incoming data)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') console.log('Body:', req.body);
    next();
});

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/users', userRoutes);
app.use('/api', donationRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Donation Production Backend is running!');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('--- GLOBAL ERROR CAUGHT ---');
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});

// 5. Connect to Database and then start server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
