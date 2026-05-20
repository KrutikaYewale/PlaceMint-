import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', branch: '', jobType: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await jobsAPI.getAll({ ...filters, limit: 50 });
        setJobs(data.data || []);
      } catch { toast.error('Failed to load jobs'); }
      finally { setLoading(false); }
    };
    fetchJobs();
  }, [filters]);

  const handleApply = async (jobId) => {
    try {
      await applicationsAPI.apply(jobId);
      toast.success('Application submitted!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply';
      const eligibility = err.response?.data?.eligibility;
      if (eligibility) {
        toast.error(`${msg}: ${eligibility.reasons?.join(', ')}`);
      } else {
        toast.error(msg);
      }
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="dashboard" id="student-jobs">
      <div className="container">
        <div className="dashboard-header"><h1>Browse Job Drives</h1><p>Find and apply to eligible campus recruitment drives</p></div>

        <div className="filters-bar">
          <input className="form-input" placeholder="Search jobs..." value={filters.search}
            onChange={e => setFilters(f => ({...f, search: e.target.value}))} />
          <select className="form-select" value={filters.branch} onChange={e => setFilters(f => ({...f, branch: e.target.value}))}>
            <option value="">All Branches</option>
            {['Computer Science','Information Technology','Electronics','Mechanical','Civil','Other'].map(b =>
              <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="form-select" value={filters.jobType} onChange={e => setFilters(f => ({...f, jobType: e.target.value}))}>
            <option value="">All Types</option>
            {['Full-Time','Internship','Part-Time','Contract'].map(t =>
              <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No jobs found</h3><p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <p className="job-card-company">{job.companyId?.companyName}</p>
                    <h3 className="job-card-title">{job.title}</h3>
                  </div>
                  <span className="badge badge-mint">{job.jobType}</span>
                </div>
                <p style={{fontSize:'var(--font-sm)',color:'var(--text-secondary)',lineHeight:1.5}}>
                  {job.description?.substring(0, 120)}...
                </p>
                <div className="job-card-meta">
                  <span>📍 {job.location}</span>
                  <span>🏠 {job.workMode}</span>
                  <span>👥 {job.openings} openings</span>
                </div>
                <p className="job-card-package">₹{job.package?.min} - {job.package?.max} LPA</p>
                {job.eligibility?.minCGPA > 0 && (
                  <div className="job-card-meta">
                    <span>📊 Min CGPA: {job.eligibility.minCGPA}</span>
                    {job.eligibility.maxBacklogs === 0 && <span>✅ No backlogs</span>}
                  </div>
                )}
                <div className="job-card-footer">
                  <span className="job-card-deadline">
                    {new Date(job.deadline) > new Date() ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : '❌ Expired'}
                  </span>
                  <button onClick={() => handleApply(job._id)} className="btn btn-primary btn-sm"
                    disabled={new Date(job.deadline) < new Date()}>
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentJobs;
