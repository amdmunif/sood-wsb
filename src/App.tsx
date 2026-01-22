import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import LandingPage from './pages/LandingPage';
import PKBMListPublic from './pages/PKBMListPublic';
import ClassAccess from './pages/ClassAccess';
import SubjectCategories from './pages/SubjectCategories';
import Subjects from './pages/Subjects';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

function App() {
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
            <Route index element={<Navigate to="/admin/categories" replace />} />
            <Route path="categories" element={<SubjectCategories />} />
            <Route path="subjects" element={<Subjects />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
