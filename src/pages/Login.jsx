import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

export default function Login() {
  const { login } = useAuth();
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
    if (!form.email || !form.password) { setError('Email dan password wajib diisi.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    login(form.email, form.password);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-stretch bg-[#f0f4ff] dark:bg-gray-900">
      {/* Left panel */}
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
              Advanced AI,<br />Rooted in Science.
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              Experience clinical-grade dermatology analysis from the comfort of your home. Your skin's health, decoded by intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f0f4ff] dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-card p-10 w-full max-w-md animate-fade-in-up">
          <div className="mb-8">
            <Link to="/" className="text-blue-800 dark:text-blue-400 font-bold text-lg">SkinSense AI</Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-1">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Access your personalized dermatological dashboard.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs text-blue-700 dark:text-blue-400 hover:underline">Forgot password?</button>
              </div>
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
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 accent-blue-800"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Keep me signed in for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-[50px] rounded-xl text-base flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.3)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="btn-outline dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full h-[56px] rounded-xl text-sm flex items-center justify-center gap-2">
              <FcGoogle size={18} />
              Google
            </button>
            <button className="btn-outline dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full h-[56px] rounded-xl text-sm flex items-center justify-center gap-2">
              <FaApple size={18} />
              Apple
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            New to SkinSense?{' '}
            <Link to="/register" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}