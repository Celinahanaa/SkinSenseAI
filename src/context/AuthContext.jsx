import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, _password) => {
    // Mock login
    setUser({ name: 'Anissa Prisilia', email, memberSince: 'Januari 2026', avatar: null });
    return true;
  };

  const register = (name, email, _password) => {
    setUser({ name, email, memberSince: 'Mei 2026', avatar: null });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
