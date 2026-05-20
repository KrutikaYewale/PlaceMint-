import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const branches = ['Computer Science','Information Technology','Electronics','Electrical','Mechanical','Civil','Chemical','Biotechnology','Data Science','AI & ML','Other'];

const StudentProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    branch: profile?.branch || 'Computer Science',
    cgpa: profile?.cgpa || '',
    passingYear: profile?.passingYear || new Date().getFullYear(),
    backlogs: profile?.backlogs || 0,
    phone: profile?.phone || '',
    linkedIn: profile?.linkedIn || '',
    github: profile?.github || '',
    about: profile?.about || '',
    tenthPercentage: profile?.tenthPercentage || '',
    twelfthPercentage: profile?.twelfthPercentage || '',
    skills: profile?.skills || [],
  });

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({...form, skills: [...form.skills, skillInput.trim()]});
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm({...form, skills: form.skills.filter(s => s !== skill)});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard" id="student-profile">
      <div className="container">
        <div className="dashboard-header"><h1>My Profile</h1><p>Manage your profile information</p></div>

        <form onSubmit={handleSubmit}>
          <div className="profile-form">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input value={user?.email} disabled className="form-input" style={{opacity:0.6}} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label className="form-label">About</label>
                  <textarea name="about" value={form.about} onChange={handleChange} className="form-input" rows={3} placeholder="Tell us about yourself..." />
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Academic Details</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
                <div className="form-group">
                  <label className="form-label">Branch</label>
                  <select name="branch" value={form.branch} onChange={handleChange} className="form-select">
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-3)'}}>
                  <div className="form-group">
                    <label className="form-label">CGPA</label>
                    <input type="number" name="cgpa" value={form.cgpa} onChange={handleChange} className="form-input" step="0.01" min="0" max="10" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Passing Year</label>
                    <input type="number" name="passingYear" value={form.passingYear} onChange={handleChange} className="form-input" />
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'var(--space-3)'}}>
                  <div className="form-group">
                    <label className="form-label">Backlogs</label>
                    <input type="number" name="backlogs" value={form.backlogs} onChange={handleChange} className="form-input" min="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">10th %</label>
                    <input type="number" name="tenthPercentage" value={form.tenthPercentage} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">12th %</label>
                    <input type="number" name="twelfthPercentage" value={form.twelfthPercentage} onChange={handleChange} className="form-input" />
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Skills & Links</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
                <div className="form-group">
                  <label className="form-label">Skills</label>
                  <div style={{display:'flex',gap:'var(--space-2)'}}>
                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="form-input" placeholder="Add a skill..." style={{flex:1}} />
                    <button type="button" onClick={addSkill} className="btn btn-secondary btn-sm">Add</button>
                  </div>
                  <div className="skills-list" style={{marginTop:'var(--space-2)'}}>
                    {form.skills.map(s => (
                      <span key={s} className="skill-tag">{s} <button type="button" onClick={() => removeSkill(s)}>×</button></span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn</label>
                  <input name="linkedIn" value={form.linkedIn} onChange={handleChange} className="form-input" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub</label>
                  <input name="github" value={form.github} onChange={handleChange} className="form-input" placeholder="https://github.com/..." />
                </div>
              </div>
            </div>
          </div>

          <div style={{marginTop:'var(--space-6)',textAlign:'right'}}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
