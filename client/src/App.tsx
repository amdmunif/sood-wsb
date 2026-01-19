import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SubjectCategoryPage from './pages/admin/SubjectCategoryPage';
import SubjectPage from './pages/admin/SubjectPage';
import StudentPage from './pages/admin/StudentPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <nav className="bg-white shadow p-4 mb-4">
          <ul className="flex space-x-6">
            <li><Link to="/" className="font-bold text-gray-700">SOOD v2</Link></li>
            <li><Link to="/admin/subject-categories" className="text-blue-600 hover:underline">Kategori Mapel</Link></li>
            <li><Link to="/admin/subjects" className="text-blue-600 hover:underline">Mata Pelajaran</Link></li>
            <li><Link to="/admin/students" className="text-blue-600 hover:underline">Siswa (NIK)</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/admin/subject-categories" element={<SubjectCategoryPage />} />
          <Route path="/admin/subjects" element={<SubjectPage />} />
          <Route path="/admin/students" element={<StudentPage />} />
          <Route path="/" element={
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to SOOD v2 Dev</h1>
              <p className="text-gray-600">Select a menu item above to manage data.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
