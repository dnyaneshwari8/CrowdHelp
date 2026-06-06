import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Heart,
    ArrowRight
} from 'lucide-react';

// Custom Brand Icons as Lucide removed them in v1.0+
const Facebook = ({ size = 20, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

const Twitter = ({ size = 20, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
);

const Instagram = ({ size = 20, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
);

const Linkedin = ({ size = 20, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
    </svg>
);

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
