import { Link } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineArrowRight, HiOutlineStar } from 'react-icons/hi';
import './Landing.css';

const features = [
  { icon: <HiOutlineStar />, title: 'Smart Eligibility', desc: 'Auto-checks CGPA, branch, skills & backlogs with specific feedback', color: 'mint' },
  { icon: <HiOutlineChartBar />, title: 'Analytics Dashboard', desc: 'Branch-wise trends, package stats, and company-wise hiring data', color: 'violet' },
  { icon: <HiOutlineBriefcase />, title: 'Drive Management', desc: 'Post, approve, and manage campus drives with full workflow control', color: 'amber' },
  { icon: <HiOutlineShieldCheck />, title: 'Secure & Role-Based', desc: 'JWT auth, encrypted passwords, and role-based access control', color: 'blue' },
  { icon: <HiOutlineUserGroup />, title: 'Multi-Role Platform', desc: 'Dedicated dashboards for students, companies, and admins', color: 'rose' },
  { icon: <HiOutlineAcademicCap />, title: 'Career Ready', desc: 'Track skills, certifications, and placement readiness scores', color: 'mint' },
];

const stats = [
  { value: '500+', label: 'Students Placed' },
  { value: '50+', label: 'Partner Companies' },
  { value: '12 LPA', label: 'Highest Package' },
  { value: '95%', label: 'Placement Rate' },
];

const Landing = () => {
  return (
    <div className="landing" id="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>
        
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">
            <HiOutlineStar />
            <span>Intelligent Campus Recruitment Ecosystem</span>
          </div>
          
          <h1 className="hero-title animate-slide-up">
            Campus Placements,
            <br />
            <span className="hero-gradient-text">Reimagined with AI</span>
          </h1>
          
          <p className="hero-subtitle animate-slide-up delay-200">
            PlaceMint - Minting Career, streamlines campus recruitment with smart eligibility matching,
            real-time analytics, and seamless drive management — all in one powerful platform.
          </p>

          <div className="hero-actions animate-slide-up delay-300">
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta">
              Get Started Free <HiOutlineArrowRight />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats animate-slide-up delay-400">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header animate-fade-in">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Everything you need for <span className="text-mint">smarter placements</span></h2>
            <p className="section-desc">A comprehensive platform built for modern campus recruitment workflows</p>
          </div>

          <div className="features-grid">
            {features.map((feat, i) => (
              <div key={i} className={`feature-card card animate-slide-up delay-${(i % 3 + 1) * 100}`}>
                <div className={`feature-icon feature-icon-${feat.color}`}>
                  {feat.icon}
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <span className="section-tag">How it Works</span>
            <h2 className="section-title">Three roles, <span className="text-mint">one platform</span></h2>
          </div>

          <div className="roles-grid">
            <div className="role-card card animate-slide-up">
              <div className="role-emoji">🎓</div>
              <h3>Students</h3>
              <ul className="role-features">
                <li>Create professional profiles</li>
                <li>Browse eligible job drives</li>
                <li>Apply with one click</li>
                <li>Track application status</li>
              </ul>
              <Link to="/register" className="btn btn-outline btn-sm">Join as Student</Link>
            </div>

            <div className="role-card card role-card-featured animate-slide-up delay-200">
              <div className="role-emoji">🏢</div>
              <h3>Companies</h3>
              <ul className="role-features">
                <li>Post campus drives</li>
                <li>Set eligibility criteria</li>
                <li>Review applicants</li>
                <li>Shortlist & select</li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-sm">Join as Recruiter</Link>
            </div>

            <div className="role-card card animate-slide-up delay-300">
              <div className="role-emoji">⚙️</div>
              <h3>Admins</h3>
              <ul className="role-features">
                <li>Manage all users</li>
                <li>Approve drives</li>
                <li>View analytics</li>
                <li>Generate reports</li>
              </ul>
              <Link to="/login" className="btn btn-outline btn-sm">Admin Login</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card card animate-fade-in">
            <h2>Ready to transform your campus placements?</h2>
            <p>Join PlaceMint today and experience intelligent recruitment automation.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Now — It's Free <HiOutlineArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <span className="brand-icon">🌿</span>
            <span className="brand-text">Place<span className="brand-highlight">Mint</span></span>
          </div>
          <p className="footer-text">© 2024 PlaceMint. Built with ❤️ for smarter campus recruitment.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
