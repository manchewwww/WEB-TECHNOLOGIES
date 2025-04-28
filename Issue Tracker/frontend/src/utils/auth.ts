
import { TOKEN_EXPIRATION_TIME } from "../constants";

export type User = {
  id: number;
  username: string;
}

interface Token {
  username: string;
  id: string;
  expiresAt: number;
}

const dummyUsers = [
  { username: 'admin', password: 'admin' },
  { username: 'user', password: 'user' },
];

export function login(username: string, password: string): boolean {

  //TODO: Replace with real API call
  const user = dummyUsers.find(user => user.username === username && user.password === password);

  if (!user) {
    return false;
  }

  const token: Token = {
    username: user.username,
    id: user.username, //TODO: Replace with ID
    expiresAt: Date.now() + TOKEN_EXPIRATION_TIME,
  };

  localStorage.setItem('token', JSON.stringify(token));
  return true;
} 

export function logout(): void {
  localStorage.removeItem('token');
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');

  if (token !== null) {
    const parsedToken = JSON.parse(token);
    const currentTime = Date.now();

    if (currentTime > parsedToken.expiresAt) {
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  }

  return false;
}

export function getCurrentUser(): User | null {
  const tokenStr = localStorage.getItem('token');
  if (!tokenStr) {
    return null;
  }

  const token = JSON.parse(tokenStr);
  if (Date.now() > token.expiresAt) {
    localStorage.removeItem('token');
    return null;
  }

  return {
    id: token.id,
    username: token.username,
  };
}

