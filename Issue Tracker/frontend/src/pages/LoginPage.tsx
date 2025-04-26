import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: any) => {
    e.preventDefault();
    // TODO: login логика
    alert('Успешно влизане (фиктивно)');
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
