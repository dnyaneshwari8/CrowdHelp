const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// Initialize Razorpay instance with keys from .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// Root route for testing
app.get('/', (req, res) => {
    res.send('Donation Backend is running!');
});

/**
 * POST /create-order
 * Creates a new Razorpay order based on the amount sent from the frontend.
 */
app.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        // Razorpay expects amount in the smallest currency unit (paise for INR)
        // So, 100 paise = 1 INR. We multiply amount by 100.
        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        // Create order using Razorpay SDK
        const order = await razorpay.orders.create(options);
        console.log("Order Created Successfully:", order.id);

        // Send the order details back to the frontend
        res.status(200).json(order);
    } catch (error) {
        // Detailed error logging to help identify why order creation failed
        console.error("--- Razorpay Order Creation Error ---");
        console.error("Message:", error.error ? error.error.description : error.message);
        console.error("Full Error:", error);
        console.error("--------------------------------------");
        
        res.status(500).json({ 
            message: "Failed to create Razorpay order", 
            error: error.error ? error.error.description : error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
