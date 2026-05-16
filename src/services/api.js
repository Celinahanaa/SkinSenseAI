// src/services/api.js
// Semua fungsi untuk komunikasi dengan backend

const BASE_URL = 'http://localhost:3000/api';

// Helper: ambil token dari localStorage
const getToken = () => localStorage.getItem('token');

// Helper: header dengan token
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
  return data; // { token, user }
};

export const apiLogin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login gagal');
  return data; // { token, user }
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

export const apiUpdateProfile = async (profileData) => {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      // Jangan set Content-Type, biar browser set otomatis untuk multipart
    },
    body: profileData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal update profil');
  return data;
};

// ─────────────────────────────────────────
// HISTORY
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

// ─────────────────────────────────────────
// ANALYZE
// ─────────────────────────────────────────

export const apiAnalyze = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      // Jangan set Content-Type, biar browser set otomatis untuk multipart
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Analisis gagal');
  return data; // { skin_type, conditions, score, recommendations }
};