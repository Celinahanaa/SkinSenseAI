// src/services/api.js
// Semua fungsi untuk komunikasi dengan backend

const BASE_URL = 'http://localhost:3000/api';

// URL FastAPI model (jalankan: uvicorn main:app --port 8000)
const AI_URL = 'http://localhost:8000';

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
    headers: authHeaders(),
    body: JSON.stringify(profileData),
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
// ANALYZE — memanggil FastAPI Python model
// ─────────────────────────────────────────

export const apiAnalyze = async (imageFile) => {
  const formData = new FormData();
  // FastAPI pakai key "file", bukan "image"
  formData.append('file', imageFile);

  const res = await fetch(`${AI_URL}/analyze`, {
    method: 'POST',
    // Jangan set Content-Type, biar browser set otomatis untuk multipart
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Analisis gagal');

  // Response dari FastAPI:
  // { skin_type, confidence, probabilities, recommendations: [{Bahan_Standar, Kategori_Fungsi}] }
  return data;
};

export const apiSaveHistory = async (result) => {
  const res = await fetch(`${BASE_URL}/history`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ result }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal simpan history');
  return data;
};