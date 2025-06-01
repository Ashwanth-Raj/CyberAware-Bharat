import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getScams = async (filters = {}) => {
  return axios.get(`${API_URL}/scams`, { params: filters });
};

export const submitScam = async (scamData, token) => {
  return axios.post(`${API_URL}/scams`, scamData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateScam = async (id, scamData, token) => {
  return axios.put(`${API_URL}/scams/${id}`, scamData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteScam = async (id, token) => {
  return axios.delete(`${API_URL}/scams/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllUsers = async (token) => {
  return axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteUser = async (id, token) => {
  return axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const downloadScamPDF = async (id, token) => {
  return axios.get(`${API_URL}/scams/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
};