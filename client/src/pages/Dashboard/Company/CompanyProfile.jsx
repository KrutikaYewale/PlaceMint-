import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const industries = ['Information Technology','Finance','Healthcare','Manufacturing','Consulting','E-Commerce','Education','Telecom','Automotive','Other'];

const CompanyProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    companyName: profile?.companyName || '',
    industry: profile?.industry || 'Information Technology',
    website: profile?.website || '',
    description: profile?.description || '',
    location: profile?.location || '',
    employeeCount: profile?.employeeCount || '',
  });

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard" id="company-profile">
      <div className="container" style={{maxWidth:700}}>
        <div className="dashboard-header"><h1>Company Profile</h1></div>
        <form onSubmit={handleSubmit}>
          <div className="profile-section">
            <h3>Company Information</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
              <div className="form-group"><label className="form-label">Company Name</label>
                <input name="companyName" value={form.companyName} onChange={handleChange} className="form-input" /></div>
              <div className="form-group"><label className="form-label">Recruiter Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="form-input" /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-4)'}}>
                <div className="form-group"><label className="form-label">Industry</label>
                  <select name="industry" value={form.industry} onChange={handleChange} className="form-select">
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select></div>
                <div className="form-group"><label className="form-label">Employee Count</label>
                  <select name="employeeCount" value={form.employeeCount} onChange={handleChange} className="form-select">
                    <option value="">Select</option>
                    {['1-50','51-200','201-500','501-1000','1000+'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select></div>
              </div>
              <div className="form-group"><label className="form-label">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="form-input" placeholder="Bangalore, India" /></div>
              <div className="form-group"><label className="form-label">Website</label>
                <input name="website" value={form.website} onChange={handleChange} className="form-input" placeholder="https://company.com" /></div>
              <div className="form-group"><label className="form-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="form-input" rows={4} /></div>
            </div>
          </div>
          <div style={{marginTop:'var(--space-6)'}}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{width:'100%'}}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
