import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
<<<<<<< HEAD
import TicketPage from './pages/TicketPage';
=======
import ProjectsPage from './pages/ProjectsPage';
import AdminPage from './pages/AdminPage';
>>>>>>> develop
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
<<<<<<< HEAD
          <Route path="/tickets/:id" element={<TicketPage />} />
=======
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/admin" element={<AdminPage />} />
>>>>>>> develop
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
