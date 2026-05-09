import { useNavigate } from 'react-router-dom';
import { User, Sun, Moon, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const metrics = [
  { label: 'Kadar Minyak', value: 74, color: 'bg-gray-900' },
  { label: 'Kelembapan', value: 42, color: 'bg-gray-700' },
  { label: 'Sensitif', value: 12, color: 'bg-gray-500' },
  { label: 'Kerutan', value: 13, color: 'bg-gray-500' },
];

const routine = {
  morning: [
    { name: 'Gentle Cleansing Milk', sub: 'Apply to damp skin for 60 seconds', done: true, icon: '🧼' },
    { name: 'Vitamin C Serum (15%)', sub: 'For antioxidant protection', done: false, icon: '🍊' },
  ],
  evening: [
    { name: 'Retinol 0.5% Night Cream', sub: 'Alternate days', done: false, icon: '🌙' },
    { name: 'Retinol 0.5% Night Cream', sub: 'Alternate days', done: false, icon: '🌙' },
  ],
};

function ProgressBar({ value, color }) {
  return (
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Silakan login untuk melihat profil</p>
          <button onClick={() => navigate('/login')} className="btn-primary px-6 py-2.5 rounded-xl">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-20 pb-8" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef4ff 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-8">Profil Pengguna</h1>

          <div className="grid lg:grid-cols-2 gap-6 items-stretch mb-6">
            {/* Left col */}
            <div className="grid grid-rows-[auto_1fr] gap-5">
              {/* User info card */}
              <div className="card text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User size={32} className="text-blue-600" />
                </div>
                <h2 className="font-bold text-gray-900 text-lg">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">Member sejak {user.memberSince}</p>
                <button onClick={() => navigate('/editprofile')} className="btn-primary w-full mt-5 py-2.5 rounded-xl text-sm tracking-widest">
                  EDIT
                </button>
              </div>
              
              {/* Skin metrics */}
              <div className="card">
                <div className="space-y-3">
                  {metrics.map((m) => (
                    <div key={m.label} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-28 flex-shrink-0">{m.label}</span>
                      <ProgressBar value={m.value} color={m.color} />
                      <span className="text-sm font-semibold text-gray-700 w-10 text-right">{m.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right col */}
            <div className="h-full">
              {/* Routine card */}
              <div className="card h-full">
                <h3 className="font-semibold text-gray-700 mb-5">Personalized Routine</h3>

                {/* Morning */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm mb-3">
                    <Sun size={16} /> Morning Protocol
                  </div>
                  <div className="space-y-3">
                    {routine.morning.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${item.done ? 'text-gray-900' : 'text-gray-400'}`}>{item.name}</p>
                          <p className="text-xs text-gray-400">{item.sub}</p>
                        </div>
                        {item.done
                          ? <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                          : <Circle size={20} className="text-gray-200 flex-shrink-0" />
                        }
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evening */}
                <div>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-3">
                    <Moon size={16} /> Evening Protocol
                  </div>
                  <div className="space-y-3">
                    {routine.evening.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-400">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.sub}</p>
                        </div>
                        <Circle size={20} className="text-gray-200 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
                                    {/* AI Insights */}
              <div className="card">
                <h3 className="text-gray-500 text-sm font-medium mb-4">AI Insights</h3>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-700">Hydration Goal</p>
                    <p className="text-sm font-bold text-gray-900">85%</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-gray-900 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <p className="text-xs text-gray-500 italic">Hidrasi kulit masih rendah. Gunakan moisturizer ringan untuk menjaga keseimbangan kulit.</p>
                </div>
              </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
