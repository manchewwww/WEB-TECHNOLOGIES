import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/LoginPage.css';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login, user} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
