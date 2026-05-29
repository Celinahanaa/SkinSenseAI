import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';
const AI_URL = 'http://localhost:8000';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AUTH
export const apiRegister = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};

export const apiLogin = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const apiCheckEmail = async (email) => {
  const { data } = await api.post('/auth/check-email', { email });
  return data;
};

export const apiResetPassword = async (email, newPassword) => {
  const { data } = await api.post('/auth/reset-password', { email, newPassword });
  return data;
};

// PROFILE
export const apiGetProfile = async () => {
  const { data } = await api.get('/profile');
  return data;
};

export const apiUpdateProfile = async (formData) => {
  const { data } = await api.put('/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// HISTORY
export const apiGetHistory = async () => {
  const { data } = await api.get('/history');
  return data;
};

export const apiGetHistoryDetail = async (id) => {
  const { data } = await api.get(`/history/${id}`);
  return data;
};

export const apiDeleteHistory = async (id) => {
  const { data } = await api.delete(`/history/${id}`);
  return data;
};

export const apiSaveHistory = async ({ skin_type, confidence, recommendations, image_url }) => {
  const { data } = await api.post('/history', {
    result: { skin_type, confidence, recommendations },
    image_url,
  });
  return data;
};

// ANALYZE — FastAPI Python
export const apiAnalyze = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const { data } = await axios.post(`${AI_URL}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};