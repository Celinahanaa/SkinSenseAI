import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiGetProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // cek token saat app dibuka

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
    const data = await apiLogin(email, password); // lempar error kalau gagal
    localStorage.setItem('token', data.token);    // simpan token
    setUser(data.user);                           // simpan user ke state
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Jangan render app dulu sebelum selesai cek token
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);