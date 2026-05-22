import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useRef, useEffect } from 'react'; 
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const categoryEmoji = {
  'Moisturizer': '💧',
  'Humectant': '💧',
  'Emollient': '🧴',
  'Antioxidant': '✨',
  'Anti-inflammatory': '🌿',
  'Exfoliant': '🔬',
  'Brightening': '☀️',
  'Sunscreen': '🛡️',
  'Anti-acne': '🧪',
  'Barrier Repair': '🛡️',
  'Soothing': '🌱',
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

const probColors = [
  'bg-blue-500',
  'bg-indigo-400',
  'bg-purple-400',
  'bg-sky-400',
  'bg-teal-400',
];

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();
  const state = location.state || {};
  const reportRef = useRef();

  const imageUrl        = state.imageUrl        || null;
  const skinType        = state.skinType        || 'Unknown';
  const confidence      = state.confidence      || 0;
  const probabilities   = state.probabilities   || {};
  const recommendations = state.recommendations || [];

  useEffect(() => {
    if (skinType && skinType !== 'Unknown') {
      localStorage.setItem('lastScanResult', JSON.stringify({
        skin_type: skinType,
        confidence,
        probabilities,
        recommendations,
      }));
    }
  }, [skinType]);

  const score = Math.round(confidence * 100);
  const sortedProbs = Object.entries(probabilities).sort(([, a], [, b]) => b - a);

  const getSkinDescription = (type) => {
    const map = {
      // English
      'Oily':        t('result_desc_oily'),
      'Dry':         t('result_desc_dry'),
      'Normal':      t('result_desc_normal'),
      'Combination': t('result_desc_combination'),
      // Indonesia ← tambahkan ini
      'Berminyak':   t('result_desc_oily'),
      'Kering':      t('result_desc_dry'),
      'Kombinasi': t('result_desc_combination'),
    };
    return map[type] || `${t('result_detected')}: ${type}`;
  };

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8faff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        let yOffset = 0;
        let remaining = pdfHeight;
        while (remaining > 0) {
          pdf.addImage(imgData, 'PNG', 0, -yOffset, pdfWidth, pdfHeight);
          remaining -= pageHeight;
          yOffset += pageHeight;
          if (remaining > 0) pdf.addPage();
        }
      }
      pdf.save(`skinsense-${skinType.toLowerCase()}.pdf`);
    } catch (err) {
      alert('Gagal download PDF: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
      <div className="pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          {/* Nav */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/analysis')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-400 font-medium text-sm transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2"
            >
              <ArrowLeft size={16} /> {t('result_back')}
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-400 mb-8">{t('result_title')}</h1>

          {/* Area yang di-capture untuk PDF */}
          <div ref={reportRef}>

            <div className="grid lg:grid-cols-2 gap-6 mb-6 items-stretch">

              {/* Foto */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 min-h-[300px]">
                <div className="absolute inset-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Foto analisis" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-6xl mb-3">👤</div>
                        <p className="text-gray-500 text-sm">Foto Wajah</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-0.5">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      {t('result_detection')}
                    </div>
                    <p className="text-white text-sm font-bold">{t('result_confidence')}: {score}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">{t('result_skin_type')}</p>
                    <p className="text-green-400 text-sm font-bold">{skinType}</p>
                  </div>
                </div>
              </div>

              {/* Analysis card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{t('result_detected')}</p>
                      <h2 className="text-4xl font-black text-amber-500 tracking-wide">{skinType.toUpperCase()}</h2>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-4 border-amber-200 dark:border-amber-700 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{score}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{t('result_confidence').toUpperCase()}</p>
                    </div>
                  </div>

                  <hr className="border-gray-100 dark:border-gray-700 mb-5" />

                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t('result_prob_title')}</p>
                  <div className="space-y-3 mb-5">
                    {sortedProbs.map(([type, prob], i) => (
                      <div key={type} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300 w-24 flex-shrink-0">{type}</span>
                        <ProgressBar value={prob} color={probColors[i] || 'bg-gray-400'} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-10 text-right">{Math.round(prob * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{getSkinDescription(skinType)}</p>
                </div>
              </div>
            </div>

            {/* Rekomendasi */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
              <div className="mb-5">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">{t('result_rec_title')}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                  {t('result_rec_desc')} <span className="font-semibold text-blue-600 dark:text-blue-400">{skinType}</span>
                </p>
              </div>

              {recommendations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors rounded-xl p-3 flex flex-col items-center text-center gap-2">
                      <div className="text-3xl">{categoryEmoji[rec.Kategori_Fungsi] || '🧴'}</div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs capitalize leading-tight">{rec.Bahan_Standar}</p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">{rec.Kategori_Fungsi}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">{t('result_no_rec')}</p>
              )}
            </div>

          </div>
          {/* End reportRef */}

          {/* Tombol Download */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleDownloadPDF}
              className="btn-primary flex items-center gap-2 py-3.5 px-8 rounded-xl text-sm"
              style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.3)' }}
            >
              <Download size={16} /> {t('result_download')}
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}