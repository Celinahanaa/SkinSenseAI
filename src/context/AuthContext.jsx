import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiGetProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // cek token saat app dibuka
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Saat app pertama dibuka, cek apakah ada token tersimpan
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ambil data profil pakai token yang ada
      apiGetProfile()
        .then(profile => setUser(profile))
        .catch(() => {
          // Token expired/invalid, hapus
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

const login = async (email, password) => {
  const data = await apiLogin(email, password);
  localStorage.setItem('token', data.token);
  // ✅ fetch profile lengkap termasuk skin_type & skin_concerns
  const profile = await apiGetProfile();
  setUser(profile);
  return data;
};

const register = async (name, email, password) => {
  const data = await apiRegister(name, email, password);
  localStorage.setItem('token', data.token);
  const profile = await apiGetProfile();
  setUser(profile);
  return data;
};

const logout = () => {
  setIsLoggingOut(true);
  setUser(null);
  localStorage.removeItem('token');
  window.location.href = '/';
};


  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};