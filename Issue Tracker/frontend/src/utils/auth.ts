import { authApi } from "../services/api";

export type User = {
  id: string;
  username: string;
  email: string;
  role?: string;
}

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const response = await authApi.login({ email, password });
    
    setAuthToken(response.user.accessToken);
    localStorage.setItem('refreshToken', response.user.refreshToken);

    localStorage.setItem('user', JSON.stringify({
      id: response.user.id,
      username: response.user.username,
      email: response.user.email,
      role: response.user.role,
    }));
    
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

export async function register(username: string, email: string, password: string, confirmPassword: string): Promise<boolean> {
  try {
    await authApi.register({ username, email, password, confirmPassword });
    return true;
  } catch (error) {
    console.error('Registration failed:', error);
    return false;
  }
}

export function logout(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('authToken');
  return token !== null;
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }
  
  return JSON.parse(userStr);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}
