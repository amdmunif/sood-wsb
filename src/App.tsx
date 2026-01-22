import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import LandingPage from './pages/LandingPage';
import PKBMListPublic from './pages/PKBMListPublic';
import ClassAccess from './pages/ClassAccess';
import SubjectCategories from './pages/SubjectCategories';
import Subjects from './pages/Subjects';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pkbm" element={<PKBMListPublic />} />
        <Route path="/akses-kelas" element={<ClassAccess />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/categories" replace />} />
          <Route path="categories" element={<SubjectCategories />} />
          <Route path="subjects" element={<Subjects />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
