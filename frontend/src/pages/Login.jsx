import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck, Building2, UserCheck, KeyRound, Sparkles } from 'lucide-react';

const DEMO_ACCOUNTS = [
    {
        roleName: 'Admin',
        roleType: 'ADMIN',
        email: 'admin@crowdhelp.com',
        password: 'adminpassword',
        icon: <ShieldCheck size={18} color="#8ab4f8" />,
        badgeColor: 'rgba(138, 180, 248, 0.15)',
        textColor: '#8ab4f8',
        description: 'Full admin access, NGO approvals, campaign audits & platform analytics'
    },
    {
        roleName: 'Verified NGO',
        roleType: 'NGO',
        email: 'ngo@careindia.org',
        password: 'ngopassword',
        icon: <Building2 size={18} color="#34a853" />,
        badgeColor: 'rgba(52, 168, 83, 0.15)',
        textColor: '#34a853',
        description: 'NGO dashboard, create campaigns, donor analytics & impact reporting'
    },
    {
        roleName: 'Donor / User',
        roleType: 'USER',
        email: 'user@crowdhelp.com',
        password: 'userpassword',
        icon: <UserCheck size={18} color="#fbbc04" />,
        badgeColor: 'rgba(251, 188, 4, 0.15)',
        textColor: '#fbbc04',
        description: 'Explore campaigns, donate, track donations & download certificates'
    }
];

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleLoginWithCredentials = async (emailToUse, passwordToUse) => {
        setLoading(true);
        setError('');
        try {
            const response = await login({ identifier: emailToUse, password: passwordToUse });
            loginUser(response.data.user, response.token);
            
            // Redirect based on role
            const userRole = response.data.user?.role;
            if (userRole === 'ADMIN') {
                navigate('/admin');
            } else if (userRole === 'NGO') {
                navigate('/ngo/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLoginWithCredentials(identifier, password);
    };

    const handleQuickFill = (acc, autoLogin = false) => {
        setIdentifier(acc.email);
        setPassword(acc.password);
        if (autoLogin) {
            handleLoginWithCredentials(acc.email, acc.password);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                
                {/* Main Login Card */}
                <div className="card" style={styles.card}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Welcome Back</h1>
                        <p style={styles.subtitle}>Enter your details or choose a demo account below</p>
                    </div>

                    {error && (
                        <div style={styles.errorAlert}>
                            <span>{error}</span>
                        </div>
                    )}
                    
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

                {/* Demo Credentials Box */}
                <div className="card" style={styles.demoCard}>
                    <div style={styles.demoHeader}>
                        <div style={styles.demoHeaderIcon}><KeyRound size={20} color="var(--primary)" /></div>
                        <div>
                            <h3 style={styles.demoTitle}>Quick Demo Access</h3>
                            <p style={styles.demoSubtitle}>Click any account to auto-fill or log in instantly</p>
                        </div>
                    </div>

                    <div style={styles.demoList}>
                        {DEMO_ACCOUNTS.map((acc) => (
                            <div key={acc.roleType} style={styles.demoItem}>
                                <div style={styles.demoItemHeader}>
                                    <div style={{ ...styles.roleBadge, background: acc.badgeColor, color: acc.textColor }}>
                                        {acc.icon}
                                        <span>{acc.roleName}</span>
                                    </div>
                                    <div style={styles.demoActionBtns}>
                                        <button 
                                            type="button" 
                                            onClick={() => handleQuickFill(acc, false)} 
                                            style={styles.fillBtn}
                                            title="Fill Form"
                                        >
                                            Fill
                                        </button>
                                        <button 
                                            type="button" 
                                            disabled={loading}
                                            onClick={() => handleQuickFill(acc, true)} 
                                            style={styles.quickLoginBtn}
                                            title="Instant Login"
                                        >
                                            <Sparkles size={14} /> Quick Login
                                        </button>
                                    </div>
                                </div>
                                <div style={styles.demoDetails}>
                                    <div style={styles.demoRow}>
                                        <span style={styles.demoLabel}>Email:</span>
                                        <code style={styles.demoCode}>{acc.email}</code>
                                    </div>
                                    <div style={styles.demoRow}>
                                        <span style={styles.demoLabel}>Password:</span>
                                        <code style={styles.demoCode}>{acc.password}</code>
                                    </div>
                                </div>
                                <p style={styles.demoDesc}>{acc.description}</p>
                            </div>
                        ))}
                    </div>

                    <div style={styles.demoNote}>
                        💡 <strong>Note:</strong> Registration is instant and does not require Google SMTP or email verification.
                    </div>
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
    wrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '960px',
        alignItems: 'start'
    },
    card: {
        width: '100%',
        padding: '3rem 2.5rem',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-xl)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)'
    },
    demoCard: {
        width: '100%',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(138, 180, 248, 0.2)',
        boxShadow: 'var(--shadow-xl)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem'
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
        paddingLeft: '3.5rem',
        width: '100%'
    },
    forgotPass: {
        textAlign: 'right'
    },
    forgotLink: {
        fontSize: '0.85rem',
        color: 'var(--primary)',
        fontWeight: '600',
        textDecoration: 'none'
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
    footer: {
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        color: 'var(--text-secondary)'
    },
    registerLink: {
        color: 'var(--primary)',
        fontWeight: '700',
        textDecoration: 'none'
    },
    demoHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border)'
    },
    demoHeaderIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'rgba(138, 180, 248, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    demoTitle: {
        fontSize: '1.2rem',
        fontWeight: '800',
        margin: 0
    },
    demoSubtitle: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        margin: 0
    },
    demoList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    demoItem: {
        padding: '1rem 1.2rem',
        borderRadius: '16px',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem'
    },
    demoItemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    roleBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.3rem 0.6rem',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: '700'
    },
    demoActionBtns: {
        display: 'flex',
        gap: '0.5rem'
    },
    fillBtn: {
        padding: '0.3rem 0.6rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        borderRadius: '8px',
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        cursor: 'pointer'
    },
    quickLoginBtn: {
        padding: '0.3rem 0.65rem',
        fontSize: '0.75rem',
        fontWeight: '700',
        borderRadius: '8px',
        background: 'var(--primary)',
        border: 'none',
        color: '#000',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem'
    },
    demoDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '0.5rem 0.75rem',
        borderRadius: '8px',
        fontSize: '0.8rem'
    },
    demoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    demoLabel: {
        color: 'var(--text-muted)',
        fontWeight: '600'
    },
    demoCode: {
        color: 'var(--text-primary)',
        fontWeight: '700',
        fontFamily: 'monospace'
    },
    demoDesc: {
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        margin: 0,
        lineHeight: '1.3'
    },
    demoNote: {
        marginTop: '1.5rem',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        background: 'rgba(52, 168, 83, 0.1)',
        border: '1px solid rgba(52, 168, 83, 0.2)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4'
    }
};

export default Login;
