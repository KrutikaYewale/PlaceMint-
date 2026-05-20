import { useState, useEffect } from 'react';
import { applicationsAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await applicationsAPI.getMyApplications();
        setApplications(data.data || []);
      } catch { toast.error('Failed to load applications'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await applicationsAPI.withdraw(id);
      setApplications(apps => apps.map(a => a._id === id ? {...a, status: 'withdrawn'} : a));
      toast.success('Application withdrawn');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="dashboard" id="student-applications">
      <div className="container">
        <div className="dashboard-header"><h1>My Applications</h1><p>Track all your job applications</p></div>

        <div className="filters-bar">
          {['all','applied','shortlisted','interviewed','selected','rejected','withdrawn'].map(s => (
            <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'} btn-sm`}
              onClick={() => setFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No applications found</h3>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
            {filtered.map(app => (
              <div key={app._id} className="app-card">
                <div className="app-card-info" style={{flex:1}}>
                  <h4>{app.jobId?.title || 'Job'}</h4>
                  <p>{app.jobId?.companyId?.companyName} • {app.jobId?.location} • ₹{app.jobId?.package?.min}-{app.jobId?.package?.max} LPA</p>
                  <p style={{fontSize:'var(--font-xs)',color:'var(--text-muted)',marginTop:'var(--space-1)'}}>
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    {app.feedback && ` • Feedback: ${app.feedback}`}
                  </p>
                </div>
                <span className={`badge badge-${app.status === 'selected' ? 'success' : app.status === 'rejected' ? 'rose' : app.status === 'shortlisted' ? 'amber' : app.status === 'withdrawn' ? 'gray' : 'blue'}`}>
                  {app.status}
                </span>
                {['applied','shortlisted'].includes(app.status) && (
                  <button onClick={() => handleWithdraw(app._id)} className="btn btn-outline btn-sm" style={{color:'var(--rose-400)',borderColor:'var(--rose-400)'}}>
                    Withdraw
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
