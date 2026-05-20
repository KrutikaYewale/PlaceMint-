import { useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const COLORS = ['#14b8a6', '#8b5cf6', '#f59e0b', '#3b82f6', '#f43f5e', '#4ade80', '#60a5fa', '#fbbf24'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminAPI.getAnalytics();
        setData(res.data.data);
      } catch { toast.error('Failed to load analytics'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><h3>No data available</h3></div>;

  // Prepare chart data
  const branchData = (data.branchWise || []).map(b => ({
    name: b._id?.substring(0, 12) || 'Other',
    total: b.total,
    placed: b.placed,
    rate: b.total > 0 ? ((b.placed / b.total) * 100).toFixed(0) : 0
  }));

  const companyData = (data.companyWise || []).map(c => ({
    name: c._id?.substring(0, 15) || 'N/A',
    hires: c.count
  }));

  const statusData = (data.statusDistribution || []).map(s => ({
    name: s._id?.charAt(0).toUpperCase() + s._id?.slice(1),
    value: s.count
  }));

  const monthlyData = (data.monthlyTrend || []).map(m => ({
    name: MONTHS[m._id - 1] || 'Unknown',
    applications: m.count
  }));

  const customTooltip = {
    contentStyle: {
      background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px', fontSize: '13px', color: '#f9fafb'
    }
  };

  return (
    <div className="dashboard" id="analytics-page">
      <div className="container">
        <div className="dashboard-header animate-fade-in">
          <h1>Placement Analytics 📊</h1>
          <p>Comprehensive placement insights and trends</p>
        </div>

        {/* Summary Stats */}
        <div className="stats-grid" style={{marginBottom:'var(--space-8)'}}>
          <div className="stat-card">
            <div className="stat-card-info">
              <h3 style={{color:'var(--mint-400)'}}>{data.placementRate}%</h3>
              <p>Overall Placement Rate</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <h3 style={{color:'var(--amber-400)'}}>₹{(data.packageStats?.max || 0)} LPA</h3>
              <p>Highest Package</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <h3 style={{color:'var(--violet-400)'}}>₹{(data.packageStats?.avg || 0).toFixed(1)} LPA</h3>
              <p>Average Package</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <h3 style={{color:'var(--blue-400)'}}>₹{(data.packageStats?.min || 0)} LPA</h3>
              <p>Minimum Package</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          {/* Branch-wise Placement */}
          <div className="chart-container animate-slide-up">
            <h3>Branch-wise Placement</h3>
            {branchData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{fill:'#9ca3af',fontSize:11}} />
                  <YAxis tick={{fill:'#9ca3af',fontSize:11}} />
                  <Tooltip {...customTooltip} />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Total" radius={[4,4,0,0]} />
                  <Bar dataKey="placed" fill="#14b8a6" name="Placed" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{color:'var(--text-muted)',textAlign:'center',padding:'var(--space-8)'}}>No data yet</p>}
          </div>

          {/* Application Status Distribution */}
          <div className="chart-container animate-slide-up delay-100">
            <h3>Application Status Distribution</h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}
                    dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...customTooltip} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p style={{color:'var(--text-muted)',textAlign:'center',padding:'var(--space-8)'}}>No data yet</p>}
          </div>

          {/* Company-wise Hiring */}
          <div className="chart-container animate-slide-up delay-200">
            <h3>Top Hiring Companies</h3>
            {companyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{fill:'#9ca3af',fontSize:11}} />
                  <YAxis type="category" dataKey="name" width={120} tick={{fill:'#9ca3af',fontSize:11}} />
                  <Tooltip {...customTooltip} />
                  <Bar dataKey="hires" fill="#8b5cf6" name="Hires" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{color:'var(--text-muted)',textAlign:'center',padding:'var(--space-8)'}}>No data yet</p>}
          </div>

          {/* Monthly Application Trend */}
          <div className="chart-container animate-slide-up delay-300">
            <h3>Monthly Application Trend</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{fill:'#9ca3af',fontSize:11}} />
                  <YAxis tick={{fill:'#9ca3af',fontSize:11}} />
                  <Tooltip {...customTooltip} />
                  <Line type="monotone" dataKey="applications" stroke="#14b8a6" strokeWidth={2} dot={{fill:'#14b8a6',r:4}} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p style={{color:'var(--text-muted)',textAlign:'center',padding:'var(--space-8)'}}>No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
