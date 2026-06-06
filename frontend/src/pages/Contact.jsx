import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle } from 'lucide-react';
import { submitSupportMessage } from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitSupportMessage(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            alert('Failed to send message. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div className="container">
                <header style={styles.header}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 style={styles.title}>Contact <span className="gradient-text">Support</span></h1>
                        <p style={styles.subtitle}>Have questions or need assistance? Our team is here to help you.</p>
                    </motion.div>
                </header>

                <div style={styles.grid}>
                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={styles.infoSection}
                    >
                        <div style={styles.infoCard}>
                            <div style={styles.iconBox}><Mail color="var(--primary)" /></div>
                            <div>
                                <h4 style={styles.infoTitle}>Email Us</h4>
                                <p style={styles.infoText}>support@crowdhelp.com</p>
                            </div>
                        </div>
                        <div style={styles.infoCard}>
                            <div style={styles.iconBox}><Phone color="var(--primary)" /></div>
                            <div>
                                <h4 style={styles.infoTitle}>Call Us</h4>
                                <p style={styles.infoText}>+91 98765 43210</p>
                            </div>
                        </div>
                        <div style={styles.infoCard}>
                            <div style={styles.iconBox}><MapPin color="var(--primary)" /></div>
                            <div>
                                <h4 style={styles.infoTitle}>Visit Us</h4>
                                <p style={styles.infoText}>123 Innovation Hub, Tech City, India</p>
                            </div>
                        </div>

                        <div style={styles.faqPreview}>
                            <HelpCircle size={40} color="rgba(255,255,255,0.1)" style={styles.faqIcon} />
                            <h4 style={styles.faqTitle}>Looking for FAQs?</h4>
                            <p style={styles.faqText}>Check our help center for quick answers to common questions.</p>
                            <button className="btn btn-secondary" style={styles.faqBtn}>Visit Help Center</button>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={styles.formSection}
                    >
                        {submitted ? (
                            <div style={styles.successCard}>
                                <div style={styles.successIcon}><MessageCircle size={40} color="var(--success)" /></div>
                                <h2 style={styles.successTitle}>Message Sent!</h2>
                                <p style={styles.successText}>Thank you for reaching out. We have received your message and will respond within 24-48 hours.</p>
                                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Send Another Message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={styles.form}>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            required 
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            required 
                                            style={styles.input}
                                        />
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Subject</label>
                                    <input 
                                        type="text" 
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={e => setFormData({...formData, subject: e.target.value})}
                                        required 
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Message</label>
                                    <textarea 
                                        placeholder="Write your message here..."
                                        value={formData.message}
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                        required 
                                        style={styles.textarea}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'} <Send size={18} />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-dark)' },
    header: { textAlign: 'center', marginBottom: '4rem' },
    title: { fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' },
    subtitle: { fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' },
    infoSection: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    infoCard: { 
        display: 'flex', 
        gap: '1.5rem', 
        padding: '1.5rem', 
        background: 'var(--glass)', 
        borderRadius: '20px', 
        border: '1px solid var(--border)',
        alignItems: 'center'
    },
    iconBox: { 
        width: '50px', 
        height: '50px', 
        borderRadius: '12px', 
        background: 'rgba(66, 133, 244, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    infoTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' },
    infoText: { color: 'var(--text-secondary)' },
    faqPreview: { 
        marginTop: '1rem', 
        padding: '2rem', 
        background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(30, 31, 32, 1) 100%)',
        borderRadius: '24px',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
    },
    faqIcon: { position: 'absolute', right: '-10px', top: '-10px' },
    faqTitle: { fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' },
    faqText: { color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' },
    faqBtn: { width: 'auto' },
    formSection: { 
        background: 'var(--bg-surface)', 
        padding: '3rem', 
        borderRadius: '32px', 
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
    },
    form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    label: { fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-secondary)' },
    input: { 
        padding: '1rem', 
        borderRadius: '12px', 
        background: 'var(--bg-dark)', 
        border: '1px solid var(--border)', 
        color: 'white',
        fontSize: '1rem'
    },
    textarea: { 
        padding: '1rem', 
        borderRadius: '12px', 
        background: 'var(--bg-dark)', 
        border: '1px solid var(--border)', 
        color: 'white',
        fontSize: '1rem',
        minHeight: '150px',
        resize: 'vertical'
    },
    submitBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem' },
    successCard: { textAlign: 'center', padding: '2rem 0' },
    successIcon: { marginBottom: '1.5rem' },
    successTitle: { fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' },
    successText: { color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }
};

export default Contact;
