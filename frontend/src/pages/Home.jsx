import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, verifyPayment } from '../services/api';
import Spinner from '../components/Spinner';

const Home = () => {
    const [formData, setFormData] = useState({
        donorName: '',
        donorEmail: '',
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDonate = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.donorName || !formData.donorEmail || !formData.amount) {
            alert("Please fill all fields");
            return;
        }

        if (isNaN(formData.amount) || formData.amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        setLoading(true);

        try {
            // Step 1: Create Order on Backend
            const order = await createOrder(formData);

            // Step 2: Open Razorpay Checkout
            const options = {
                key: "rzp_test_SblOacDmUEmet0", // Same key as Phase 1
                amount: order.amount,
                currency: order.currency,
                name: "Donation Project",
                description: "Phase 2 Donation",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // Step 3: Verify Payment on Backend (CRITICAL)
                        setLoading(true);
                        const verification = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verification.message === "Payment Verified Successfully") {
                            navigate('/payment-success', { 
                                state: { 
                                    paymentId: response.razorpay_payment_id,
                                    amount: formData.amount,
                                    donationId: verification.donationId
                                } 
                            });
                        }
                    } catch (error) {
                        console.error("Verification Error:", error);
                        navigate('/payment-failure');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: formData.donorName,
                    email: formData.donorEmail,
                },
                theme: {
                    color: "#646cff",
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Order Creation Error:", error);
            alert("Failed to initiate payment. Please try again.");
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="card">
            <h2>Make a Contribution</h2>
            <form onSubmit={handleDonate}>
                <div style={styles.formGroup}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="donorName"
                        placeholder="Enter your name"
                        value={formData.donorName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="donorEmail"
                        placeholder="Enter your email"
                        value={formData.donorEmail}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label>Amount (INR)</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    Donate Now
                </button>
            </form>
        </div>
    );
};

const styles = {
    formGroup: {
        marginBottom: '1rem',
        textAlign: 'left'
    }
};

export default Home;
