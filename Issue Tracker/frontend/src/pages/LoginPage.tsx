import { useNavigate } from 'react-router-dom';
import { use, useEffect, useState } from 'react';
import '../styles/LoginPage.css';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login, user} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = (e: any) => {
    e.preventDefault();
    
    const success = login(username, password);
    if (!success) {
      setError('Грешно потребителско име или парола!');
      return;
    }

    alert('Успешно влизане (фиктивно)');
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)} 
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
