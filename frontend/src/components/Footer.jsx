import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    Linkedin, 
    Mail, 
    Phone, 
    MapPin, 
    Heart,
    ArrowRight
} from 'lucide-react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className="container">
                <div style={styles.grid}>
                    {/* Brand Section */}
                    <div style={styles.brandSection}>
                        <div style={styles.logo}>
                            <div style={styles.logoIcon}>C</div>
                            <span style={styles.logoText}>CrowdHelp</span>
                        </div>
                        <p style={styles.description}>
                            Empowering change through community-driven crowdfunding. Support verified causes and NGOs globally.
                        </p>
                        <div style={styles.socials}>
                            <a href="#" style={styles.socialLink}><Facebook size={20}/></a>
                            <a href="#" style={styles.socialLink}><Twitter size={20}/></a>
                            <a href="#" style={styles.socialLink}><Instagram size={20}/></a>
                            <a href="#" style={styles.socialLink}><Linkedin size={20}/></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div style={styles.linksSection}>
                        <h4 style={styles.title}>Quick Links</h4>
                        <ul style={styles.list}>
                            <li><Link to="/campaigns" style={styles.link}>Browse Campaigns</Link></li>
                            <li><Link to="/donor-wall" style={styles.link}>Donor Wall</Link></li>
                            <li><Link to="/leaderboard" style={styles.link}>Leaderboard</Link></li>
                            <li><Link to="/apply-ngo" style={styles.link}>Become a Partner NGO</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div style={styles.linksSection}>
                        <h4 style={styles.title}>Support</h4>
                        <ul style={styles.list}>
                            <li><Link to="/about" style={styles.link}>About Us</Link></li>
                            <li><Link to="/contact" style={styles.link}>Contact</Link></li>
                            <li><Link to="/privacy" style={styles.link}>Privacy Policy</Link></li>
                            <li><Link to="/terms" style={styles.link}>Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div style={styles.newsletter}>
                        <h4 style={styles.title}>Stay Updated</h4>
                        <p style={styles.newsletterText}>Join our newsletter to receive impact stories and new campaign updates.</p>
                        <div style={styles.inputGroup}>
                            <input type="email" placeholder="Email address" style={styles.input} />
                            <button style={styles.btn}>
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div style={styles.bottom}>
                    <p style={styles.copy}>
                        © {new Date().getFullYear()} CrowdHelp. Made with <Heart size={14} color="var(--error)" fill="var(--error)"/> for a better world.
                    </p>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '5rem 0 2rem',
        marginTop: 'auto'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '4rem',
        marginBottom: '4rem'
    },
    brandSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--text-primary)'
    },
    logoIcon: {
        width: '32px',
        height: '32px',
        background: 'var(--gradient-main)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        fontWeight: '900',
        fontSize: '1.2rem'
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: '800',
        letterSpacing: '-0.02em'
    },
    description: {
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        maxWidth: '300px'
    },
    socials: {
        display: 'flex',
        gap: '1rem'
    },
    socialLink: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        transition: 'all 0.2s ease'
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        color: 'var(--text-primary)'
    },
    list: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    link: {
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.95rem',
        transition: 'all 0.2s ease'
    },
    newsletter: {
        gridColumn: 'span 1'
    },
    newsletterText: {
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        marginBottom: '1.5rem'
    },
    inputGroup: {
        display: 'flex',
        gap: '0.5rem'
    },
    input: {
        flex: 1,
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        background: 'var(--bg-dark)',
        border: '1px solid var(--border)',
        color: '#fff',
        outline: 'none'
    },
    btn: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'var(--primary)',
        color: '#000',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    bottom: {
        paddingTop: '2rem',
        borderTop: '1px solid var(--border)',
        textAlign: 'center'
    },
    copy: {
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem'
    }
};

export default Footer;
