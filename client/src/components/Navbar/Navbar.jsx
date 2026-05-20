import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineUser, HiOutlineBriefcase, HiOutlineChartBar } from 'react-icons/hi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Dashboard link based on role
  const getDashboardPath = () => {
    if (!user) return '/';
    const paths = { student: '/student/dashboard', company: '/company/dashboard', admin: '/admin/dashboard' };
    return paths[user.role] || '/';
  };

  const navLinks = isAuthenticated ? [
    { path: getDashboardPath(), label: 'Dashboard', icon: <HiOutlineChartBar /> },
    ...(user?.role === 'student' ? [
      { path: '/student/jobs', label: 'Jobs', icon: <HiOutlineBriefcase /> },
      { path: '/student/applications', label: 'Applications', icon: <HiOutlineBriefcase /> },
      { path: '/student/profile', label: 'Profile', icon: <HiOutlineUser /> },
    ] : []),
    ...(user?.role === 'company' ? [
      { path: '/company/post-job', label: 'Post Job', icon: <HiOutlineBriefcase /> },
      { path: '/company/my-jobs', label: 'My Jobs', icon: <HiOutlineBriefcase /> },
      { path: '/company/profile', label: 'Profile', icon: <HiOutlineUser /> },
    ] : []),
    ...(user?.role === 'admin' ? [
      { path: '/admin/students', label: 'Students', icon: <HiOutlineUser /> },
      { path: '/admin/companies', label: 'Companies', icon: <HiOutlineBriefcase /> },
      { path: '/admin/jobs', label: 'Job Drives', icon: <HiOutlineBriefcase /> },
      { path: '/admin/analytics', label: 'Analytics', icon: <HiOutlineChartBar /> },
    ] : []),
  ] : [];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} id="main-navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌿</span>
          <span className="brand-text">Place<span className="brand-highlight">Mint</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links hide-mobile">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-user">
              <div className="user-info hide-mobile">
                <span className="user-name">{user?.name}</span>
                <span className={`badge badge-${user?.role === 'admin' ? 'violet' : user?.role === 'company' ? 'amber' : 'mint'}`}>
                  {user?.role}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" id="logout-btn" title="Logout">
                <HiOutlineLogout size={18} />
                <span className="hide-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-link ${location.pathname === link.path ? 'mobile-link-active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          {isAuthenticated && (
            <button onClick={handleLogout} className="mobile-link mobile-logout">
              <HiOutlineLogout /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
