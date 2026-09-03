const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load environment variables at the VERY TOP
dotenv.config();

// 2. Import other modules AFTER dotenv.config()
const connectDB = require('./config/db');
const { seedDatabase } = require('./utils/seedData');
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
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://donation-ppur.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during development
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

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
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

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'CrowdHelp API is running successfully!',
        status: 'online',
        demoCredentials: {
            admin: { email: 'admin@crowdhelp.com', password: 'adminpassword', role: 'ADMIN' },
            ngo: { email: 'ngo@careindia.org', password: 'ngopassword', role: 'NGO' },
            donor: { email: 'user@crowdhelp.com', password: 'userpassword', role: 'USER' }
        }
    });
});

// Global Error Handler
app.use(errorMiddleware);

// 5. Connect to Database, seed data, and start server
const startServer = async () => {
    try {
        await connectDB();
        await seedDatabase();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`\n======================================================`);
            console.log(` CrowdHelp Backend is running on http://localhost:${PORT}`);
            console.log(` Demo Admin: admin@crowdhelp.com / adminpassword`);
            console.log(` Demo NGO:   ngo@careindia.org   / ngopassword`);
            console.log(` Demo User:  user@crowdhelp.com  / userpassword`);
            console.log(`======================================================\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
