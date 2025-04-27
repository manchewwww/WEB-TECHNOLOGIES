"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const react_1 = require("react");
//import '../styles/LoginPage.css';
const AuthContext_1 = require("../context/AuthContext");
function LoginPage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { login, user } = (0, AuthContext_1.useAuth)();
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);
    const handleLogin = (e) => {
        e.preventDefault();
        const success = login(username, password);
        if (!success) {
            setError('Грешно потребителско име или парола!');
            return;
        }
        alert('Успешно влизане (фиктивно)');
        navigate('/');
    };
    return (<div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>);
}
exports.default = LoginPage;
