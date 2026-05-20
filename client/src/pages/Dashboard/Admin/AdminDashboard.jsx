import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../../services/api';
import { HiOutlineBriefcase, HiOutlineChartBar, HiOutlineBadgeCheck, HiOutlineUserGroup } from 'react-icons/hi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await adminAPI.getAnalytics();
        setAnalytics(data.data);
      } catch { toast.error('Failed to load analytics'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const o = analytics?.overview || {};

  return (
    <div className="dashboard" id="admin-dashboard">
      <div className="container">
        <div className="dashboard-header animate-fade-in">
          <h1>Admin Dashboard ⚙️</h1>
          <p>Manage the entire placement ecosystem</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card animate-slide-up">
            <div className="stat-card-icon mint"><HiOutlineUserGroup /></div>
            <div className="stat-card-info"><h3>{o.totalStudents || 0}</h3><p>Total Students</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-100">
            <div className="stat-card-icon violet"><HiOutlineBriefcase /></div>
            <div className="stat-card-info"><h3>{o.totalCompanies || 0}</h3><p>Companies</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-200">
            <div className="stat-card-icon amber"><HiOutlineBriefcase /></div>
            <div className="stat-card-info"><h3>{o.totalJobs || 0}</h3><p>Total Drives</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-300">
            <div className="stat-card-icon blue"><HiOutlineChartBar /></div>
            <div className="stat-card-info"><h3>{o.totalApplications || 0}</h3><p>Applications</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-400">
            <div className="stat-card-icon" style={{background:'rgba(34,197,94,0.15)',color:'#4ade80'}}><HiOutlineBadgeCheck /></div>
            <div className="stat-card-info"><h3>{o.placedStudents || 0}</h3><p>Placed Students</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-500">
            <div className="stat-card-icon rose"><HiOutlineChartBar /></div>
            <div className="stat-card-info"><h3>{analytics?.placementRate || 0}%</h3><p>Placement Rate</p></div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="stats-grid" style={{gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))'}}>
          <div className="stat-card">
            <div className="stat-card-info">
              <h3>₹{analytics?.packageStats?.max || 0} LPA</h3>
              <p>Highest Package</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <h3>₹{(analytics?.packageStats?.avg || 0).toFixed(1)} LPA</h3>
              <p>Average Package</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <h3>{o.activeJobs || 0}</h3>
              <p>Active Drives</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <h3>{o.pendingJobs || 0}</h3>
              <p>Pending Approval</p>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="dashboard-section" style={{marginTop:'var(--space-8)'}}>
          <h2 style={{marginBottom:'var(--space-4)'}}>Quick Actions</h2>
          <div style={{display:'flex',gap:'var(--space-3)',flexWrap:'wrap'}}>
            <Link to="/admin/students" className="btn btn-secondary">Manage Students</Link>
            <Link to="/admin/companies" className="btn btn-secondary">Manage Companies</Link>
            <Link to="/admin/jobs" className="btn btn-secondary">Manage Drives</Link>
            <Link to="/admin/analytics" className="btn btn-primary">View Analytics</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
