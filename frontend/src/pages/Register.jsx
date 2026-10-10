import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const response = await register(formData);
            
            // Auto login after instant registration
            if (response.token && response.data?.user) {
                loginUser(response.data.user, response.token);
                alert('Account created successfully! Welcome to CrowdHelp.');
                navigate('/');
            } else {
                alert('Registration successful! You can now log in.');
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div className="card" style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Join CrowdHelp</h1>
                    <p style={styles.subtitle}>Instant registration with zero email verification needed</p>
                </div>

                <div style={styles.instantBadge}>
                    <Sparkles size={16} color="var(--primary)" />
                    <span>Instant Activation (No Email OTP Required)</span>
                </div>

                {error && (
                    <div style={styles.errorAlert}>
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputWrapper}>
                        <User size={18} style={styles.icon}/>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputWrapper}>
                        <Mail size={18} style={styles.icon}/>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputWrapper}>
                        <Phone size={18} style={styles.icon}/>
                        <input
                            type="text"
                            placeholder="Phone Number (e.g. 9876543210)"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.inputWrapper}>
                        <Lock size={18} style={styles.icon}/>
                        <input
                            type="password"
                            placeholder="Create Password (min 6 characters)"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputWrapper}>
                        <Lock size={18} style={styles.icon}/>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={18}/>
                    </button>
                </form>

                <div style={styles.demoLinkBox}>
                    <span>Looking for demo accounts?</span>
                    <Link to="/login" style={styles.demoLink}>Try Admin, NGO or User Demo</Link>
                </div>

                <div style={styles.footer}>
                    <span>Already have an account?</span>
                    <Link to="/login" style={styles.loginLink}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem'
    },
    card: {
        width: '100%',
        maxWidth: '480px',
        padding: '3rem 2.5rem',
        borderRadius: '24px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xl)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '1.5rem'
    },
    title: {
        fontSize: '2rem',
        marginBottom: '0.4rem',
        fontWeight: '800'
    },
    subtitle: {
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
    },
    instantBadge: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        background: 'rgba(138, 180, 248, 0.1)',
        border: '1px solid rgba(138, 180, 248, 0.25)',
        color: 'var(--primary)',
        padding: '0.5rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '700',
        marginBottom: '1.5rem'
    },
    errorAlert: {
        background: 'rgba(234, 67, 53, 0.1)',
        border: '1px solid var(--error)',
        color: 'var(--error)',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        marginBottom: '1.25rem',
        fontSize: '0.85rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
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
        paddingLeft: '3.5rem',
        width: '100%'
    },
    button: {
        marginTop: '0.5rem',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        background: 'var(--primary)',
        color: '#000',
        border: 'none',
        borderRadius: '14px',
        fontWeight: '700',
        fontSize: '1rem',
        cursor: 'pointer'
    },
    demoLinkBox: {
        marginTop: '1.5rem',
        padding: '0.75rem',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border)',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    demoLink: {
        color: 'var(--primary)',
        fontWeight: '700',
        textDecoration: 'none'
    },
    footer: {
        marginTop: '1.5rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        color: 'var(--text-secondary)'
    },
    loginLink: {
        color: 'var(--primary)',
        fontWeight: '700',
        textDecoration: 'none'
    }
};

export default Register;
