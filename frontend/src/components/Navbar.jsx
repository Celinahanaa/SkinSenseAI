import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { createPortal } from 'react-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/home', label: t('nav_home') },
    { to: '/analysis', label: t('nav_analysis') },
    { to: '/history', label: t('nav_history') },
    { to: '/profile', label: t('nav_profile') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="SkinSense AI" className="h-8 w-auto" />
            <span className="font-bold text-blue-900 dark:text-white text-lg">SkinSense AI</span>
          </Link>
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
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-bold text-gray-600 dark:text-gray-300"
              title={lang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
            >
              {lang === 'id' ? 'EN' : 'ID'}
            </button>
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
                  onClick={() => setShowLogoutModal(true)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title={t('nav_signout')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-800 transition-colors">
                  {t('nav_signin')}
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5 rounded-xl">
                  {t('nav_getstarted')}
                </Link>
              </>
            )}
          </div>
          <button className="md:hidden dark:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
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
          <div className="flex items-center gap-3 py-2">
            <button
              onClick={() => setDark(!dark)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
              {dark ? t('nav_lightmode') : t('nav_darkmode')}
            </button>
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {lang === 'id' ? 'EN' : 'ID'}
            </button>
          </div>
          {user ? (
            <button onClick={handleLogout} className="text-sm text-red-500 font-medium py-2">
              {t('nav_signout')}
            </button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 btn-outline text-sm py-2">
                {t('nav_signin')}
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 btn-primary text-sm py-2">
                {t('nav_register')}
              </Link>
            </div>
          )}
        </div>
      )}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={22} className="text-red-500 dark:text-red-400" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('logout_title')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">{t('logout_desc')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('edit_cancel')}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                {t('nav_signout')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}
