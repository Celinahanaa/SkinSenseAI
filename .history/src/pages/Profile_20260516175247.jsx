import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sun, Moon, CheckCircle2, Circle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiGetHistory } from '../services/api';
import Footer from '../components/Footer';

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
  const [latestScan, setLatestScan] = useState(null);

  useEffect(() => {
    // Ambil history, pakai scan paling pertama (terbaru)
    apiGetHistory()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLatestScan(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Silakan login untuk melihat profil</p>
          <button onClick={() => navigate('/login')} className="btn-primary px-6 py-2.5 rounded-xl">Login</button>
        </div>
      </div>
    );
  }

  // Metrics dari scan terakhir — sesuaikan field-nya dengan response backend
  const metricFields = [
    { label: 'Kadar Minyak', key: 'oil_level' },
    { label: 'Kelembapan',   key: 'moisture' },
    { label: 'Sensitif',     key: 'sensitivity' },
    { label: 'Kerutan',      key: 'wrinkle' },
  ];

  const metrics = metricFields.map((m, i) => ({
    label: m.label,
    value: latestScan?.[m.key] ?? 0,
    color: METRIC_COLORS[i],
  }));

  // Routine dari rekomendasi scan terakhir, fallback ke kosong
  const recommendations = latestScan?.recommendations ?? [];
  const morning = recommendations.filter(r => r.time === 'morning' || r.type === 'morning');
  const evening = recommendations.filter(r => r.time === 'evening' || r.type === 'evening');

  const hydrationGoal = latestScan?.moisture ?? latestScan?.hydration ?? 0;
  const aiInsight = latestScan?.insight ?? latestScan?.recommendation_note ?? 'Lakukan scan untuk mendapatkan rekomendasi AI.';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 pt-20 pb-8 bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-8">Profil Pengguna</h1>

          <div className="grid lg:grid-cols-2 gap-6 items-stretch mb-6">
            {/* Left col */}
            <div className="grid grid-rows-[auto_1fr] gap-5">
              {/* User info card */}
            <div className="card dark:bg-gray-800 dark:border-gray-700 text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                {user.avatar_url ? (
                  <img
                    src={`http://localhost:3000${user.avatar_url}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-blue-600 dark:text-blue-400" />
                )}
                </div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  {user.memberSince && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Member sejak {user.memberSince}</p>
                  )}
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => navigate('/editprofile')}
                    className="btn-primary flex-1 py-2.5 rounded-xl text-sm tracking-widest"
                  >
                    EDIT
                  </button>
                </div>
              </div>

              {/* Skin metrics */}
              <div className="card dark:bg-gray-800 dark:border-gray-700">
                {latestScan ? (
                  <div className="space-y-3">
                    {metrics.map((m) => (
                      <div key={m.label} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300 w-28 flex-shrink-0">{m.label}</span>
                        <ProgressBar value={m.value} color={m.color} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-10 text-right">{m.value}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-400 dark:text-gray-500">Belum ada data scan</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right col — Personalized Routine */}
            <div className="h-full">
              <div className="card dark:bg-gray-800 dark:border-gray-700 h-full">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-5">Personalized Routine</h3>

                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400 dark:text-gray-500">Lakukan scan untuk mendapatkan rekomendasi rutinitas.</p>
                  </div>
                ) : (
                  <>
                    {/* Morning */}
                    {morning.length > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm mb-3">
                          <Sun size={16} /> Morning Protocol
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

                    {/* Evening */}
                    {evening.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-3">
                          <Moon size={16} /> Evening Protocol
                        </div>
                        <div className="space-y-3">
                          {evening.map((item, i) => (
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
          </div>

          {/* AI Insights */}
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">AI Insights</h3>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-700 dark:text-gray-200">Hydration Goal</p>
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