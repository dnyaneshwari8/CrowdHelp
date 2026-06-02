import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login({ identifier, password });
            loginUser(response.data.user, response.token);
            alert('Login successful');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div className="card" style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Enter your details to access your account</p>
                </div>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputWrapper}>
                        <Mail size={18} style={styles.icon}/>
                        <input
                            type="text"
                            placeholder="Email or Phone"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.inputWrapper}>
                        <Lock size={18} style={styles.icon}/>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.forgotPass}>
                        <Link to="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Logging in...' : 'Sign In'} <ArrowRight size={18}/>
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>Don't have an account?</span>
                    <Link to="/register" style={styles.registerLink}>Create account</Link>
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
    forgotPass: {
        textAlign: 'right'
    },
    forgotLink: {
        fontSize: '0.85rem',
        color: 'var(--primary)',
        fontWeight: '600'
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
    registerLink: {
        color: 'var(--primary)',
        fontWeight: '700'
    }
};

export default Login;
