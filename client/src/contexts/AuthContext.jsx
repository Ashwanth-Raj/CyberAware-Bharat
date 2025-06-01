import { createContext, useState, useEffect } from 'react';
import { login, logout } from '../services/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    console.log('AuthContext initial state:', { storedUser, storedToken });
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const loginUser = async (credentials) => {
    const data = await login(credentials);
    console.log('Login response data:', data); 
    const userData = { _id: data.user._id, email: data.user.email, role: data.user.role };
    console.log('Setting user:', userData);
    setUser(userData);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', data.token);
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login: loginUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}