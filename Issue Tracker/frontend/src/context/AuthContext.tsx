
import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, login as authLogin, logout as authLogout, getCurrentUser, User } from '../utils/auth';

type AuthContextType = {
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
  }, []);

  const login = (username: string, password: string) => {
    const success = authLogin(username, password);
    if (success) {
      setUser(getCurrentUser());
    }
    return success;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
