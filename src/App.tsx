import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import LandingPage from './pages/LandingPage';
import PKBMListPublic from './pages/PKBMListPublic';
import ClassAccess from './pages/ClassAccess';
import SubjectCategories from './pages/SubjectCategories';
import Subjects from './pages/Subjects';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import PKBMManagement from './pages/PKBMManagement';
import AnnouncementManagement from './pages/AnnouncementManagement';
import LandingSettingsPage from './pages/LandingSettings';
import PKBMLayout from './components/PKBMLayout';
import PKBMDashboard from './pages/pkbm/PKBMDashboard';
import StudentManagement from './pages/pkbm/StudentManagement';
import GradeInput from './pages/pkbm/GradeInput';
import Reports from './pages/pkbm/Reports';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import { useEffect } from 'react';
import { landingService } from './services/landingService';
import { API_BASE_URL } from './services/api';

function App() {
  // Update Favicon and Title based on settings
  useEffect(() => {
    const updateBranding = async () => {
      try {
        const settings = await landingService.getSettings();
        if (settings) {
          // Prefer settings title, but fallback to specific request if settings empty or just use the specific one if user insists
          // User requested: "Sekolah Online Orang Dewasa | SOOD"
          document.title = settings.hero_title ? `${settings.hero_title} | SOOD` : 'Sekolah Online Orang Dewasa | SOOD';

          const iconUrl = settings.favicon_url || settings.logo_url;
          if (iconUrl) {
            const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (link) {
              link.href = iconUrl.startsWith('http')
                ? iconUrl
                : `${API_BASE_URL}${iconUrl}`;
            }
          }
        }
      } catch (e) {
        console.error("Failed to load branding", e);
      }
    };
    updateBranding();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pkbm" element={<PKBMListPublic />} />
          <Route path="/akses-kelas" element={<ClassAccess />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Super Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Super Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="pkbm" element={<PKBMManagement />} />
            <Route path="categories" element={<SubjectCategories />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="announcements" element={<AnnouncementManagement />} />
            <Route path="landing" element={<LandingSettingsPage />} />
          </Route>

          {/* Admin PKBM Routes */}
          <Route path="/admin-pkbm" element={
            <ProtectedRoute allowedRoles={['Admin PKBM']}>
              <PKBMLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin-pkbm/dashboard" replace />} />
            <Route path="dashboard" element={<PKBMDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="grades" element={<GradeInput />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
