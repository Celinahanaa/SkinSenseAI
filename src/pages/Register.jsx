import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Target, FlaskConical, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useLang } from '../context/LanguageContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function Register() {
  const { register, setUser } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agree: false });
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
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      // Ambil data dari Google
      const googleUser = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      }).then(res => res.json());

      // Kirim ke backend untuk dapat JWT
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

      // Simpan token & set user
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/home');
    } catch (err) {
      setError('Login Google gagal');
    }
  },
  onError: () => setError('Login Google gagal'),
});

  const features = [
    { icon: <Target size={18} />, title: '85%+ Accuracy', desc: t('feat1_desc') },
    { icon: <FlaskConical size={18} />, title: t('feat2_title'), desc: t('feat2_desc') },
    { icon: <BarChart3 size={18} />, title: t('feat3_title'), desc: t('feat3_desc') },
  ];

  return (
    <div className="min-h-screen flex items-stretch bg-[#f0f4ff] dark:bg-gray-900">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a1a5c 0%, #1a3c8f 60%, #1e4db7 100%)' }}
      >
        <div className="relative z-10 max-w-sm">
          <p className="text-blue-200 text-sm mb-8">{t('register_subtitle')}</p>
          <h2 className="text-4xl font-bold text-white leading-snug mb-6">
            Skin yang Sehat<br />Dimulai dari<br />Pemahaman yang Tepat.
          </h2>

          <div className="space-y-5">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-300 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-0.5">{f.title}</h4>
                  <p className="text-blue-200 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 bg-white -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5 bg-white translate-y-24 -translate-x-24" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f0f4ff] dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-card p-10 w-full max-w-md animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{t('register_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{t('register_subtitle')}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('register_name')}</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder={t('register_name')}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('register_email')}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@medical.com"
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('register_password')}</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="input-field pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('register_confirm')}</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••"
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500" />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} className="w-4 h-4 mt-0.5 accent-blue-800" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {t('register_agree')}{' '}
                <span className="text-blue-700 dark:text-blue-400 font-semibold cursor-pointer hover:underline">{t('register_terms')}</span>
                {' '}{t('register_and')}{' '}
                <span className="text-blue-700 dark:text-blue-400 font-semibold cursor-pointer hover:underline">{t('register_privacy')}</span>
                {' '}{t('register_clinical')}
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-[50px] rounded-xl text-base mt-2 flex items-center justify-center"
              style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.3)' }}
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : t('register_btn')
              }
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500">{t('register_or')}</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleGoogleLogin()}
              className="btn-outline dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full h-[56px] rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <FcGoogle size={18} />
              Google
            </button>
            <button
              onClick={() => handleGoogleLogin()}
              className="btn-outline dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full h-[56px] rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <FaApple size={18} />
              Apple
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            {t('register_have_account')}{' '}
            <Link to="/login" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">{t('register_signin')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
