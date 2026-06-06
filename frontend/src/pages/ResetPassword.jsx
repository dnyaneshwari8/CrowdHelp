import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOTP, resetPassword } from '../services/api';
import { Lock, ShieldCheck, ArrowRight, ArrowLeft, Key, MessageSquare } from 'lucide-react';

const ResetPassword = () => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyOTP({ email, otp, type: 'password_reset' });
            setVerified(true);
            alert('OTP Verified. Now enter your new password.');
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ email, otp, password: newPassword });
            alert('Password reset successful. Please login.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div className="card" style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconCircle}>
                        {verified ? <Lock size={32} color="var(--primary)" /> : <ShieldCheck size={32} color="var(--primary)" />}
                    </div>
                    <h1 style={styles.title}>{verified ? 'Set New Password' : 'Verify OTP'}</h1>
                    <p style={styles.subtitle}>
                        {verified ? 'Choose a strong password for your account.' : `We've sent a code to ${email || 'your email'}.`}
                    </p>
                </div>
                
                {!verified ? (
                    <form onSubmit={handleVerifyOTP} style={styles.form}>
                        <div style={styles.inputWrapper}>
                            <MessageSquare size={18} style={styles.icon}/>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={styles.button}>
                            {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRight size={18}/>
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} style={styles.form}>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.icon}/>
                            <input
                                type="password"
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.icon}/>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={styles.button}>
                            {loading ? 'Resetting...' : 'Update Password'} <ArrowRight size={18}/>
                        </button>
                    </form>
                )}

                <div style={styles.footer}>
                    <Link to="/login" style={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        padding: '3.5rem'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    iconCircle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(138, 180, 248, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
    },
    title: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
        fontWeight: '800'
    },
    subtitle: {
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        wordBreak: 'break-all'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        position: 'absolute',
        left: '1.2rem',
        color: 'var(--text-secondary)'
    },
    input: {
        paddingLeft: '3.5rem'
    },
    button: {
        marginTop: '1rem',
        padding: '1rem'
    },
    footer: {
        marginTop: '2rem',
        textAlign: 'center'
    },
    backLink: {
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
    }
};

export default ResetPassword;
