import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const register = async (credentials) => {
  console.log('Registering with:', credentials); // Debug line
  const response = await api.post('/auth/register', credentials);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data; // Return { user: { _id, email, role }, token }
};

export const logout = async () => {
  // No-op on client side; AuthContext handles localStorage
  return Promise.resolve();
};