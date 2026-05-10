import { useNavigate } from 'react-router-dom';
import { Scan, FlaskConical, TrendingUp, AlertTriangle, Zap, Camera, Brain, LayoutDashboard, Shield, Sun, Moon } from 'lucide-react';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import FaceScanHero from '../components/FaceScanHero';

const roleColors = {
  'Data Scientist': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
  'Full Stack Developer': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  'AI Engineer': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400',
};

const team = [
  { name: 'Fajrul Falaq', role: 'Data Scientist' },
  { name: 'Nada Firda', role: 'Data Scientist' },
  { name: 'Celina Hana', role: 'Full Stack Developer' },
  { name: 'Vergi Mutia', role: 'Full Stack Developer' },
  { name: 'Elok Faiqoh', role: 'AI Engineer' },
  { name: 'Maulana Ardhiansyah', role: 'AI Engineer' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { dark, setDark } = useTheme();
  const { lang, setLang, t } = useLang();

  const features = [
    { icon: <Scan size={22} className="text-white" />, title: t('feat1_title'), desc: t('feat1_desc') },
    { icon: <FlaskConical size={22} className="text-white" />, title: t('feat2_title'), desc: t('feat2_desc') },
    { icon: <TrendingUp size={22} className="text-white" />, title: t('feat3_title'), desc: t('feat3_desc') },
  ];

  const problems = [
    { icon: <AlertTriangle size={20} className="text-red-500" />, bg: 'bg-red-50 dark:bg-red-900/30', title: t('prob1_title'), desc: t('prob1_desc') },
    { icon: <Zap size={20} className="text-pink-500" />, bg: 'bg-pink-50 dark:bg-pink-900/30', title: t('prob2_title'), desc: t('prob2_desc') },
    { icon: <TrendingUp size={20} className="text-orange-400" />, bg: 'bg-orange-50 dark:bg-orange-900/30', title: t('prob3_title'), desc: t('prob3_desc') },
  ];

  const phases = [
    { icon: <Camera size={24} className="text-white" />, phase: t('phase1'), title: t('phase1_title'), desc: t('phase1_desc') },
    { icon: <Brain size={24} className="text-white" />, phase: t('phase2'), title: t('phase2_title'), desc: t('phase2_desc') },
    { icon: <LayoutDashboard size={24} className="text-white" />, phase: t('phase3'), title: t('phase3_title'), desc: t('phase3_desc') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="flex-1 pt-10">

        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="SkinSense AI" className="h-8 w-auto" />
            <span className="font-bold text-gray-900 dark:text-white">SkinSense AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-bold text-gray-600 dark:text-gray-300"
            >
              {lang === 'id' ? 'EN' : 'ID'}
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-500" />}
            </button>
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400">
              {t('nav_signin')}
            </button>
            <button onClick={() => navigate('/register')} className="bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-900">
              {t('landing_analyze_btn')}
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            {/* Kiri: teks */}
            <div className="max-w-2xl lg:w-1/2">
              <span className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wider">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                {t('landing_badge')}
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                {t('landing_hero_title')}{' '}
                <span className="text-blue-800 dark:text-blue-400">{t('landing_hero_subtitle')}</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8 max-w-lg">
                {t('landing_hero_desc')}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/analysis')}
                  className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
                  style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.3)' }}
                >
                  <Scan size={16} /> {t('landing_try_scanner')}
                </button>
                <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                  <FlaskConical size={16} /> {t('landing_explore_tech')}
                </button>
              </div>
            </div>

            {/* Kanan: face scan animation */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center mt-10 lg:mt-0">
              <FaceScanHero />
            </div>
          </div>
        </section>

        {/* Designed for Your Journey */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('landing_features_title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">{t('landing_features_desc')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i}>
                  <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Guessing Fails */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('landing_problems_title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">{t('landing_problems_desc')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {problems.map((p, i) => (
                <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-800">
                  <div className={`w-10 h-10 ${p.bg} rounded-xl flex items-center justify-center mb-4`}>{p.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clinical Roadmap */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('landing_roadmap_title')}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">{t('landing_roadmap_desc')}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full self-start lg:mt-2">
                <Shield size={12} /> {t('landing_encrypted')}
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {phases.map((p, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">{p.icon}</div>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest mb-2">{p.phase}</p>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-10 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-3xl mx-auto bg-blue-800 rounded-3xl px-8 py-14 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">{t('landing_cta_title')}</h2>
            <p className="text-blue-200 text-sm mb-2 max-w-md mx-auto">{t('landing_cta_desc')}</p>
            <p className="text-blue-300 text-xs mb-8">{t('landing_cta_note')}</p>
            <button
              onClick={() => navigate('/analysis')}
              className="bg-white text-blue-800 font-bold px-8 py-3 rounded-xl text-sm hover:bg-blue-50 transition-all"
            >
              {t('landing_analyze_btn')}
            </button>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('landing_team_title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">{t('landing_team_desc')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg viewBox="0 0 40 40" className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="currentColor">
                      <circle cx="20" cy="14" r="7" />
                      <path d="M4 36c0-8.837 7.163-16 16-16s16 7.163 16 16" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{member.name}</p>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}