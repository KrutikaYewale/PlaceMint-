import { useState, useEffect } from 'react';
import { jobsAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await jobsAPI.getAll({ limit: 100 });
        setJobs(data.data || []);
      } catch { toast.error('Failed'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleApprove = async (id) => {
    try {
      await jobsAPI.approve(id);
      setJobs(j => j.map(job => job._id === id ? {...job, status: 'active', isApproved: true} : job));
      toast.success('Job approved');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this drive?')) return;
    try {
      await jobsAPI.delete(id);
      setJobs(j => j.filter(job => job._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="dashboard" id="manage-jobs">
      <div className="container">
        <div className="dashboard-header"><h1>Manage Job Drives ({jobs.length})</h1></div>
        <div className="profile-section" style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr>
              <th>Title</th><th>Company</th><th>Type</th><th>Package</th><th>Deadline</th><th>Status</th><th>Apps</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j._id}>
                  <td style={{fontWeight:600}}>{j.title}</td>
                  <td>{j.companyId?.companyName}</td>
                  <td>{j.jobType}</td>
                  <td>₹{j.package?.min}-{j.package?.max} LPA</td>
                  <td>{new Date(j.deadline).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${j.status === 'active' ? 'success' : j.status === 'pending' ? 'amber' : 'gray'}`}>{j.status}</span></td>
                  <td>{j.applicantCount}</td>
                  <td>
                    <div style={{display:'flex',gap:'var(--space-2)'}}>
                      {j.status === 'pending' && <button onClick={() => handleApprove(j._id)} className="btn btn-primary btn-sm">Approve</button>}
                      <button onClick={() => handleDelete(j._id)} className="btn btn-outline btn-sm" style={{color:'var(--rose-400)'}}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
