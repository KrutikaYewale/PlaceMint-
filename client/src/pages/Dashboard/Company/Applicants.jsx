import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { applicationsAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const Applicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await applicationsAPI.getJobApplicants(jobId);
        setApplicants(data.data || []);
      } catch { toast.error('Failed to load applicants'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      await applicationsAPI.updateStatus(appId, { status });
      setApplicants(apps => apps.map(a => a._id === appId ? {...a, status} : a));
      toast.success(`Student ${status}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="dashboard" id="applicants-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Applicants ({applicants.length})</h1>
          <p>Review and manage applications for this drive</p>
        </div>

        {applicants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>No applicants yet</h3>
          </div>
        ) : (
          <div className="profile-section">
            {applicants.map(app => (
              <div key={app._id} className="applicant-row">
                <div className="applicant-info">
                  <h4>{app.userId?.name || 'Student'}</h4>
                  <p>{app.userId?.email} • {app.studentId?.branch} • CGPA: {app.studentId?.cgpa}</p>
                  <div className="skills-list" style={{marginTop:'var(--space-2)'}}>
                    {app.studentId?.skills?.slice(0, 5).map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </div>
                <span className={`badge badge-${app.status === 'selected' ? 'success' : app.status === 'rejected' ? 'rose' : app.status === 'shortlisted' ? 'amber' : 'blue'}`}>
                  {app.status}
                </span>
                <div className="applicant-actions">
                  {app.status === 'applied' && (
                    <>
                      <button onClick={() => updateStatus(app._id, 'shortlisted')} className="btn btn-secondary btn-sm">Shortlist</button>
                      <button onClick={() => updateStatus(app._id, 'rejected')} className="btn btn-outline btn-sm" style={{color:'var(--rose-400)'}}>Reject</button>
                    </>
                  )}
                  {app.status === 'shortlisted' && (
                    <>
                      <button onClick={() => updateStatus(app._id, 'interviewed')} className="btn btn-secondary btn-sm">Interview</button>
                      <button onClick={() => updateStatus(app._id, 'rejected')} className="btn btn-outline btn-sm" style={{color:'var(--rose-400)'}}>Reject</button>
                    </>
                  )}
                  {app.status === 'interviewed' && (
                    <>
                      <button onClick={() => updateStatus(app._id, 'selected')} className="btn btn-primary btn-sm">Select</button>
                      <button onClick={() => updateStatus(app._id, 'rejected')} className="btn btn-outline btn-sm" style={{color:'var(--rose-400)'}}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
