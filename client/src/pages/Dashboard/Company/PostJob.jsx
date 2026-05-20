import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const branches = ['Computer Science','Information Technology','Electronics','Electrical','Mechanical','Civil','Chemical','Biotechnology','Data Science','AI & ML','Other'];

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', role: '', jobType: 'Full-Time',
    location: '', workMode: 'On-site', openings: 1,
    'package.min': '', 'package.max': '', deadline: '',
    'eligibility.branches': [], 'eligibility.minCGPA': '',
    'eligibility.maxBacklogs': 0, 'eligibility.passingYear': new Date().getFullYear(),
    'eligibility.requiredSkills': '', bondPeriod: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({...f, [name]: value}));
  };

  const handleBranchToggle = (branch) => {
    const key = 'eligibility.branches';
    const current = form[key];
    setForm(f => ({
      ...f,
      [key]: current.includes(branch) ? current.filter(b => b !== branch) : [...current, branch]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.role || !form['package.min'] || !form['package.max'] || !form.deadline) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: form.title, description: form.description, role: form.role,
        jobType: form.jobType, location: form.location, workMode: form.workMode,
        openings: Number(form.openings), bondPeriod: Number(form.bondPeriod),
        deadline: form.deadline,
        package: { min: Number(form['package.min']), max: Number(form['package.max']) },
        eligibility: {
          branches: form['eligibility.branches'],
          minCGPA: Number(form['eligibility.minCGPA']) || 0,
          maxBacklogs: Number(form['eligibility.maxBacklogs']),
          passingYear: Number(form['eligibility.passingYear']),
          requiredSkills: form['eligibility.requiredSkills'] ? form['eligibility.requiredSkills'].split(',').map(s => s.trim()) : []
        }
      };
      await jobsAPI.create(payload);
      toast.success('Drive posted! Awaiting admin approval.');
      navigate('/company/my-jobs');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to post'); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard" id="post-job">
      <div className="container" style={{maxWidth:800}}>
        <div className="dashboard-header"><h1>Post a Campus Drive</h1><p>Create a new recruitment drive for students</p></div>

        <form onSubmit={handleSubmit}>
          <div className="profile-section" style={{marginBottom:'var(--space-6)'}}>
            <h3>Job Details</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="e.g., Software Development Engineer" />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-4)'}}>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <input name="role" value={form.role} onChange={handleChange} className="form-input" placeholder="e.g., SDE-1" />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select name="jobType" value={form.jobType} onChange={handleChange} className="form-select">
                    {['Full-Time','Internship','Part-Time','Contract'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="form-input" rows={4} placeholder="Job responsibilities, requirements..." />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'var(--space-4)'}}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input name="location" value={form.location} onChange={handleChange} className="form-input" placeholder="Bangalore" />
                </div>
                <div className="form-group">
                  <label className="form-label">Work Mode</label>
                  <select name="workMode" value={form.workMode} onChange={handleChange} className="form-select">
                    {['On-site','Remote','Hybrid'].map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Openings</label>
                  <input type="number" name="openings" value={form.openings} onChange={handleChange} className="form-input" min="1" />
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'var(--space-4)'}}>
                <div className="form-group">
                  <label className="form-label">Min Package (LPA) *</label>
                  <input type="number" name="package.min" value={form['package.min']} onChange={handleChange} className="form-input" placeholder="4" />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Package (LPA) *</label>
                  <input type="number" name="package.max" value={form['package.max']} onChange={handleChange} className="form-input" placeholder="8" />
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline *</label>
                  <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section" style={{marginBottom:'var(--space-6)'}}>
            <h3>Eligibility Criteria</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
              <div className="form-group">
                <label className="form-label">Eligible Branches</label>
                <div className="skills-list">
                  {branches.map(b => (
                    <button key={b} type="button" onClick={() => handleBranchToggle(b)}
                      className={`skill-tag ${form['eligibility.branches'].includes(b) ? '' : 'skill-tag-inactive'}`}
                      style={form['eligibility.branches'].includes(b) ? {} : {background:'var(--bg-elevated)',color:'var(--text-muted)',borderColor:'var(--border-default)'}}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'var(--space-4)'}}>
                <div className="form-group">
                  <label className="form-label">Min CGPA</label>
                  <input type="number" name="eligibility.minCGPA" value={form['eligibility.minCGPA']} onChange={handleChange} className="form-input" step="0.1" min="0" max="10" placeholder="7.0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Backlogs</label>
                  <input type="number" name="eligibility.maxBacklogs" value={form['eligibility.maxBacklogs']} onChange={handleChange} className="form-input" min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Passing Year</label>
                  <input type="number" name="eligibility.passingYear" value={form['eligibility.passingYear']} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Required Skills (comma-separated)</label>
                <input name="eligibility.requiredSkills" value={form['eligibility.requiredSkills']} onChange={handleChange} className="form-input" placeholder="React, Node.js, MongoDB" />
              </div>
              <div className="form-group">
                <label className="form-label">Bond Period (months)</label>
                <input type="number" name="bondPeriod" value={form.bondPeriod} onChange={handleChange} className="form-input" min="0" placeholder="0" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{width:'100%'}}>
            {loading ? 'Posting...' : 'Post Drive'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
