import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email not found. Please log in or register.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await verifyOTP({ email, otp, type: 'registration' });
            loginUser(response.data.user, response.token);
            alert('Account verified successfully');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '3rem 2.5rem', borderRadius: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.4rem' }}>Verify OTP</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {email ? `Verifying: ${email}` : 'Enter your email and OTP'}
                    </p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(234,67,53,0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP (or 123456)"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem', fontWeight: '700' }}
                    />

                    <button 
                        type="button" 
                        onClick={() => setOtp('123456')}
                        style={{ background: 'none', border: '1px dashed var(--border)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                    >
                        ⚡ Click to use Demo OTP: 123456
                    </button>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '1rem', width: '100%' }}>
                        {loading ? 'Verifying...' : 'Verify & Continue'} <ArrowRight size={18} />
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
