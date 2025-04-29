import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, login as authLogin, logout as authLogout, getCurrentUser, User, register as authRegister } from '../utils/auth';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, firstname: string, lastname: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
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

  const login = async (email: string, password: string) => {
    try {
      const success = await authLogin(email, password);
      if (success) {
        setUser(getCurrentUser());
      }
      return success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, firstname: string, lastname: string, email: string, password: string, confirmPassword: string) => {
    try {
      const success = await authRegister(username, firstname, lastname, email, password, confirmPassword);
      if (success) {
        setUser(getCurrentUser());
      }
      return success;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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
