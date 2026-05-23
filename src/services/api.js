// src/services/api.js

const BASE_URL = 'http://localhost:3000/api';
const AI_URL = 'http://localhost:8000';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────

export const apiRegister = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Register gagal');
  return data;
};

export const apiLogin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login gagal');
  return data;
};

// ─────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────

export const apiGetProfile = async () => {
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal ambil profil');
  return data;
};

export const apiUpdateProfile = async (formData) => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/api/profile', {
    method: 'PUT', // atau PATCH, sesuai backend
    headers: {
      'Authorization': `Bearer ${token}`,
      // JANGAN tambah Content-Type, biar FormData set sendiri
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Server error');
  return data;
};

// ─────────────────────────────────────────
// HISTORY — ke Express (BASE_URL)
// ─────────────────────────────────────────

export const apiGetHistory = async () => {
  const res = await fetch(`${BASE_URL}/history`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal ambil history');
  return data;
};

export const apiGetHistoryDetail = async (id) => {
  const res = await fetch(`${BASE_URL}/history/${id}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Data tidak ditemukan');
  return data;
};

export const apiDeleteHistory = async (id) => {
  const res = await fetch(`${BASE_URL}/history/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal hapus history');
  return data;
};

export const apiSaveHistory = async ({ skin_type, confidence, recommendations, image_url }) => {
  const res = await fetch(`${BASE_URL}/history`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      result: { skin_type, confidence, recommendations },
      image_url,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal simpan history');
  return data;
};

// ─────────────────────────────────────────
// ANALYZE — FastAPI Python model
// ─────────────────────────────────────────

export const apiAnalyze = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const res = await fetch(`${AI_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Analisis gagal');
  return data;
};