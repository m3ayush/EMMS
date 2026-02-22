import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import MouSubmissionPage from './pages/faculty/MouSubmissionPage';
import MouEditRenewalPage from './pages/faculty/MouEditRenewalPage';
import OrgSearchPage from './pages/faculty/OrgSearchPage';
import SeniorDashboard from './pages/senior/SeniorDashboard';
import OrgMouReviewPage from './pages/senior/OrgMouReviewPage';
import FacultyDetailPage from './pages/senior/FacultyDetailPage';

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-bg">
      <Navbar />
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to={currentUser.role === 'senior' ? '/senior/dashboard' : '/faculty/dashboard'} /> : <LoginPage />} />
        <Route path="/register" element={currentUser ? <Navigate to={currentUser.role === 'senior' ? '/senior/dashboard' : '/faculty/dashboard'} /> : <RegisterPage />} />

        {/* Faculty Routes */}
        <Route path="/faculty/dashboard" element={<ProtectedRoute><RoleRoute role="faculty"><FacultyDashboard /></RoleRoute></ProtectedRoute>} />
        <Route path="/faculty/submit-mou" element={<ProtectedRoute><RoleRoute role="faculty"><MouSubmissionPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/faculty/mous" element={<ProtectedRoute><RoleRoute role="faculty"><MouEditRenewalPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/faculty/organisations" element={<ProtectedRoute><RoleRoute role="faculty"><OrgSearchPage /></RoleRoute></ProtectedRoute>} />

        {/* Senior Routes */}
        <Route path="/senior/dashboard" element={<ProtectedRoute><RoleRoute role="senior"><SeniorDashboard /></RoleRoute></ProtectedRoute>} />
        <Route path="/senior/organisations" element={<ProtectedRoute><RoleRoute role="senior"><OrgMouReviewPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/senior/faculty/:id" element={<ProtectedRoute><RoleRoute role="senior"><FacultyDetailPage /></RoleRoute></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: {
            border: '2px solid black',
            boxShadow: '3px 3px 0px 0px black',
            borderRadius: '0.5rem',
            fontWeight: '600',
            background: '#FFFFFF',
            color: '#000000',
          },
          success: { style: { background: '#7BC67E' } },
          error: { style: { background: '#FF6B9D' } },
        }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
