import React, { useState, useEffect } from 'react';
import { fetchAdvancedAnalytics, exportDonations } from '../services/api';
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
import { Bar, Line, Pie } from 'react-chartjs-2';
import { FileDown, TrendingUp, Users, Target, IndianRupee } from 'lucide-react';

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

    if (loading) return <Spinner />;

    const trendData = {
        labels: data.trend.map(t => `${t._id.month}/${t._id.year}`),
        datasets: [{
            label: 'Monthly Donations (₹)',
            data: data.trend.map(t => t.amount),
            borderColor: '#646cff',
            backgroundColor: 'rgba(100, 108, 255, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    const campaignData = {
        labels: data.campaignStats.map(c => c.title),
        datasets: [{
            label: 'Amount Raised',
            data: data.campaignStats.map(c => c.currentAmount),
            backgroundColor: [
                '#646cff', '#4CAF50', '#FF9800', '#F44336', '#9C27B0'
            ]
        }]
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Platform Analytics</h1>
                <button onClick={exportDonations} style={styles.exportBtn}>
                    <FileDown size={20} /> Export Donations (CSV)
                </button>
            </div>

            <div style={styles.statsGrid}>
                <div className="card" style={styles.statCard}>
                    <Users color="#646cff" />
                    <h3>{data.totalDonors}</h3>
                    <p>Total Donors</p>
                </div>
                <div className="card" style={styles.statCard}>
                    <Target color="#4CAF50" />
                    <h3>{data.totalCampaigns}</h3>
                    <p>Active Campaigns</p>
                </div>
                <div className="card" style={styles.statCard}>
                    <TrendingUp color="#FF9800" />
                    <h3>{data.monthlyCount}</h3>
                    <p>Donations This Month</p>
                </div>
                <div className="card" style={styles.statCard}>
                    <IndianRupee color="#F44336" />
                    <h3>₹{data.monthlyAmount.toLocaleString()}</h3>
                    <p>Monthly Total</p>
                </div>
            </div>

            <div style={styles.chartsGrid}>
                <div className="card" style={styles.chartCard}>
                    <h2>Donation Trend</h2>
                    <Line data={trendData} options={{ responsive: true }} />
                </div>
                <div className="card" style={styles.chartCard}>
                    <h2>Top Campaigns</h2>
                    <Pie data={campaignData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 2rem'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
    },
    exportBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: 'auto',
        backgroundColor: '#4CAF50'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
    },
    statCard: {
        textAlign: 'center',
        padding: '2rem'
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem'
    },
    chartCard: {
        padding: '2rem'
    }
};

export default AdminAnalytics;
