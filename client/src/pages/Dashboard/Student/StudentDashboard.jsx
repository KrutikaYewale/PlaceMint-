import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../../../services/api';
import { HiOutlineBriefcase, HiOutlineClipboardCheck, HiOutlineBadgeCheck, HiOutlineClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          applicationsAPI.getMyApplications(),
          jobsAPI.getAll({ limit: 4, sort: '-createdAt' })
        ]);
        setApplications(appsRes.data.data || []);
        setRecentJobs(jobsRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /><p style={{color:'var(--text-secondary)'}}>Loading dashboard...</p></div>;

  const totalApps = applications.length;
  const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
  const selected = applications.filter(a => a.status === 'selected').length;
  const pending = applications.filter(a => a.status === 'applied').length;

  return (
    <div className="dashboard" id="student-dashboard">
      <div className="container">
        <div className="dashboard-header animate-fade-in">
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>{profile?.branch} • CGPA: {profile?.cgpa || 'N/A'} • {profile?.passingYear}</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card animate-slide-up">
            <div className="stat-card-icon mint"><HiOutlineClipboardCheck /></div>
            <div className="stat-card-info"><h3>{totalApps}</h3><p>Total Applications</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-100">
            <div className="stat-card-icon amber"><HiOutlineClock /></div>
            <div className="stat-card-info"><h3>{pending}</h3><p>Pending</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-200">
            <div className="stat-card-icon violet"><HiOutlineBriefcase /></div>
            <div className="stat-card-info"><h3>{shortlisted}</h3><p>Shortlisted</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-300">
            <div className="stat-card-icon" style={{background:'rgba(34,197,94,0.15)',color:'#4ade80'}}><HiOutlineBadgeCheck /></div>
            <div className="stat-card-info"><h3>{selected}</h3><p>Selected</p></div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="dashboard-section">
          <div className="section-bar">
            <h2>Recent Applications</h2>
            <Link to="/student/applications" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No applications yet</h3>
              <p>Browse available jobs and start applying!</p>
              <Link to="/student/jobs" className="btn btn-primary btn-sm" style={{marginTop:'var(--space-4)'}}>Browse Jobs</Link>
            </div>
          ) : (
            <div className="jobs-grid">
              {applications.slice(0, 4).map(app => (
                <div key={app._id} className="job-card">
                  <div className="job-card-header">
                    <div>
                      <p className="job-card-company">{app.jobId?.companyId?.companyName || 'Company'}</p>
                      <h3 className="job-card-title">{app.jobId?.title || 'Job'}</h3>
                    </div>
                    <span className={`badge badge-${app.status === 'selected' ? 'success' : app.status === 'rejected' ? 'rose' : app.status === 'shortlisted' ? 'amber' : 'blue'}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="job-card-meta">
                    <span>📍 {app.jobId?.location || 'N/A'}</span>
                    <span>💼 {app.jobId?.jobType || 'Full-Time'}</span>
                  </div>
                  <div className="job-card-footer">
                    <span className="job-card-package">
                      ₹{app.jobId?.package?.min || 0} - {app.jobId?.package?.max || 0} LPA
                    </span>
                    <span className="job-card-deadline">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Job Drives */}
        <div className="dashboard-section">
          <div className="section-bar">
            <h2>Latest Job Drives</h2>
            <Link to="/student/jobs" className="btn btn-ghost btn-sm">Browse All →</Link>
          </div>
          {recentJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏢</div>
              <h3>No drives available</h3>
              <p>Check back later for new placement drives</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {recentJobs.map(job => (
                <div key={job._id} className="job-card">
                  <p className="job-card-company">{job.companyId?.companyName || 'Company'}</p>
                  <h3 className="job-card-title">{job.title}</h3>
                  <div className="job-card-meta">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.jobType}</span>
                    <span>🏠 {job.workMode}</span>
                  </div>
                  <p className="job-card-package">₹{job.package?.min} - {job.package?.max} LPA</p>
                  <div className="job-card-footer">
                    <span className="job-card-deadline">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    <Link to={`/student/jobs/${job._id}`} className="btn btn-primary btn-sm">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
