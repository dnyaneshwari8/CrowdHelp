import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            alert('Email not found. Please register again.');
            return;
        }
        setLoading(true);
        try {
            const response = await verifyOTP({ email, otp, type: 'registration' });
            loginUser(response.data.user, response.token);
            alert('Account verified successfully');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2>Verify OTP</h2>
            <p>Sent to: {email}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
            </form>
        </div>
    );
};

export default OTPVerification;
