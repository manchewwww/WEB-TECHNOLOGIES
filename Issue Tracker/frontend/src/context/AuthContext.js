"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = AuthProvider;
exports.useAuth = useAuth;
const react_1 = require("react");
const auth_1 = require("../utils/auth");
const AuthContext = (0, react_1.createContext)(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if ((0, auth_1.isAuthenticated)()) {
            setUser((0, auth_1.getCurrentUser)());
        }
    }, []);
    const login = (username, password) => {
        const success = (0, auth_1.login)(username, password);
        if (success) {
            setUser((0, auth_1.getCurrentUser)());
        }
        return success;
    };
    const logout = () => {
        (0, auth_1.logout)();
        setUser(null);
    };
    return (<AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>);
}
function useAuth() {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
