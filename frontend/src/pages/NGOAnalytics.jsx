import React, { useState, useEffect } from 'react';
import { 
    TrendingUp, 
    Users, 
    IndianRupee, 
    CheckCircle,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import api from '../services/api';
import Spinner from '../components/Spinner';

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
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/ngo/analytics');
                setData(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <Spinner />;
    if (!data) return <div>No data available</div>;

    // Monthly Trend Data
    const monthlyTrendData = {
        labels: data.monthlyTrend.map(t => `${t._id.month}/${t._id.year}`),
        datasets: [{
            label: 'Donations (₹)',
            data: data.monthlyTrend.map(t => t.amount),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    // Category Distribution Data
    const categoryData = {
        labels: data.categoryDist.map(c => c._id),
        datasets: [{
            data: data.categoryDist.map(c => c.count),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
            borderWidth: 0
        }]
    };

    // Performance Data
    const performanceData = {
        labels: data.performance.map(p => p.title.substring(0, 15) + '...'),
        datasets: [
            {
                label: 'Raised',
                data: data.performance.map(p => p.currentAmount),
                backgroundColor: '#3b82f6',
                borderRadius: 6
            },
            {
                label: 'Goal',
                data: data.performance.map(p => p.goalAmount),
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                borderWidth: 1,
                borderRadius: 6
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#94a3b8', padding: 20, font: { size: 12 } }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 12,
                displayColors: true
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b' } },
            y: { grid: { color: '#334155' }, ticks: { color: '#64748b' } }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Campaign Analytics</h1>
                <div style={styles.timeFilter}>
                    <Calendar size={18}/>
                    <span>Last 6 Months</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={styles.statIcon}><IndianRupee size={20}/></div>
                        <span style={styles.statTrend}><ArrowUpRight size={14}/> 12%</span>
                    </div>
                    <h3 style={styles.statValue}>₹{data.performance.reduce((acc, p) => acc + p.currentAmount, 0).toLocaleString()}</h3>
                    <p style={styles.statLabel}>Total Raised</p>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={{ ...styles.statIcon, background: '#3b82f620', color: '#3b82f6' }}><TrendingUp size={20}/></div>
                        <span style={{ ...styles.statTrend, color: '#3b82f6' }}><ArrowUpRight size={14}/> 8%</span>
                    </div>
                    <h3 style={styles.statValue}>{data.performance.length}</h3>
                    <p style={styles.statLabel}>Total Campaigns</p>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={{ ...styles.statIcon, background: '#8b5cf620', color: '#8b5cf6' }}><CheckCircle size={20}/></div>
                        <span style={{ ...styles.statTrend, color: '#8b5cf6' }}>Goal</span>
                    </div>
                    <h3 style={styles.statValue}>{data.performance.filter(p => p.currentAmount >= p.goalAmount).length}</h3>
                    <p style={styles.statLabel}>Successful Goals</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div style={styles.chartsGrid}>
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Donation Trend</h3>
                    <div style={styles.chartWrapper}>
                        <Line data={monthlyTrendData} options={chartOptions}/>
                    </div>
                </div>
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Campaign Categories</h3>
                    <div style={{ ...styles.chartWrapper, maxWidth: '300px', margin: '0 auto' }}>
                        <Pie data={categoryData} options={{
                            ...chartOptions,
                            scales: { x: { display: false }, y: { display: false } }
                        }}/>
                    </div>
                </div>
                <div style={{ ...styles.chartCard, gridColumn: 'span 2' }}>
                    <h3 style={styles.chartTitle}>Campaign Performance (Raised vs Goal)</h3>
                    <div style={styles.chartWrapper}>
                        <Bar data={performanceData} options={chartOptions}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: 'white' },
    timeFilter: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: '#1e293b', borderRadius: '10px', color: '#94a3b8', fontSize: '0.9rem', border: '1px solid #334155' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },
    statCard: { background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155' },
    statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    statIcon: { width: '40px', height: '40px', borderRadius: '10px', background: '#22c55e20', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statTrend: { fontSize: '0.75rem', fontWeight: '600', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.2rem' },
    statValue: { fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' },
    statLabel: { fontSize: '0.85rem', color: '#64748b' },
    chartsGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' },
    chartCard: { background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155' },
    chartTitle: { fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' },
    chartWrapper: { position: 'relative', width: '100%' }
};

export default NGOAnalytics;
