import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { Mail, ArrowRight, ArrowLeft, Key } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await forgotPassword(email);
            alert(response.message);
            navigate('/reset-password', { state: { email } });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div className="card" style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconCircle}>
                        <Key size={32} color="var(--primary)" />
                    </div>
                    <h1 style={styles.title}>Forgot Password?</h1>
                    <p style={styles.subtitle}>No worries, we'll send you reset instructions.</p>
                </div>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputWrapper}>
                        <Mail size={18} style={styles.icon}/>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Sending OTP...' : 'Reset Password'} <ArrowRight size={18}/>
                    </button>
                </form>

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
        fontSize: '0.95rem'
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
        gap: '0.5rem',
        transition: 'color 0.2s ease'
    }
};

export default ForgotPassword;
