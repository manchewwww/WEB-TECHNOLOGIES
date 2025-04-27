"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
//import '../styles/NavBar.css';
const mainLogo_png_1 = __importDefault(require("../assets/mainLogo.png"));
const AuthContext_1 = require("../context/AuthContext");
function NavBar() {
    const { user, logout } = (0, AuthContext_1.useAuth)();
    return (<nav className="navbar">
      <div className="nav-left">
        <react_router_dom_1.Link to="/" className="logo-container">
          <img src={mainLogo_png_1.default} alt="Issue Tracker Logo" className="main-logo"/>
          {/* <span className="logo-text">Issue Tracker</span> */}
        </react_router_dom_1.Link>
      </div>
      <div className="nav-right">
        {user ? (<div className="user-info">
            <span className="username">Hello, {user === null || user === void 0 ? void 0 : user.username}</span>
            <button onClick={logout} className="nav-btn logout-btn">Logout</button>
          </div>) : (<div>
            <react_router_dom_1.Link to="/login" className="nav-btn">Login</react_router_dom_1.Link>
            <react_router_dom_1.Link to="/register" className="nav-btn register-btn">Register</react_router_dom_1.Link>
          </div>)}
      </div>
    </nav>);
}
exports.default = NavBar;
