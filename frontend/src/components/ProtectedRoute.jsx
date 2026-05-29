import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  if (!auth) return null; 
  if (auth.isLoggingOut) return null;
  if (!auth.user) return <Navigate to="/login" replace />;
  return children;
}
