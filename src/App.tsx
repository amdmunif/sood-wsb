import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import SubjectCategories from './pages/SubjectCategories';
import Subjects from './pages/Subjects';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/categories" replace />} />
          <Route path="categories" element={<SubjectCategories />} />
          <Route path="subjects" element={<Subjects />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
