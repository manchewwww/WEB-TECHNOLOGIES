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
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/:projectID/tickets"
            element={
              <ProtectedRoute>
                <MultipleTicketsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <MultipleTicketsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/statistics/:userId"
            element={
              <ProtectedRoute>
                <UserStatisticsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
