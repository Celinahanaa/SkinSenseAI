import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';
import { apiGetHistoryDetail, apiDeleteHistory } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const CATEGORY_EMOJI = {
  moisturizer:      '💧',
  humectant:        '💧',
  emollient:        '🧴',
  antioxidant:      '✨',
  antiinflammatory: '🌿',
  exfoliant:        '🔬',
  eksfoliasilembut: '🔬',
  brightening:      '☀️',
  sunscreen:        '🛡️',
  antiacne:         '🧪',
  barrierrepair:    '🛡️',
  skinbarrier:      '🛡️',
  soothing:         '🌱',
  hydration:        '💦',
  moisturizing:     '💧',
  sebumcontrol:     '⚖️',
};


function SkinTypeBadges({ skinType, t }) {
  const key = skinType.toLowerCase();

  const badges = {
    oily:       [{ emoji: '💧', key: 'char_oily_1' }, { emoji: '✨', key: 'char_oily_2' }, { emoji: '⚖️', key: 'char_oily_3' }],
    berminyak:  [{ emoji: '💧', key: 'char_oily_1' }, { emoji: '✨', key: 'char_oily_2' }, { emoji: '⚖️', key: 'char_oily_3' }],
    dry:        [{ emoji: '🌿', key: 'char_dry_1'  }, { emoji: '✨', key: 'char_dry_2'  }, { emoji: '🛡️', key: 'char_dry_3'  }],
    kering:     [{ emoji: '🌿', key: 'char_dry_1'  }, { emoji: '✨', key: 'char_dry_2'  }, { emoji: '🛡️', key: 'char_dry_3'  }],
    normal:     [{ emoji: '✅', key: 'char_normal_1' }, { emoji: '💧', key: 'char_normal_2' }, { emoji: '🌿', key: 'char_normal_3' }],
    acne:       [{ emoji: '🧪', key: 'char_acne_1' }, { emoji: '🔬', key: 'char_acne_2'  }, { emoji: '🌿', key: 'char_acne_3'  }],
    berjerawat: [{ emoji: '🧪', key: 'char_acne_1' }, { emoji: '🔬', key: 'char_acne_2'  }, { emoji: '🌿', key: 'char_acne_3'  }],
  };

  const colorMap = {
    oily:       'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    berminyak:  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    dry:        'bg-blue-100  text-blue-600  dark:bg-blue-900/30  dark:text-blue-400',
    kering:     'bg-blue-100  text-blue-600  dark:bg-blue-900/30  dark:text-blue-400',
    normal:     'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    acne:       'bg-pink-100  text-pink-600  dark:bg-pink-900/30  dark:text-pink-400',
    berjerawat: 'bg-pink-100  text-pink-600  dark:bg-pink-900/30  dark:text-pink-400',
  };

  const items = badges[key];
  if (!items) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ emoji, key: labelKey }) => (
        <span
          key={labelKey}
          className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[key]}`}
        >
          {emoji} {t(labelKey)}
        </span>
      ))}
    </div>
  );
}

export default function HistoryDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { t, lang } = useLang();
  const reportRef   = useRef();

  const [item, setItem]                       = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    apiGetHistoryDetail(id)
      .then(data => setItem(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await apiDeleteHistory(id);
      navigate('/history');
    } catch (err) {
      alert('Gagal hapus: ' + err.message);
    }
  };


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <p className="text-gray-400 dark:text-gray-500">{t('history_loading')}</p>
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


  const skinType        = item.result?.skin_type       ?? '-';
  const confidence      = item.result?.confidence      ?? 0;
  const probabilities   = item.result?.probabilities   ?? {};
  const recommendations = item.result?.recommendations ?? [];
  const score           = Math.round(confidence * 100);
  const imageUrl        = item.image_url ?? null;

  const formatDate = (dateStr) => {
    const d      = new Date(dateStr);
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    return (
      d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
      ' ' +
      d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    );
  };

  const getSkinDescription = (type) => {
    const map = {
      Oily:       t('result_desc_oily'),
      Dry:        t('result_desc_dry'),
      Normal:     t('result_desc_normal'),
      Berminyak:  t('result_desc_oily'),
      Kering:     t('result_desc_dry'),
      Acne:       t('result_desc_acne'),
      Berjerawat: t('result_desc_acne'),
    };
    return map[type] || `${t('result_detected')}: ${type}`;
  };

const handleDownloadPDF = async () => {
  try {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210, H = 297;
    const margin = 14;
    const contentW = W - margin * 2;

    const rgb = (hex) => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
    const F = (hex) => { const [r,g,b]=rgb(hex); pdf.setFillColor(r,g,b); };
    const S = (hex) => { const [r,g,b]=rgb(hex); pdf.setDrawColor(r,g,b); };
    const T = (hex) => { const [r,g,b]=rgb(hex); pdf.setTextColor(r,g,b); };
    const font = (style, size) => { pdf.setFont('helvetica', style); pdf.setFontSize(size); };
    const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    F('#ffffff'); pdf.rect(0, 0, W, H, 'F');

    T('#1a3c8f'); font('bold', 15);
    pdf.text('SkinSense AI', margin, 15);
    T('#9ca3af'); font('normal', 6);
    pdf.text('PERSONALIZED SKIN REPORT', margin, 20);

    T('#1a3c8f'); font('bold', 8);
    pdf.text('SkinSense AI Analysis', W - margin, 12, { align: 'right' });
    T('#6b7280'); font('normal', 7);
    pdf.text(`Date: ${dateStr}`, W - margin, 17, { align: 'right' });

    font('bold', 5.5);
    const badgeText = 'AI Verified Analysis';
    const badgeTextW = pdf.getTextWidth(badgeText);
    const badgeW = badgeTextW + 6;
    const badgeH = 6, badgeX = W - margin - badgeW, badgeY = 20;
    F('#dcfce7'); S('#86efac'); pdf.setLineWidth(0.3);
    pdf.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'FD');
    T('#15803d'); font('bold', 5.5);
    pdf.text(badgeText, badgeX + badgeW / 2, badgeY + 4, { align: 'center' });

    F('#e5e7eb'); pdf.rect(margin, 28.5, contentW, 0.3, 'F');

    let y = 33;
    T('#1a3c8f'); font('bold', 9);
    pdf.text('Skin Type Analysis', margin, y);
    y += 4;

    const allProbs = Object.entries(probabilities || {}).sort(([,a],[,b]) => b - a);
    const probCount = allProbs.length;
    const card1H = Math.max(55, 30 + (probCount * 7) + 10);

    S('#e5e7eb'); pdf.setLineWidth(0.3);
    F('#f8fafc'); pdf.roundedRect(margin, y, contentW, card1H, 3, 3, 'FD');

    const photoX = margin + 5, photoW = 48, photoH = 58;
    const photoY = y + (card1H - photoH) / 2;
    if (imageUrl) {
      try { pdf.addImage(imageUrl, 'JPEG', photoX, photoY, photoW, photoH, '', 'FAST'); } catch (_) {}
    }

    const infoX = margin + photoW + 8;
    const infoW = contentW - photoW - 10;
    const barW = infoW - 4;

    const skinColors = {
      oily: '#f59e0b', dry: '#3b82f6', normal: '#10b981',
      berminyak: '#f59e0b', kering: '#3b82f6',
      acne: '#ef4444', berjerawat: '#ef4444',
    };
    const skinHex = skinColors[skinType.toLowerCase()] || '#3b82f6';

    T('#6b7280'); font('normal', 6);
    pdf.text('DETECTED SKIN TYPE', infoX, y + 6);
    T(skinHex); font('bold', 13);
    pdf.text(skinType.toUpperCase(), infoX, y + 13);

    const confPct = Math.min(Math.max(Number(score) || 0, 0), 100);

    T('#374151'); font('bold', 6.5);
    pdf.text('Confidence', infoX, y + 20);
    pdf.text(`${confPct}%`, infoX + barW, y + 20, { align: 'right' });
    F('#e2e8f0'); pdf.roundedRect(infoX, y + 22, barW, 3, 1, 1, 'F');
    if (confPct > 0) {
      F(skinHex);
      pdf.roundedRect(infoX, y + 22, barW * (confPct / 100), 3, 1, 1, 'F');
    }

    let barY = y + 30;
    T('#9ca3af'); font('bold', 5.5);
    pdf.text('MODEL PROBABILITY', infoX, barY);
    barY += 5;

    allProbs.forEach(([type, prob]) => {
      const pct = Math.min(Math.round((prob || 0) * 100), 100);
      T('#374151'); font('normal', 6.5);
      pdf.text(type, infoX, barY);
      T('#6b7280'); font('normal', 6.5);
      pdf.text(`${pct}%`, infoX + barW, barY, { align: 'right' });

      F('#e2e8f0'); pdf.roundedRect(infoX, barY + 1.5, barW, 2.5, 1, 1, 'F');
      const barColors = {
        oily: '#3b82f6', berminyak: '#3b82f6',
        acne: '#a78bfa', berjerawat: '#a78bfa',
        normal: '#c4b5fd',
        dry: '#60a5fa', kering: '#60a5fa',
      };
      const fillW = pct > 0 ? barW * (pct / 100) : 1.5;
      F(barColors[type.toLowerCase()] || '#93c5fd');
      pdf.roundedRect(infoX, barY + 1.5, fillW, 2.5, 1, 1, 'F');
      barY += 7;
    });

    y += card1H + 5;

    F('#e5e7eb'); pdf.rect(margin, y, contentW, 0.3, 'F');
    y += 5;

    T('#1a3c8f'); font('bold', 9);
    pdf.text('Skin Analysis Summary', margin, y);
    y += 4;

    const desc = getSkinDescription(skinType);
    const descLines = pdf.splitTextToSize(desc, contentW - 6);
    const card2H = Math.max(24, descLines.length * 4.8 + 12);

    S('#e5e7eb'); pdf.setLineWidth(0.3);
    F('#ffffff'); pdf.roundedRect(margin, y, contentW, card2H, 3, 3, 'FD');
    F('#1a3c8f'); pdf.rect(margin, y, 2.5, card2H, 'F');

    T('#374151'); font('normal', 7);
    pdf.text(descLines, margin + 7, y + 8);
    y += card2H + 5;

    F('#e5e7eb'); pdf.rect(margin, y, contentW, 0.3, 'F');
    y += 5;

    T('#1a3c8f'); font('bold', 9);
    pdf.text('Recommended Active Ingredients', margin, y);
    y += 5;

    const cols = 3, gap = 3;
    const colW = (contentW - gap * (cols - 1)) / cols;
    const itemH = 19;
    const maxRecs = Math.min((recommendations || []).length, 6);

    const tagColors = [
      { bg: '#dbeafe', text: '#1e40af', label: 'Active' },
      { bg: '#d1fae5', text: '#065f46', label: 'Barrier' },
      { bg: '#fce7f3', text: '#9d174d', label: 'Exfoliant' },
      { bg: '#ede9fe', text: '#5b21b6', label: 'Soothing' },
      { bg: '#fef9c3', text: '#854d0e', label: 'Hydration' },
      { bg: '#dcfce7', text: '#166534', label: 'Protective' },
    ];

    recommendations.slice(0, maxRecs).forEach((rec, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const ix = margin + col * (colW + gap);
      const iy = y + row * (itemH + gap);
      const tag = tagColors[i % tagColors.length];

      S('#e5e7eb'); pdf.setLineWidth(0.2);
      F('#ffffff'); pdf.roundedRect(ix, iy, colW, itemH, 2, 2, 'FD');

      const [br, bg2, bb] = rgb(tag.bg);
      pdf.setFillColor(br, bg2, bb);
      const tagBadgeW = 16, tagBadgeH = 4;
      pdf.roundedRect(ix + 3, iy + 3, tagBadgeW, tagBadgeH, 1, 1, 'F');
      T(tag.text); font('bold', 5);
      pdf.text(tag.label, ix + 3 + tagBadgeW / 2, iy + 3 + 2.8, { align: 'center' });

      const maxChars = Math.floor(colW / 1.9);
      const name = (rec.Bahan_Standar || '').length > maxChars
        ? (rec.Bahan_Standar || '').slice(0, maxChars - 2) + '…'
        : (rec.Bahan_Standar || '');
      T('#1f2937'); font('bold', 6.5);
      pdf.text(name, ix + 3, iy + 12);

      const cat = rec.Kategori_Fungsi || '';
      const catTrunc = cat.length > maxChars ? cat.slice(0, maxChars - 2) + '…' : cat;
      T('#6b7280'); font('normal', 5.5);
      pdf.text(catTrunc, ix + 3, iy + 16.5);
    });

    const gridRows = Math.ceil(maxRecs / cols);
    y += gridRows * (itemH + gap) + 5;

    const footerY = H - 20;
    F('#f8fafc'); pdf.rect(0, footerY, W, 20, 'F');
    F('#e5e7eb'); pdf.rect(0, footerY, W, 0.3, 'F');

    T('#9ca3af'); font('normal', 5);
    const disclaimer =
      'Medical Disclaimer: This report is generated by SkinSense AI for informational purposes only. ' +
      'It does not constitute a formal medical diagnosis. Please consult a board-certified dermatologist before beginning any new clinical routine.';
    const discLines = pdf.splitTextToSize(disclaimer, 115);
    pdf.text(discLines, margin, footerY + 6);

    T('#1a3c8f'); font('bold', 7);
    pdf.text('SkinSense-AI Research', W - margin, footerY + 6, { align: 'right' });
    T('#9ca3af'); font('normal', 6);
    pdf.text(`© ${new Date().getFullYear()} SkinSense AI.`, W - margin, footerY + 11, { align: 'right' });
    pdf.text('By Coding Camp Tim 2026', W - margin, footerY + 16, { align: 'right' });

    pdf.save(`skinsense-${skinType.toLowerCase()}-report.pdf`);
  } catch (err) {
    alert('Gagal download PDF: ' + err.message);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
      <div className="pt-6 pb-10">
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
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-sm font-medium text-red-500 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 hover:border-red-300 dark:hover:border-red-700 px-4 py-2 rounded-xl transition-colors"
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

          {/* ─ Konten yang di-render ulang untuk PDF ─ */}
          <div ref={reportRef} className="bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800 p-2">

            {/* Grid atas: foto + kartu analisis */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6 items-stretch">

              {/* Foto */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 min-h-[320px]">
                <div className="absolute inset-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Foto analisis"
                      className="w-full h-full object-cover object-top"
                      crossOrigin="anonymous"
                    />
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
                    <p className="text-white text-sm font-bold">
                      {t('result_confidence')}: {score}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">{t('result_skin_type')}</p>
                    <p className="text-green-400 text-sm font-bold">{skinType}</p>
                  </div>
                </div>
              </div>

              {/* Kartu analisis */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                        {t('result_detected')}
                      </p>
                      <h2 className="text-4xl font-black text-amber-500 tracking-wide">
                        {skinType.toUpperCase()}
                      </h2>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-4 border-amber-200 dark:border-amber-700 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{score}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{t('result_confidence').toUpperCase()}</p>
                    </div>
                  </div>

                  <hr className="border-gray-100 dark:border-gray-700 mb-5" />

                  {/* Confidence bar */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {t('result_confidence')}
                      </p>
                      <span className="text-xs font-bold text-amber-500">{score}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-700"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Badge karakteristik kulit */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      {t('result_char_title')}
                    </p>
                    <SkinTypeBadges skinType={skinType} t={t} />
                  </div>
                </div>

                {/* Deskripsi kulit */}
                <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {getSkinDescription(skinType)}
                  </p>
                </div>
              </div>
            </div>

            {/* Rekomendasi bahan aktif */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
              <div className="mb-5">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                  {t('result_rec_title')}
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                  {t('result_rec_desc')}{' '}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{skinType}</span>
                </p>
              </div>

              {recommendations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {recommendations.map((rec, i) => {
                    const normalizedCategory = rec.Kategori_Fungsi
                      ?.toLowerCase()
                      .replace(/[\s-_]/g, '');
                    return (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors rounded-xl p-3 flex flex-col items-center text-center gap-2"
                      >
                        <div className="text-3xl">
                          {CATEGORY_EMOJI[normalizedCategory] || '🧴'}
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs capitalize leading-tight">
                          {rec.Bahan_Standar}
                        </p>
                        <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                          {rec.Kategori_Fungsi}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">
                  {t('result_no_rec')}
                </p>
              )}
            </div>

          </div>
          {/* ─ End reportRef ─ */}

          {/* Tombol download */}
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

      {/* Modal konfirmasi hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-600 dark:text-red-400" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('result_trashtext')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">{t('result_trashtext2')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('edit_cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                {t('result_trash')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
