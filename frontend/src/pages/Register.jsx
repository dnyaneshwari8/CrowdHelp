import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await register(formData);
            alert('Registration successful! Please check your email for OTP.');
            navigate('/otp-verification', { state: { email: formData.email } });
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div className="card" style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Join CrowdHelp</h1>
                    <p style={styles.subtitle}>Start your journey of making an impact</p>
                </div>
                
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
                            placeholder="Phone Number"
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
                            placeholder="Create Password"
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
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
    },
    card: {
        width: '100%',
        maxWidth: '480px',
        padding: '3.5rem'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2.5rem'
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
        marginTop: '2.5rem',
        textAlign: 'center',
        fontSize: '0.95rem',
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        color: 'var(--text-secondary)'
    },
    loginLink: {
        color: 'var(--primary)',
        fontWeight: '700'
    }
};

export default Register;
