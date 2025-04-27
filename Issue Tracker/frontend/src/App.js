"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
require("./App.css");
const Navbar_1 = __importDefault(require("./components/Navbar"));
const HomePage_1 = __importDefault(require("./pages/HomePage"));
const LoginPage_1 = __importDefault(require("./pages/LoginPage"));
const RegisterPage_1 = __importDefault(require("./pages/RegisterPage"));
const MultipleTicketsPage_1 = __importDefault(require("./pages/MultipleTicketsPage"));
const AuthContext_1 = require("./context/AuthContext");
function App() {
    return (<AuthContext_1.AuthProvider>
      <react_router_dom_1.BrowserRouter>
        <Navbar_1.default />
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<HomePage_1.default />}/>
          <react_router_dom_1.Route path="/login" element={<LoginPage_1.default />}/>
          <react_router_dom_1.Route path="/register" element={<RegisterPage_1.default />}/>
          <react_router_dom_1.Route path="/tickets" element={<MultipleTicketsPage_1.default />}/>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </AuthContext_1.AuthProvider>);
}
exports.default = App;
