import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, login as authLogin, logout as authLogout, getCurrentUser, User, register as authRegister } from '../utils/auth';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, firstname: string, lastname: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const success = await authLogin(email, password);
    if (success) { 
      setUser(getCurrentUser());
    }

    return success;
  };

  const register = async (username: string, firstname: string, lastname: string, email: string, password: string, confirmPassword: string) => {
    const success = await authRegister(username, firstname, lastname, email, password, confirmPassword);
    if (success) {
      setUser(getCurrentUser());
    }
    
    return success;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const isAuth = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: isAuth, isLoading, login, register, logout }}>
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
