import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

const mockResult = {
  skinType: 'BERMINYAK',
  score: 78,
  tags: ['T-Zone Berminyak', 'Pipi Normal', 'Flek Hitam'],
  tagColors: ['bg-amber-100 text-amber-700', 'bg-green-100 text-green-700', 'bg-gray-200 text-gray-600'],
  metrics: [
    { label: 'Kadar Minyak', value: 74, color: 'bg-gray-900 dark:bg-gray-300' },
    { label: 'Kelembapan', value: 42, color: 'bg-gray-800 dark:bg-gray-400' },
    { label: 'Sensitif', value: 12, color: 'bg-gray-500' },
    { label: 'Kerutan', value: 13, color: 'bg-gray-500' },
  ],
  description: 'Kulit Anda termasuk kategori berminyak, terutama pada area T-zone. Kondisi ini menyebabkan pori tampak lebih besar dan rentan terhadap komedo & jerawat.',
  products: [
    { badge: 'ESSENTIAL', label: 'Hyaluronic Acid', sub: 'Hydration Booster', emoji: '💧' },
    { badge: 'TARGETED', label: 'Niacinamide 10%', sub: 'Sebum Control & Pore Care', emoji: '🧪' },
    { badge: 'BARRIER REPAIR', label: 'Ceramide Complex', sub: 'Skin Barrier Support', emoji: '🛡️' },
    { badge: 'MAINTENANCE', label: 'Salicylic Cleanser', sub: 'Blemish Prevention', emoji: '✨' },
  ],
};

function ProgressBar({ value, color }) {
  return (
    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const imageUrl = location.state?.imageUrl || null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
      <div className="pt-10 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          {/* Back & History nav */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/analysis')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 font-medium text-sm transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2"
            >
              <ArrowLeft size={16} /> Kembali
            </button>
            <button
              onClick={() => navigate('/history')}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Lihat Riwayat
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-400 mb-8">Type of Your Skin</h1>

          {/* Main result grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8 items-stretch">
            {/* Photo */}
<div className="relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 min-h-[300px] h-full">
  <div className="absolute inset-0">
    {imageUrl ? (
      <img src={imageUrl} alt="Foto analisis" className="w-full h-full object-cover" />
    ) : (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-3">👤</div>
          <p className="text-gray-500 text-sm">Foto Wajah</p>
        </div>
      </div>
    )}
  </div>
  {/* overlay DETECTION COMPLETE tetap di sini */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-0.5">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    DETECTION COMPLETE
                  </div>
                  <p className="text-white text-sm font-bold">Hydration: 78%</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">STATUS</p>
                  <p className="text-green-400 text-sm font-bold">Healthy Glow</p>
                </div>
              </div>
            </div>

            {/* Analysis card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 h-full">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tipe Kulit</p>
                  <h2 className="text-3xl font-black text-amber-500 tracking-wide mb-4">{mockResult.skinType}</h2>
                  <div className="flex flex-wrap gap-2">
                    {mockResult.tags.map((tag, i) => (
                      <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full ${mockResult.tagColors[i]}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-200 dark:border-amber-700 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{mockResult.score}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center mt-2">SKOR KULIT</p>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700 my-4" />

              <div className="space-y-3">
                {mockResult.metrics.map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-28 flex-shrink-0">{m.label}</span>
                    <ProgressBar value={m.value} color={m.color} />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-10 text-right">{m.value}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{mockResult.description}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">Personalized Skincare Recommendations</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Kami sudah pilihkan produk yang cocok untuk kulit kamu supaya minyak lebih terkontrol, kulit tetap lembap, dan flek hitam bisa berkurang.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockResult.products.map((p) => (
                <div key={p.label} className="group">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-3 aspect-square flex flex-col items-center justify-center hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors cursor-pointer relative overflow-hidden">
                    <span className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-md bg-gray-900 dark:bg-gray-600 text-white">
                      {p.badge}
                    </span>
                    <div className="text-5xl mt-6">{p.emoji}</div>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{p.label}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{p.sub}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                className="btn-primary py-3.5 px-8 rounded-xl text-sm"
                style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.3)' }}
              >
                <Download size={16} /> Download Full Report
              </button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}