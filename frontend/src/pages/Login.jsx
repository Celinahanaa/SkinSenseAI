import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useLang } from '../context/LanguageContext';
import { useGoogleLogin } from '@react-oauth/google';
import { createPortal } from 'react-dom';
import { apiCheckEmail, apiResetPassword } from '../services/api';

export default function Login() {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); 
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const { login, setUser } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const googleUser = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      }).then(res => res.json());

      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleUser.email,
          name: googleUser.name,
          avatar_url: googleUser.picture,
        }),
      });
      const data = await res.json();

      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/home');
    } catch (err) {
      setError('Login Google gagal');
    }
  },
  onError: () => setError('Login Google gagal'),
});

  return (
    <div className="min-h-screen flex items-stretch bg-[#f0f4ff] dark:bg-gray-900">
      <div
        className="hidden lg:flex lg:w-1/2 items-end p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a1a5c 0%, #1a3c8f 50%, #0e2770 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[1,2,3,4].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-cyan-400/20"
                style={{
                  width: `${(i + 1) * 120}px`,
                  height: `${(i + 1) * 120}px`,
                  top: `${-(i + 1) * 60}px`,
                  left: `${-(i + 1) * 60}px`,
                  opacity: 0.3 - i * 0.05,
                }}
              />
            ))}
            <div className="w-20 h-20 rounded-full bg-cyan-400/20 blur-xl" style={{ position: 'absolute', top: '-40px', left: '-40px' }} />
          </div>
          <div className="absolute top-1/3 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(147,210,255,0.15) 0%, transparent 70%)' }}
          />
        </div>
        <div className="relative z-10 max-w-sm">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              {t('login_text1')}<br />{t('login_text2')}
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              {t('login_subtitle')}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f0f4ff] dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-card p-10 w-full max-w-md animate-fade-in-up">
          <div className="mb-8">
            <Link to="/" className="text-blue-800 dark:text-blue-400 font-bold text-lg">SkinSense AI</Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-1">{t('login_welcome')}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('login_subtitle')}</p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('login_email')}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@medical.com"
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider m-2">{t('login_password')}</label>        
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-blue-700 dark:text-blue-400 hover:underline ml-auto flex justify-end mt-2"
              >
                {t('login_forgot')}
              </button>      
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-[41px] rounded-xl text-base flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.3)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>{t('login_btn')} <ArrowRight size={18} /></>
              )}
            </button>
          </form>
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500">{t('login_or')}</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleGoogleLogin()}
              className="btn-outline dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:border-blue-700 w-full h-[43px] rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <FcGoogle size={18} />
              Google
            </button>
            <button
              onClick={() => handleGoogleLogin()}
              className="btn-outline dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:border-blue-700 w-full h-[43px] rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <FaApple size={18} />
              Apple
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {t('login_no_account')}{' '}
            <Link to="/register" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">
              {t('login_create')}
            </Link>
          </p>
        </div>
      </div>
      {showForgotModal && createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
          {forgotStep === 1 && (
            <>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('forgot_title')}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">{t('forgot_desc')}</p>
              {forgotError && <p className="text-xs text-red-500 mb-3">{forgotError}</p>}
              <div className="relative mb-4">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Email"
                  className="input-field pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowForgotModal(false); setForgotEmail(''); setForgotError(''); }}
                  className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('edit_cancel')}
                </button>
                <button
                  disabled={forgotLoading || !forgotEmail}
                  onClick={async () => {
                    setForgotLoading(true);
                    setForgotError('');
                    try {
                      await apiCheckEmail(forgotEmail);
                      setForgotStep(2);
                    } catch (err) {
                      setForgotError(err.response?.data?.message || 'Email tidak ditemukan');
                    } finally {
                      setForgotLoading(false);
                    }
                  }}
                  className="flex-1 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {forgotLoading
                    ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : t('forgot_next')
                  }
                </button>
              </div>
            </>
          )}
          {forgotStep === 2 && (
            <>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('forgot_new_title')}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">{t('forgot_new_desc')}</p>
              {forgotError && <p className="text-xs text-red-500 mb-3">{forgotError}</p>}
              
              <div className="relative mb-4">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('forgot_new_pass')}
                className="input-field pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              />
              </div>
              <div className="relative mb-4">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder={t('forgot_confirm_pass')}
                className="input-field pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setForgotStep(1); setForgotError(''); }}
                  className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('forgot_back')}
                </button>
                <button
                  disabled={forgotLoading || !newPassword || !confirmNewPassword}
                  onClick={async () => {
                    if (newPassword !== confirmNewPassword) {
                      setForgotError('Password tidak cocok');
                      return;
                    }
                    setForgotLoading(true);
                    setForgotError('');
                    try {
                      await apiResetPassword(forgotEmail, newPassword);
                      setForgotStep(3);
                    } catch (err) {
                      setForgotError(err.response?.data?.message || 'Gagal reset password');
                    } finally {
                      setForgotLoading(false);
                    }
                  }}
                  className="flex-1 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {forgotLoading
                    ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : t('forgot_save')
                  }
                </button>
              </div>
            </>
          )}
          {forgotStep === 3 && (
            <>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('forgot_success_title')}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">{t('forgot_success_desc')}</p>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotStep(1);
                  setForgotEmail('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
                className="w-full h-[41px] py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium transition-colors"
              >
                {t('forgot_ok')}
              </button>
            </>
          )}
        </div>
      </div>,
      document.body
    )}
    </div>
  );
}
