import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/analysis', label: 'Analysis' },
    { to: '/history', label: 'History' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.jpg" alt="SkinSense AI" className="h-8 w-auto" />
            <span className="font-bold text-blue-900 dark:text-white text-lg">SkinSense AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link text-sm font-medium pb-0.5 ${
                  isActive(link.to)
                    ? 'text-blue-800 dark:text-blue-400 border-b-2 border-blue-800 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Toggle dark mode */}
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-500" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                >
                  <User size={16} className="text-blue-800" />
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-800 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5 rounded-xl">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden dark:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-medium py-2 ${
                isActive(link.to) ? 'text-blue-800 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 py-2"
          >
            {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
          {user ? (
            <button onClick={handleLogout} className="text-sm text-red-500 font-medium py-2">
              Sign Out
            </button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 btn-outline text-sm py-2">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 btn-primary text-sm py-2">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}