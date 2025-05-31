import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TicketPage from './pages/TicketPage';
import ProjectsPage from './pages/ProjectsPage';
import AdminPage from './pages/AdminPage';
import MultipleTicketsPage from './pages/MultipleTicketsPage';
import UserStatisticsPage from './pages/UserStatisticsPage';
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
          <Route path="/tickets/:id" element={<TicketPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/:projectID/tickets" element={<MultipleTicketsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/tickets" element={<MultipleTicketsPage />} />
          <Route path="/statistics/:userId" element={<UserStatisticsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
