import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink } from 'lucide-react';
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import { apiGetHistory, apiDeleteHistory } from '../services/api';

const TAG_COLORS = {
  // Indonesia
  berminyak:  'bg-amber-100 text-amber-600',
  sensitif:   'bg-pink-100 text-pink-600',
  normal:     'bg-green-100 text-green-600',
  kering:     'bg-blue-100 text-blue-600',
  kombinasi:  'bg-purple-100 text-purple-600',
  berjerawat: 'bg-pink-100 text-pink-600',
  // English
  oily:        'bg-amber-100 text-amber-600',
  dry:         'bg-blue-100 text-blue-600',
  acne:        'bg-pink-100 text-pink-600',
  combination: 'bg-purple-100 text-purple-600',
};

const getTagColor = (tag) =>
  TAG_COLORS[tag?.toLowerCase()] || 'bg-gray-100 text-gray-600';

export default function History() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    const bulan = d.toLocaleString(locale, { month: 'short' }).toUpperCase();
    const tanggal = d.getDate();
    const jam = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    return {
      date: `${bulan} ${tanggal}`,
      fullDate: `${d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })} - ${jam}${lang === 'id' ? ' WIB' : ''}`,
    };
  };

  useEffect(() => {
    apiGetHistory()
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await apiDeleteHistory(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Gagal hapus:', err);
      alert('Gagal hapus: ' + err.message);
    }
  };

  // Data ada di dalam item.result
  const getConfidence = (item) => item.result?.confidence ?? 0;
  const getSkinType   = (item) => item.result?.skin_type ?? '-';
  const getScore      = (item) => Math.round(getConfidence(item) * 100);

  const stats = {
    total: items.length,
    avgScore: items.length
      ? Math.round(items.reduce((a, b) => a + getConfidence(b), 0) / items.length * 100)
      : 0,
    change: items.length >= 2
      ? Math.round((getConfidence(items[0]) - getConfidence(items[1])) * 100)
      : null,
  };

  const grouped = items.reduce((acc, item) => {
    const d = new Date(item.created_at ?? Date.now());
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    const label = d.toLocaleString(locale, { month: 'long', year: 'numeric' });
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <p className="text-gray-400 dark:text-gray-500">{t('history_loading')}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 pt-20 pb-8 bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-8">
            {t('nav_history')}
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('history_total')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('history_avg')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgScore}%</p>
            </div>
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('history_change')}</p>
              {stats.change === null ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{t('history_no_data')}</p>
              ) : (
                <p className={`text-3xl font-bold ${stats.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.change >= 0 ? `+${stats.change}` : stats.change}%
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl px-4 py-3 text-sm mb-6">
              {t('history_error')}: {error}
            </div>
          )}

          {/* Grouped by month */}
          {items.length > 0 && Object.entries(grouped).map(([bulan, groupItems]) => (
            <div key={bulan} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 capitalize">{bulan}</h2>
              <div className="space-y-4">
                {groupItems.map((item) => {
                  const { date, fullDate } = formatDate(item.created_at);
                  const skinType = getSkinType(item);
                  const score    = getScore(item);

                  return (
                    <div key={item.id} className="card dark:bg-gray-800 dark:border-gray-700 flex items-center gap-4">
                      {/* Date badge */}
                      <div className="w-16 flex-shrink-0 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{date.split(' ')[0]}</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{date.split(' ')[1]}</p>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 dark:text-white mb-0.5">
                          {t('history_score')}: {score}%
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{fullDate}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getTagColor(skinType)}`}>
                            {skinType.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => navigate(`/history/${item.id}`)}
                          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-800 hover:border-blue-200 px-4 py-2 rounded-xl transition-all"
                        >
                          {t('history_detail')} <ExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-10 h-10 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {!loading && items.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 font-medium">{t('history_empty')}</p>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}