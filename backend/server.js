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
const ngoRoutes = require('./routes/ngoRoutes');
const ngoApplicationRoutes = require('./routes/ngoApplicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const supportRoutes = require('./routes/supportRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const path = require('path');
const fs = require('fs');

const app = express();

// Ensure required directories exist
const uploadDir = path.join(__dirname, 'uploads');
const receiptsDir = path.join(__dirname, 'receipts');
const certificatesDir = path.join(__dirname, 'certificates');

[uploadDir, receiptsDir, certificatesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// 3. Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://donation-ppur.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logger Middleware (To see incoming data)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        if (req.headers['content-type']?.includes('multipart/form-data')) {
            console.log('Body: [Multipart Form Data - Logging skipped for binary data]');
        } else {
            console.log('Body:', req.body);
        }
    }
    next();
});

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/ngo-applications', ngoApplicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api', donationRoutes);

// 404 Handler for undefined API routes
// This catches any request starting with /api that wasn't handled by the routes above
app.use('/api', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
});

// Root route
app.get('/', (req, res) => {
    res.send('Donation Production Backend is running!');
});

// Global Error Handler
app.use(errorMiddleware);

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
