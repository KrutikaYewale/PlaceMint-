import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';
import './Auth.css';

const branches = [
  'Computer Science', 'Information Technology', 'Electronics', 'Electrical',
  'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Data Science', 'AI & ML', 'Other'
];
const industries = [
  'Information Technology', 'Finance', 'Healthcare', 'Manufacturing',
  'Consulting', 'E-Commerce', 'Education', 'Telecom', 'Automotive', 'Other'
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    branch: 'Computer Science', cgpa: '', passingYear: new Date().getFullYear(),
    companyName: '', industry: 'Information Technology', phone: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ ...form, role });
      toast.success('Registration successful!');
      const paths = { student: '/student/dashboard', company: '/company/dashboard', admin: '/admin/dashboard' };
      navigate(paths[role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-bg">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>
      <div className="auth-card auth-card-wide card animate-scale-in">
        <div className="auth-header">
          <Link to="/" className="auth-brand">🌿 Place<span className="brand-highlight">Mint</span></Link>
          <h1>Create your account</h1>
          <p>Join PlaceMint and start your placement journey</p>
        </div>

        {/* Role selector */}
        <div className="role-selector">
          {['student', 'company'].map(r => (
            <button key={r} className={`role-btn ${role === r ? 'role-btn-active' : ''}`} onClick={() => setRole(r)} type="button">
              {r === 'student' ? '🎓' : '🏢'} {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-icon-wrapper">
                <HiOutlineUser className="input-icon" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="form-input" placeholder="John Doe" id="register-name" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <div className="input-icon-wrapper">
                <HiOutlineMail className="input-icon" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="form-input" placeholder="you@example.com" id="register-email" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-icon-wrapper">
                <HiOutlineLockClosed className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} className="form-input" placeholder="Min 6 characters" id="register-password" />
                <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange}
                className="form-input" placeholder="+91 9876543210" />
            </div>
          </div>

          {/* Student-specific fields */}
          {role === 'student' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Branch *</label>
                <select name="branch" value={form.branch} onChange={handleChange} className="form-select">
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">CGPA</label>
                <input type="number" name="cgpa" value={form.cgpa} onChange={handleChange}
                  className="form-input" placeholder="8.5" step="0.01" min="0" max="10" />
              </div>
              <div className="form-group">
                <label className="form-label">Passing Year</label>
                <input type="number" name="passingYear" value={form.passingYear} onChange={handleChange}
                  className="form-input" min="2020" max="2030" />
              </div>
            </div>
          )}

          {/* Company-specific fields */}
          {role === 'company' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input type="text" name="companyName" value={form.companyName} onChange={handleChange}
                  className="form-input" placeholder="Acme Corp" />
              </div>
              <div className="form-group">
                <label className="form-label">Industry *</label>
                <select name="industry" value={form.industry} onChange={handleChange} className="form-select">
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="register-submit">
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
