import { useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await adminAPI.getCompanies();
        setCompanies(data.data || []);
      } catch { toast.error('Failed to load companies'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleVerify = async (userId) => {
    try {
      await adminAPI.verifyUser(userId);
      setCompanies(c => c.map(co => co.userId?._id === userId ? {...co, isApproved: true, userId: {...co.userId, isVerified: true}} : co));
      toast.success('Company verified & approved');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this company and all their drives?')) return;
    try {
      await adminAPI.deleteUser(userId);
      setCompanies(c => c.filter(co => co.userId?._id !== userId));
      toast.success('Company deleted');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="dashboard" id="manage-companies">
      <div className="container">
        <div className="dashboard-header"><h1>Manage Companies ({companies.length})</h1></div>
        <div className="profile-section" style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr>
              <th>Company</th><th>Recruiter</th><th>Industry</th><th>Location</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {companies.map(c => (
                <tr key={c._id}>
                  <td style={{fontWeight:600}}>{c.companyName}</td>
                  <td>{c.userId?.name}<br/><span style={{fontSize:'var(--font-xs)',color:'var(--text-muted)'}}>{c.userId?.email}</span></td>
                  <td>{c.industry}</td>
                  <td>{c.location || 'N/A'}</td>
                  <td>
                    <span className={`badge ${c.isApproved ? 'badge-success' : 'badge-amber'}`}>
                      {c.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'var(--space-2)'}}>
                      {!c.isApproved && <button onClick={() => handleVerify(c.userId?._id)} className="btn btn-primary btn-sm">Approve</button>}
                      <button onClick={() => handleDelete(c.userId?._id)} className="btn btn-outline btn-sm" style={{color:'var(--rose-400)'}}>Delete</button>
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

export default ManageCompanies;
