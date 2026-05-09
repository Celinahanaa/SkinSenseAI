import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Analysis from './pages/Analysis';
import Result from './pages/Result';
import History from './pages/History';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Layout><ProtectedRoute><Home /></ProtectedRoute></Layout>} />
              <Route path="/analysis" element={<Layout><ProtectedRoute><Analysis /></ProtectedRoute></Layout>} />
              <Route path="/result" element={<Layout><ProtectedRoute><Result /></ProtectedRoute></Layout>} />
              <Route path="/history" element={<Layout><ProtectedRoute><History /></ProtectedRoute></Layout>} />
              <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
              <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            </Routes>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
