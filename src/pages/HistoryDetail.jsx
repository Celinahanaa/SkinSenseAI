import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';
import { apiGetHistoryDetail, apiDeleteHistory } from '../services/api';

const categoryEmoji = {
  'Moisturizer':       '💧',
  'Humectant':         '💧',
  'Emollient':         '🧴',
  'Antioxidant':       '✨',
  'Anti-inflammatory': '🌿',
  'Exfoliant':         '🔬',
  'Eksfoliasi Lembut': '🔬',
  'Brightening':       '☀️',
  'Sunscreen':         '🛡️',
  'Anti-Acne':         '🧪',
  'Anti-acne':         '🧪',
  'Barrier Repair':    '🛡️',
  'Skin Barrier':      '🛡️',
  'Soothing':          '🌱',
  'Hydration':         '💦',
  'Moisturizing':      '🧴',
  'Sebum Control':     '⚖️',
};

const probColors = [
  'bg-blue-500',
  'bg-indigo-400',
  'bg-purple-400',
  'bg-sky-400',
  'bg-teal-400',
];

const TAG_COLORS = {
  berminyak:  'bg-amber-100 text-amber-600',
  sensitif:   'bg-pink-100 text-pink-600',
  normal:     'bg-green-100 text-green-600',
  kering:     'bg-blue-100 text-blue-600',
  kombinasi:  'bg-purple-100 text-purple-600',
  berjerawat: 'bg-pink-100 text-pink-600',
  oily:       'bg-amber-100 text-amber-600',
  dry:        'bg-blue-100 text-blue-600',
  acne:       'bg-pink-100 text-pink-600',
  combination:'bg-purple-100 text-purple-600',
};

function ProgressBar({ value, color }) {
  return (
    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

export default function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGetHistoryDetail(id)
      .then(data => setItem(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Hapus data ini?')) return;
    try {
      await apiDeleteHistory(id);
      navigate('/history');
    } catch (err) {
      alert('Gagal hapus: ' + err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <p className="text-gray-400 dark:text-gray-500">Memuat data...</p>
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error || 'Data tidak ditemukan'}</p>
        <button onClick={() => navigate('/history')} className="btn-primary px-6 py-2 rounded-xl text-sm">
          Kembali ke History
        </button>
      </div>
    </div>
  );

  const skinType      = item.result?.skin_type ?? '-';
  const confidence    = item.result?.confidence ?? 0;
  const recommendations = item.result?.recommendations ?? [];
  const score         = Math.round(confidence * 100);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    return d.toLocaleDateString(locale, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }) + ' ' + d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
      <div className="pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          {/* Nav */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 font-medium text-sm transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2"
            >
              <ArrowLeft size={16} /> {t('result_back')}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-sm font-medium text-red-500 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
            >
              <Trash2 size={14} /> {t('result_trash')}
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-400 mb-2">
            {t('result_title2')}
          </h1>
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-8">
            {formatDate(item.created_at)}
          </p>

          {/* Result card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                  {t('result_title')}
                </p>
                <h2 className="text-4xl font-black text-amber-500 tracking-wide">
                  {skinType.toUpperCase()}
                </h2>
                <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full ${TAG_COLORS[skinType.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                  {skinType.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-amber-200 dark:border-amber-700 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{score}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">ACCURACY</p>
              </div>
            </div>
          </div>

          {/* Rekomendasi */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">
              {t('result_rec_title')}
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
              {t('result_rec_desc')} <span className="font-semibold text-blue-600 dark:text-blue-400">{skinType}</span>
            </p>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors rounded-xl p-3 flex flex-col items-center text-center gap-2">
                    <div className="text-3xl">{categoryEmoji[rec.Kategori_Fungsi] || '🧴'}</div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs capitalize leading-tight">
                      {rec.Bahan_Standar}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                      {rec.Kategori_Fungsi}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">{t('result_no_rec')}</p>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}