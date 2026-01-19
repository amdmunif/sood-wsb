import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SubjectCategoryPage from './pages/admin/SubjectCategoryPage';
import SubjectPage from './pages/admin/SubjectPage';
import StudentPage from './pages/admin/StudentPage';
import LoginPage from './pages/LoginPage';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow p-4 mb-4 flex justify-between items-center">
      <ul className="flex space-x-6">
        <li><Link to="/" className="font-bold text-gray-700">SOOD v2</Link></li>
        <li><Link to="/admin/subject-categories" className="text-blue-600 hover:underline">Kategori Mapel</Link></li>
        <li><Link to="/admin/subjects" className="text-blue-600 hover:underline">Mata Pelajaran</Link></li>
        <li><Link to="/admin/students" className="text-blue-600 hover:underline">Siswa (NIK)</Link></li>
      </ul>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user.name}</span>
        <button onClick={handleLogout} className="text-red-600 font-medium hover:underline">Logout</button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
          <NavBar />

          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin/subject-categories" element={<SubjectCategoryPage />} />
              <Route path="/admin/subjects" element={<SubjectPage />} />
              <Route path="/admin/students" element={<StudentPage />} />
              <Route path="/" element={
                <div className="p-8 text-center">
                  <h1 className="text-3xl font-bold mb-4">Welcome to SOOD v2 Dev</h1>
                  <p className="text-gray-600">Select a menu item above to manage data.</p>
                </div>
              } />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
