import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sun, Moon, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiGetHistory } from '../services/api';
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';

const METRIC_COLORS = [
  'bg-gray-900 dark:bg-gray-300',
  'bg-gray-700 dark:bg-gray-400',
  'bg-gray-500',
  'bg-gray-400',
];

function ProgressBar({ value, color }) {
  return (
    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(value ?? 0, 100)}%` }} />
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();

  const [lastScan, setLastScan] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastScanResult');
    if (saved) {
      setLastScan(JSON.parse(saved));
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    apiGetHistory()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLastScan(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('profile_login_prompt')}</p>
          <button onClick={() => navigate('/login')} className="btn-primary px-6 py-2.5 rounded-xl">{t('login_btn')}</button>
        </div>
      </div>
    );
  }

  const analysisResult = lastScan?.result || lastScan || {};

  const probabilities = analysisResult?.probabilities || {};
  const sortedProbs = Object.entries(probabilities).sort(([, a], [, b]) => b - a);

  const skinType =
    analysisResult.skin_type ||
    analysisResult.jenis_kulit ||
    'Normal';

  const aiRecommendations = analysisResult.recommendations || [];

  const mappedRecommendations = aiRecommendations.map((item, index) => {
    const isMorning = index % 2 === 0;
    return {
      name: item.Bahan_Standar,
      description: item.Kategori_Fungsi,
      icon: isMorning ? '☀️' : '🌙',
      time: isMorning ? 'morning' : 'night',
    };
  });

  const defaultRoutine = {
    Berjerawat: {
      morning: [
        { name: 'Centella Asiatica', description: 'Soothing & redness relief', icon: '🌿' },
        { name: 'Zinc PCA',          description: 'Oil control & anti-acne',   icon: '💧' },
        { name: 'Azelaic Acid',      description: 'Anti-acne treatment',       icon: '✨' },
      ],
      night: [
        { name: 'Salicylic Acid',   description: 'Exfoliate pores',      icon: '🫧' },
        { name: 'Benzoyl Peroxide', description: 'Kill acne bacteria',   icon: '🌙' },
        { name: 'Tea Tree Oil',     description: 'Anti-bacterial care',  icon: '🍃' },
      ],
    },
    Berminyak: {
      morning: [
        { name: 'Niacinamide', description: 'Sebum control',     icon: '💦' },
        { name: 'Zinc PCA',    description: 'Reduce excess oil',  icon: '✨' },
        { name: 'Kaolin',      description: 'Absorb oil',         icon: '🧴' },
      ],
      night: [
        { name: 'Salicylic Acid', description: 'Deep pore cleansing',   icon: '🌙' },
        { name: 'Kaolin Clay',    description: 'Night detox treatment', icon: '🫧' },
      ],
    },
    Kering: {
      morning: [
        { name: 'Hyaluronic Acid', description: 'Hydration boost',     icon: '💧' },
        { name: 'Glycerin',        description: 'Maintain moisture',    icon: '✨' },
        { name: 'Squalane',        description: 'Lock skin hydration',  icon: '🧴' },
      ],
      night: [
        { name: 'Ceramide NP', description: 'Repair skin barrier', icon: '🌙' },
        { name: 'Shea Butter', description: 'Deep moisturizing',   icon: '🫶' },
        { name: 'Lactic Acid', description: 'Gentle exfoliation',  icon: '🫧' },
      ],
    },
    Normal: {
      morning: [
        { name: 'Aloe Vera',   description: 'Fresh soothing care',     icon: '🌿' },
        { name: 'Niacinamide', description: 'Maintain skin barrier',   icon: '✨' },
        { name: 'Vitamin C',   description: 'Brightening antioxidant', icon: '☀️' },
      ],
      night: [
        { name: 'Allantoin', description: 'Skin recovery',       icon: '🌙' },
        { name: 'Panthenol', description: 'Night soothing care', icon: '💧' },
      ],
    },
  };

  const hasAnalysis = !!analysisResult?.skin_type;

  const recommendations = hasAnalysis
    ? (mappedRecommendations.length > 0
        ? mappedRecommendations
        : [
            ...(defaultRoutine[skinType]?.morning || []).map(item => ({ ...item, time: 'morning' })),
            ...(defaultRoutine[skinType]?.night   || []).map(item => ({ ...item, time: 'night' })),
          ])
    : [];

  const morning = recommendations.filter(r => r.time === 'morning' || r.type === 'morning');
  const night   = recommendations.filter(r => r.time === 'night'   || r.type === 'night');

  const hydrationGoal =
    analysisResult?.moisture ??
    analysisResult?.hydration ??
    0;

  const aiInsight =
    analysisResult?.insight ??
    analysisResult?.recommendation_note ??
    t('profile_no_insight');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 pt-20 pb-8 bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-8">{t('profile_title')}</h1>

          <div className="grid lg:grid-cols-2 gap-6 items-stretch mb-6">

            {/* Left col */}
            <div className="grid grid-rows-[auto_1fr] gap-5">

              {/* User info card */}
              <div className="card dark:bg-gray-800 dark:border-gray-700 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                  {user.avatar_url ? (
                    <img src={`http://localhost:3000${user.avatar_url}`} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User size={32} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                {user.memberSince && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('profile_member_since')} {user.memberSince}</p>
                )}
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => navigate('/editprofile')}
                    className="btn-primary flex-1 py-2.5 rounded-xl text-sm tracking-widest"
                  >
                    {t('profile_edit')}
                  </button>
                </div>
              </div>

              {/* Skin metrics */}
              <div className="card dark:bg-gray-800 dark:border-gray-700">
                {lastScan ? (
                  <div className="space-y-4">
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                        {t('result_detected') || 'Skin Type'}
                      </p>
                      <p className="text-3xl font-black text-amber-500">{skinType.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300 w-28 flex-shrink-0">
                        {t('result_confidence') || 'Confidence'}
                      </span>
                      <ProgressBar
                        value={Math.round((analysisResult?.confidence ?? 0) * 100)}
                        color="bg-blue-500"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-10 text-right">
                        {Math.round((analysisResult?.confidence ?? 0) * 100)}%
                      </span>
                    </div>
                    {sortedProbs.map(([type, prob], i) => (
                      <div key={type} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300 w-28 flex-shrink-0">{type}</span>
                        <ProgressBar value={Math.round(prob * 100)} color={METRIC_COLORS[i] || 'bg-gray-400'} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-10 text-right">
                          {Math.round(prob * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('profile_no_scan')}</p>
                  </div>
                )}
              </div>

            </div>
            {/* End left col */}

            {/* Right col — Personalized Routine */}
            <div className="h-full">
              <div className="card dark:bg-gray-800 dark:border-gray-700 h-full">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-5">{t('profile_routine_title')}</h3>

                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {hasAnalysis
                        ? t('profile_no_routine')
                        : 'Please analyze your skin first to get personalized skincare routine'}
                    </p>
                  </div>
                ) : (
                  <>
                    {morning.length > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm mb-3">
                          <Sun size={16} /> {t('Morning Recommendations')}
                        </div>
                        <div className="space-y-3">
                          {morning.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
                              <span className="text-xl">{item.icon ?? '🧴'}</span>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{item.sub ?? item.description}</p>
                              </div>
                              {item.done
                                ? <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                                : <Circle size={20} className="text-gray-200 dark:text-gray-600 flex-shrink-0" />
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {night.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-3">
                          <Moon size={16} /> {t('Night Recommendations')}
                        </div>
                        <div className="space-y-3">
                          {night.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
                              <span className="text-xl">{item.icon ?? '🌙'}</span>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">{item.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{item.sub ?? item.description}</p>
                              </div>
                              <Circle size={20} className="text-gray-200 dark:text-gray-600 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* End right col */}

          </div>
          {/* End grid */}

          {/* AI Insights */}
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">{t('profile_ai_insights')}</h3>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-700 dark:text-gray-200">{t('profile_hydration_goal')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{hydrationGoal}%</p>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gray-900 dark:bg-gray-300 rounded-full" style={{ width: `${hydrationGoal}%` }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">{aiInsight}</p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}