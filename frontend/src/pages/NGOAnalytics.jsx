import React, { useState, useEffect } from 'react';
import { fetchNGOAnalytics } from '../services/api';
import Spinner from '../components/Spinner';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    PointElement, 
    LineElement,
    ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { TrendingUp, PieChart, BarChart3, Sparkles } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const NGOAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const res = await fetchNGOAnalytics();
                setData(res.data);
            } catch (error) {
                console.error('Error fetching NGO analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, []);

    if (loading) return <Spinner />;

    const getMonthName = (monthNum) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNum - 1];
    };

    const trendData = {
        labels: data.monthlyTrend.map(t => `${getMonthName(t._id.month)} ${t._id.year}`),
        datasets: [{
            label: 'Donations Received (₹)',
            data: data.monthlyTrend.map(t => t.amount),
            borderColor: '#8ab4f8',
            backgroundColor: 'rgba(138, 180, 248, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    const categoryData = {
        labels: data.categoryDist.map(c => c._id),
        datasets: [{
            data: data.categoryDist.map(c => c.count),
            backgroundColor: ['#8ab4f8', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'],
            borderWidth: 0
        }]
    };

    const performanceData = {
        labels: data.performance.map(p => p.title.substring(0, 15) + '...'),
        datasets: [
            {
                label: 'Raised (₹)',
                data: data.performance.map(p => p.currentAmount),
                backgroundColor: '#8ab4f8',
                borderRadius: 8
            },
            {
                label: 'Goal (₹)',
                data: data.performance.map(p => p.goalAmount),
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 8
            }
        ]
    };

    return (
        <div style={styles.container}>
            <div style={styles.pageHeader}>
                <div style={styles.badge}>
                    <Sparkles size={14} /> <span>Impact Insights</span>
                </div>
                <h1 style={styles.mainTitle}>Analytics <span style={styles.gradientText}>Dashboard</span></h1>
                <p style={styles.subtitle}>Visualize your organization's growth and campaign performance.</p>
            </div>

            <div style={styles.chartGrid}>
                <div className="card" style={{...styles.chartCard, gridColumn: '1 / -1'}}>
                    <h3 style={styles.chartTitle}><TrendingUp size={20} color="var(--primary)"/> Donation Trends</h3>
                    <div style={styles.lineWrapper}>
                        <Line data={trendData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="card" style={styles.chartCard}>
                    <h3 style={styles.chartTitle}><PieChart size={20} color="#4CAF50"/> Campaigns by Category</h3>
                    <div style={styles.pieWrapper}>
                        <Pie data={categoryData} options={{ responsive: true }} />
                    </div>
                </div>

                <div className="card" style={styles.chartCard}>
                    <h3 style={styles.chartTitle}><BarChart3 size={20} color="#FF9800"/> Top Campaign Performance</h3>
                    <div style={styles.barWrapper}>
                        <Bar data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { paddingBottom: '4rem' },
    pageHeader: { padding: '2rem 0', textAlign: 'left', marginBottom: '2rem' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '100px', background: 'var(--glass)', border: '1px solid var(--border)', fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '1.5rem' },
    mainTitle: { fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' },
    gradientText: { background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '1.1rem', color: 'var(--text-secondary)' },
    chartGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
    chartCard: { padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' },
    chartTitle: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', margin: 0 },
    lineWrapper: { height: '350px' },
    barWrapper: { height: '300px' },
    pieWrapper: { height: '300px', display: 'flex', justifyContent: 'center' }
};

export default NGOAnalytics;
