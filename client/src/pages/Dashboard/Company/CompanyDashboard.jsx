import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { jobsAPI } from '../../../services/api';
import { HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineBadgeCheck, HiOutlineClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const CompanyDashboard = () => {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await jobsAPI.getMyJobs();
        setJobs(data.data || []);
      } catch { toast.error('Failed to load jobs'); }
      finally { setLoading(false); }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);
  const totalSelected = jobs.reduce((sum, j) => sum + (j.selectedCount || 0), 0);

  return (
    <div className="dashboard" id="company-dashboard">
      <div className="container">
        <div className="dashboard-header animate-fade-in">
          <h1>Welcome, {profile?.companyName || user?.name} 🏢</h1>
          <p>{profile?.industry} • {profile?.isApproved ? '✅ Verified' : '⏳ Pending Verification'}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card animate-slide-up">
            <div className="stat-card-icon mint"><HiOutlineBriefcase /></div>
            <div className="stat-card-info"><h3>{totalJobs}</h3><p>Total Drives</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-100">
            <div className="stat-card-icon amber"><HiOutlineClock /></div>
            <div className="stat-card-info"><h3>{activeJobs}</h3><p>Active Drives</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-200">
            <div className="stat-card-icon violet"><HiOutlineUserGroup /></div>
            <div className="stat-card-info"><h3>{totalApplicants}</h3><p>Total Applicants</p></div>
          </div>
          <div className="stat-card animate-slide-up delay-300">
            <div className="stat-card-icon" style={{background:'rgba(34,197,94,0.15)',color:'#4ade80'}}><HiOutlineBadgeCheck /></div>
            <div className="stat-card-info"><h3>{totalSelected}</h3><p>Selected</p></div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-bar">
            <h2>Your Job Drives</h2>
            <Link to="/company/post-job" className="btn btn-primary btn-sm">+ Post New Drive</Link>
          </div>
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No drives posted</h3>
              <p>Create your first campus recruitment drive</p>
              <Link to="/company/post-job" className="btn btn-primary btn-sm" style={{marginTop:'var(--space-4)'}}>Post a Drive</Link>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job._id} className="job-card">
                  <div className="job-card-header">
                    <h3 className="job-card-title">{job.title}</h3>
                    <span className={`badge badge-${job.status === 'active' ? 'success' : job.status === 'pending' ? 'amber' : 'gray'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="job-card-meta">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.jobType}</span>
                    <span>👥 {job.applicantCount} applicants</span>
                  </div>
                  <p className="job-card-package">₹{job.package?.min} - {job.package?.max} LPA</p>
                  <div className="job-card-footer">
                    <span className="job-card-deadline">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    <Link to={`/company/applicants/${job._id}`} className="btn btn-secondary btn-sm">
                      View Applicants ({job.applicantCount})
                    </Link>
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

export default CompanyDashboard;
