import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Student Pages
import StudentDashboard from './pages/Dashboard/Student/StudentDashboard';
import StudentJobs from './pages/Dashboard/Student/StudentJobs';
import StudentApplications from './pages/Dashboard/Student/StudentApplications';
import StudentProfile from './pages/Dashboard/Student/StudentProfile';

// Company Pages
import CompanyDashboard from './pages/Dashboard/Company/CompanyDashboard';
import PostJob from './pages/Dashboard/Company/PostJob';
import Applicants from './pages/Dashboard/Company/Applicants';
import CompanyProfile from './pages/Dashboard/Company/CompanyProfile';

// Admin Pages
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard';
import ManageStudents from './pages/Dashboard/Admin/ManageStudents';
import ManageCompanies from './pages/Dashboard/Admin/ManageCompanies';
import ManageJobs from './pages/Dashboard/Admin/ManageJobs';
import Analytics from './pages/Dashboard/Admin/Analytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#14b8a6', secondary: '#f9fafb' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#f9fafb' } },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/jobs" element={
            <ProtectedRoute roles={['student']}><StudentJobs /></ProtectedRoute>
          } />
          <Route path="/student/applications" element={
            <ProtectedRoute roles={['student']}><StudentApplications /></ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute roles={['student']}><StudentProfile /></ProtectedRoute>
          } />

          {/* Company Routes */}
          <Route path="/company/dashboard" element={
            <ProtectedRoute roles={['company']}><CompanyDashboard /></ProtectedRoute>
          } />
          <Route path="/company/post-job" element={
            <ProtectedRoute roles={['company']}><PostJob /></ProtectedRoute>
          } />
          <Route path="/company/my-jobs" element={
            <ProtectedRoute roles={['company']}><CompanyDashboard /></ProtectedRoute>
          } />
          <Route path="/company/applicants/:jobId" element={
            <ProtectedRoute roles={['company', 'admin']}><Applicants /></ProtectedRoute>
          } />
          <Route path="/company/profile" element={
            <ProtectedRoute roles={['company']}><CompanyProfile /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute roles={['admin']}><ManageStudents /></ProtectedRoute>
          } />
          <Route path="/admin/companies" element={
            <ProtectedRoute roles={['admin']}><ManageCompanies /></ProtectedRoute>
          } />
          <Route path="/admin/jobs" element={
            <ProtectedRoute roles={['admin']}><ManageJobs /></ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute roles={['admin']}><Analytics /></ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
