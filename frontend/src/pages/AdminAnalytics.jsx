import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAdvancedAnalytics, exportDonations } from '../services/api';
import Skeleton from '../components/Skeleton';
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
import { Bar, Line, Pie } from 'react-chartjs-2';
import { 
    FileDown, 
    TrendingUp, 
    Users, 
    Target, 
    IndianRupee, 
    BarChart3, 
    PieChart, 
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles
} from 'lucide-react';

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

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const res = await fetchAdvancedAnalytics();
                setData(res.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, []);

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportDonations();
        } catch (error) {
            alert('Export failed. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    if (loading) return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Skeleton width="300px" height="40px" />
                <Skeleton width="200px" height="40px" />
            </div>
            <div style={styles.statsGrid}>
                {[1,2,3,4].map(i => <Skeleton key={i} height="150px" />)}
            </div>
            <div style={styles.chartsGrid}>
                <Skeleton height="400px" />
                <Skeleton height="400px" />
            </div>
        </div>
    );

    const getMonthName = (monthNum) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNum - 1];
    };

    const trendData = {
        labels: data.trend.map(t => `${getMonthName(t._id.month)} ${t._id.year}`),
        datasets: [{
            label: 'Monthly Donations (₹)',
            data: data.trend.map(t => t.amount),
            borderColor: '#8ab4f8',
            backgroundColor: 'rgba(138, 180, 248, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#8ab4f8',
            pointBorderColor: '#fff',
            pointHoverRadius: 6
        }]
    };

    const campaignData = {
        labels: data.campaignStats.map(c => c.title),
        datasets: [{
            label: 'Amount Raised',
            data: data.campaignStats.map(c => c.currentAmount),
            backgroundColor: [
                'rgba(138, 180, 248, 0.8)', 
                'rgba(52, 168, 83, 0.8)', 
                'rgba(251, 188, 4, 0.8)', 
                'rgba(234, 67, 53, 0.8)', 
                'rgba(156, 39, 176, 0.8)'
            ],
            borderWidth: 0
        }]
    };

    const kpis = [
        { label: 'Total Donors', value: data.totalDonors, icon: <Users size={24}/>, color: '#8ab4f8' },
        { label: 'Active Campaigns', value: data.totalCampaigns, icon: <Target size={24}/>, color: '#34a853' },
        { label: 'Monthly Growth', value: `${data.monthlyGrowth > 0 ? '+' : ''}${data.monthlyGrowth}%`, icon: <TrendingUp size={24}/>, color: '#fbbc04' },
        { label: 'Monthly Revenue', value: `₹${(data.monthlyAmount || 0).toLocaleString()}`, icon: <IndianRupee size={24}/>, color: '#ea4335' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.container}
        >
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Platform <span className="gradient-text">Insights</span></h1>
                    <p style={styles.subtitle}>Real-time analytics and performance metrics.</p>
                </div>
                <button onClick={handleExport} disabled={exporting} className="btn btn-secondary">
                    <FileDown size={20} /> {exporting ? 'Exporting...' : 'Download Report'}
                </button>
            </div>

            <div style={styles.statsGrid}>
                {kpis.map((kpi, i) => (
                    <div key={i} className="card" style={styles.statCard}>
                        <div style={{...styles.iconBox, color: kpi.color, background: `${kpi.color}15`}}>
                            {kpi.icon}
                        </div>
                        <div style={styles.statInfo}>
                            <h3 style={styles.statValue}>{kpi.value}</h3>
                            <p style={styles.statLabel}>{kpi.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.chartsGrid}>
                <div className="card" style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <BarChart3 size={20} color="var(--primary)" />
                        <h2 style={styles.chartTitle}>Revenue Trend</h2>
                    </div>
                    <Line data={trendData} options={chartOptions} />
                </div>
                <div className="card" style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <PieChart size={20} color="var(--success)" />
                        <h2 style={styles.chartTitle}>Top Performers</h2>
                    </div>
                    <Pie data={campaignData} options={chartOptions} />
                </div>
            </div>
        </motion.div>
    );
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.5)' }
        },
        x: {
            grid: { display: false },
            ticks: { color: 'rgba(255, 255, 255, 0.5)' }
        }
    }
};

const styles = {
    container: { maxWidth: '1400px', margin: '2rem auto', padding: '0 2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' },
    title: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' },
    subtitle: { color: 'var(--text-secondary)', fontSize: '1.1rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' },
    statCard: { display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' },
    iconBox: { width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statInfo: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    statValue: { fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 },
    statLabel: { fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)', margin: 0 },
    chartsGrid: { display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem', minHeight: '450px' },
    chartCard: { padding: '2rem', display: 'flex', flexDirection: 'column' },
    chartHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
    chartTitle: { fontSize: '1.25rem', fontWeight: '800', margin: 0 }
};

export default AdminAnalytics;
