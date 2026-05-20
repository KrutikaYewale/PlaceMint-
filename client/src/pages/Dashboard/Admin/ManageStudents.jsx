import { useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await adminAPI.getStudents();
        setStudents(data.data || []);
      } catch { toast.error('Failed to load students'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleVerify = async (userId) => {
    try {
      await adminAPI.verifyUser(userId);
      setStudents(s => s.map(st => st.userId?._id === userId ? {...st, userId: {...st.userId, isVerified: true}} : st));
      toast.success('Student verified');
    } catch { toast.error('Failed'); }
  };

  const handleToggle = async (userId) => {
    try {
      await adminAPI.toggleActive(userId);
      setStudents(s => s.map(st => st.userId?._id === userId ? {...st, userId: {...st.userId, isActive: !st.userId.isActive}} : st));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await adminAPI.deleteUser(userId);
      setStudents(s => s.filter(st => st.userId?._id !== userId));
      toast.success('Student deleted');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="dashboard" id="manage-students">
      <div className="container">
        <div className="dashboard-header"><h1>Manage Students ({students.length})</h1></div>
        <div className="profile-section" style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr>
              <th>Name</th><th>Email</th><th>Branch</th><th>CGPA</th><th>Year</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td style={{fontWeight:600}}>{s.userId?.name}</td>
                  <td>{s.userId?.email}</td>
                  <td>{s.branch}</td>
                  <td>{s.cgpa}</td>
                  <td>{s.passingYear}</td>
                  <td>
                    <span className={`badge ${s.userId?.isVerified ? 'badge-success' : 'badge-amber'}`}>
                      {s.userId?.isVerified ? 'Verified' : 'Pending'}
                    </span>
                    {s.isPlaced && <span className="badge badge-mint" style={{marginLeft:4}}>Placed</span>}
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'var(--space-2)'}}>
                      {!s.userId?.isVerified && <button onClick={() => handleVerify(s.userId?._id)} className="btn btn-primary btn-sm">Verify</button>}
                      <button onClick={() => handleToggle(s.userId?._id)} className="btn btn-outline btn-sm">
                        {s.userId?.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(s.userId?._id)} className="btn btn-outline btn-sm" style={{color:'var(--rose-400)'}}>Delete</button>
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

export default ManageStudents;
