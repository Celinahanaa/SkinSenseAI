import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';

const initialHistory = [
  { id: 1, date: 'APR 29', fullDate: 'Kemarin - 20.18 WIB', score: 78, tags: ['BERMINYAK', 'SENSITIF'], tagColors: ['bg-amber-100 text-amber-600', 'bg-pink-100 text-pink-600'] },
  { id: 2, date: 'APR 20', fullDate: '20 April 2026 - 07.18 WIB', score: 90, tags: ['NORMAL'], tagColors: ['bg-green-100 text-green-600'] },
  { id: 3, date: 'APR 13', fullDate: '13 April 2026 - 12.45 WIB', score: 82, tags: ['KERING'], tagColors: ['bg-blue-100 text-blue-600'] },
];

export default function History() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [items, setItems] = useState(initialHistory);

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const stats = {
    total: items.length,
    avgScore: items.length ? Math.round(items.reduce((a, b) => a + b.score, 0) / items.length) : 0,
    change: -5,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 pt-20 pb-8 bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-8">{t('nav_history')}</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Scan</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Skor Rata-Rata</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgScore}</p>
            </div>
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Perubahan Kulit</p>
              <p className="text-3xl font-bold text-red-500">{stats.change} lebih buruk</p>
            </div>
          </div>

          {/* Month group */}
          {items.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">April</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="card dark:bg-gray-800 dark:border-gray-700 flex items-center gap-4 animate-fade-in">
                    {/* Date badge */}
                    <div className="w-16 flex-shrink-0 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.date.split(' ')[0]}</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.date.split(' ')[1]}</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 dark:text-white mb-0.5">Skor: {item.score}%</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{item.fullDate}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, i) => (
                          <span key={i} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.tagColors[i]}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate('/result')}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-800 hover:border-blue-200 px-4 py-2 rounded-xl transition-all"
                      >
                        Detail <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-10 h-10 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada riwayat deteksi</p>
              <button onClick={() => navigate('/analysis')} className="btn-primary mt-4 px-6 py-2.5 rounded-xl text-sm">
                {t('analysis_btn')}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}