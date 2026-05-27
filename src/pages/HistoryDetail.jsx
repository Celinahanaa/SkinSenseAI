import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';
import { apiGetHistoryDetail, apiDeleteHistory } from '../services/api';
import jsPDF from 'jspdf';

const categoryEmoji = {
  moisturizer: '💧',
  humectant: '💧',
  emollient: '🧴',
  antioxidant: '✨',
  antiinflammatory: '🌿',
  exfoliant: '🔬',

  eksfoliasilembut: '🔬',
  brightening: '☀️',
  sunscreen: '🛡️',
  antiacne: '🧪',

  barrierrepair: '🛡️',
  skinbarrier: '🛡️',

  soothing: '🌱',
  hydration: '💦',
  moisturizing: '💧',

  sebumcontrol: '⚖️',
};

const TAG_COLORS = {
  berminyak: 'bg-amber-100 text-amber-600', sensitif: 'bg-pink-100 text-pink-600',
  normal: 'bg-green-100 text-green-600', kering: 'bg-blue-100 text-blue-600',
  kombinasi: 'bg-purple-100 text-purple-600', berjerawat: 'bg-pink-100 text-pink-600',
  oily: 'bg-amber-100 text-amber-600', dry: 'bg-blue-100 text-blue-600',
  acne: 'bg-pink-100 text-pink-600', combination: 'bg-purple-100 text-purple-600',
};

export default function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const skinType        = item.result?.skin_type ?? '-';
  const confidence      = item.result?.confidence ?? 0;
  const recommendations = item.result?.recommendations ?? [];
  const score           = Math.round(confidence * 100);
  const imageUrl        = item.image_url ?? null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    return d.toLocaleDateString(locale, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }) + ' ' + d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  const getSkinDescription = (type) => {
    const map = {
      'Oily': t('result_desc_oily'), 'Dry': t('result_desc_dry'),
      'Normal': t('result_desc_normal'), 
      'Berminyak': t('result_desc_oily'), 'Kering': t('result_desc_dry'),
      'Acne': t('result_desc_acne'), 'Berjerawat': t('result_desc_acne'),
    };
    return map[type] || `${t('result_detected')}: ${type}`;
  };

  const handleDownloadPDF = async () => {
  try {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210, H = 297;

    const rgb = (hex) => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
    const F = (hex) => { const [r,g,b]=rgb(hex); pdf.setFillColor(r,g,b); };
    const S = (hex) => { const [r,g,b]=rgb(hex); pdf.setDrawColor(r,g,b); };
    const T = (hex) => { const [r,g,b]=rgb(hex); pdf.setTextColor(r,g,b); };
    const font = (s,n) => { pdf.setFont('helvetica',s); pdf.setFontSize(n); };

    const skinColors = {
      oily:'#f59e0b', dry:'#3b82f6', normal:'#10b981',
      combination:'#8b5cf6', kombinasi:'#8b5cf6',
      berminyak:'#f59e0b', kering:'#3b82f6',
    };
    const skinBg = {
      oily:'#fffbeb', dry:'#eff6ff', normal:'#f0fdf4',
      combination:'#f5f3ff', kombinasi:'#f5f3ff',
      berminyak:'#fffbeb', kering:'#eff6ff',
    };
    const skinAccent = skinColors[skinType.toLowerCase()] || '#6366f1';
    const skinLight  = skinBg[skinType.toLowerCase()]    || '#f0f4ff';

    const skinTraits = {
      oily:        ['High sebum production','Visible pores','Acne-prone skin'],
      berminyak:   ['Produksi sebum tinggi','Pori-pori terlihat','Rentan jerawat'],
      dry:         ['Low moisture levels','Feels tight & dull','Needs deep hydration'],
      kering:      ['Kelembaban rendah','Terasa kencang & kusam','Butuh hidrasi'],
      normal:      ['Balanced skin','Good hydration','Small pores'],
      combination: ['Oily T-zone','Dry or normal cheeks','Mixed skin needs'],
      kombinasi:   ['T-zone berminyak','Pipi kering/normal','Butuh perawatan campuran'],
    };
    const traits = skinTraits[skinType.toLowerCase()] || ['Skin detected by AI analysis'];

    // ── BACKGROUND ────────────────────────────────────────────────
    F('#ffffff'); pdf.rect(0, 0, W, H, 'F');

    // subtle dot grid background
    pdf.setDrawColor(220, 228, 255);
    pdf.setLineWidth(0.1);
    for (let x = 0; x <= W; x += 8) {
      for (let y = 0; y <= H; y += 8) {
        pdf.circle(x, y, 0.3, 'F');
      }
    }

    // ── LEFT SIDEBAR ──────────────────────────────────────────────
    F('#0f172a'); pdf.rect(0, 0, 54, H, 'F');

    // sidebar accent strip
    const [ar,ag,ab] = rgb(skinAccent);
    pdf.setFillColor(ar,ag,ab);
    pdf.rect(0, 0, 4, H, 'F');

    // logo area
    T('#ffffff'); font('bold', 13);
    pdf.text('Skin', 12, 22);
    T(skinAccent); font('bold', 13);
    pdf.text('Sense', 27, 22);
    T('#64748b'); font('normal', 6);
    pdf.text('AI SKIN ANALYSIS', 12, 28);

    // divider
    pdf.setDrawColor(255,255,255,0.1);
    pdf.setLineWidth(0.3);
    pdf.line(8, 32, 46, 32);

    // photo
    const photoY = 37, photoW = 38, photoH = 46;
    const photoX = (54 - photoW) / 2;
    F('#1e293b');
    pdf.roundedRect(photoX, photoY, photoW, photoH, 3, 3, 'F');
    if (imageUrl) {
      try {
        pdf.addImage(imageUrl, 'JPEG', photoX, photoY, photoW, photoH, '', 'FAST');
      } catch(_) {}
    }

    // skin type label
    T(skinAccent); font('bold', 11);
    pdf.text(skinType.toUpperCase(), 27, photoY + photoH + 10, { align: 'center' });
    T('#94a3b8'); font('normal', 5.5);
    pdf.text('SKIN TYPE', 27, photoY + photoH + 16, { align: 'center' });

    // confidence donut-style circle
    const cx = 27, cy = photoY + photoH + 34, cr = 11;
    F('#1e293b'); pdf.circle(cx, cy, cr, 'F');
    S(skinAccent); pdf.setLineWidth(2);
    pdf.circle(cx, cy, cr, 'S');
    T('#ffffff'); font('bold', 10);
    pdf.text(`${score}%`, cx, cy + 3.5, { align: 'center' });
    T('#64748b'); font('normal', 5);
    pdf.text('CONFIDENCE', cx, cy + cr + 5, { align: 'center' });

    // sidebar traits
    let sy = cy + cr + 16;
    T('#94a3b8'); font('bold', 6);
    pdf.text('SKIN TRAITS', 12, sy);
    sy += 5;
    pdf.setDrawColor(30,41,59);
    pdf.setLineWidth(0.3);
    pdf.line(8, sy - 2, 46, sy - 2);

    traits.forEach((trait) => {
      F(skinAccent); pdf.circle(10, sy - 1, 1.2, 'F');
      T('#cbd5e1'); font('normal', 6);
      pdf.text(trait, 14, sy);
      sy += 7;
    });

    // sidebar: recommendations count
    sy += 4;
    F('#1e293b');
    pdf.roundedRect(8, sy, 38, 22, 3, 3, 'F');
    T(skinAccent); font('bold', 14);
    pdf.text(`${recommendations.length}`, 27, sy + 11, { align: 'center' });
    T('#94a3b8'); font('normal', 5.5);
    pdf.text('INGREDIENTS', 27, sy + 17, { align: 'center' });
    pdf.text('RECOMMENDED', 27, sy + 21, { align: 'center' });

    // sidebar footer date
    T('#475569'); font('normal', 5.5);
    const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    pdf.text(dateStr, 27, H - 8, { align: 'center' });

    // ── MAIN CONTENT ──────────────────────────────────────────────
    const mx = 62, mw = W - mx - 10;

    // ── HEADER ────────────────────────────────────────────────────
    T('#0f172a'); font('bold', 20);
    pdf.text('Analysis', mx, 20);
    T(skinAccent); font('bold', 20);
    pdf.text('Report', mx + 40, 20);
    T('#94a3b8'); font('normal', 6.5);
    pdf.text('Personalized AI-powered skin analysis · For informational purposes only', mx, 27);
    pdf.setDrawColor(226,232,240);
    pdf.setLineWidth(0.4);
    pdf.line(mx, 30, W - 10, 30);

    // ── SKIN TYPE CARD ────────────────────────────────────────────
    let ry = 35;
    const [slr,slg,slb] = rgb(skinLight);
    pdf.setFillColor(slr,slg,slb);
    pdf.roundedRect(mx, ry, mw, 38, 4, 4, 'F');
    S(skinAccent); pdf.setLineWidth(0.5);
    pdf.roundedRect(mx, ry, mw, 38, 4, 4, 'S');

    // accent top bar
    F(skinAccent);
    pdf.roundedRect(mx, ry, mw, 5, 4, 4, 'F');
    pdf.rect(mx, ry + 2, mw, 3, 'F');

    T('#1e293b'); font('bold', 7.5);
    pdf.text('ABOUT YOUR SKIN', mx + 5, ry + 14);

    const desc = getSkinDescription(skinType);
    const descLines = pdf.splitTextToSize(desc, mw - 10);
    T('#475569'); font('normal', 7);
    pdf.text(descLines.slice(0, 4), mx + 5, ry + 21);

    ry += 44;

    // ── CONFIDENCE BAR ────────────────────────────────────────────
    T('#0f172a'); font('bold', 7.5);
    pdf.text('ANALYSIS CONFIDENCE', mx, ry);
    T(skinAccent); font('bold', 7.5);
    pdf.text(`${score}%`, mx + mw, ry, { align: 'right' });

    ry += 4;
    F('#e2e8f0'); pdf.roundedRect(mx, ry, mw, 4, 2, 2, 'F');
    F(skinAccent); pdf.roundedRect(mx, ry, mw * (score / 100), 4, 2, 2, 'F');

    ry += 12;

    // ── RECOMMENDED INGREDIENTS ───────────────────────────────────
    T('#0f172a'); font('bold', 8.5);
    pdf.text('Recommended Ingredients', mx, ry);
    T('#94a3b8'); font('normal', 6);
    pdf.text(`Tailored for ${skinType} skin type`, mx, ry + 5);
    ry += 11;

    // grid 2 cols
    const cols = 2;
    const colW = (mw - 4) / cols;
    const itemH = 16;
    const maxRecs = Math.min(recommendations.length, 10);
    const accentColors = [skinAccent, '#6366f1', '#0ea5e9', '#10b981', '#f59e0b'];

    recommendations.slice(0, maxRecs).forEach((rec, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const ix = mx + col * (colW + 4);
      const iy = ry + row * (itemH + 3);

      // card bg
      F('#f8fafc');
      S('#e2e8f0'); pdf.setLineWidth(0.2);
      pdf.roundedRect(ix, iy, colW, itemH, 2, 2, 'FD');

      // left accent
      const aColor = accentColors[i % accentColors.length];
      F(aColor);
      pdf.roundedRect(ix, iy, 3.5, itemH, 1, 1, 'F');
      pdf.rect(ix + 2, iy, 1.5, itemH, 'F');

      // number badge
      const [nr,ng,nb] = rgb(aColor);
      pdf.setFillColor(nr,ng,nb,0.12);
      pdf.circle(ix + colW - 7, iy + itemH/2, 4.5, 'F');
      T(aColor); font('bold', 6);
      pdf.text(`${i+1}`, ix + colW - 7, iy + itemH/2 + 2, { align: 'center' });

      // text
      T('#1e293b'); font('bold', 7);
      const name = rec.Bahan_Standar.length > 24
        ? rec.Bahan_Standar.slice(0, 22) + '…'
        : rec.Bahan_Standar;
      pdf.text(name, ix + 7, iy + 6.5);

      T('#94a3b8'); font('normal', 6);
      const cat = rec.Kategori_Fungsi || '';
      pdf.text(cat.length > 20 ? cat.slice(0, 18) + '…' : cat, ix + 7, iy + 12);
    });

    const gridRows = Math.ceil(maxRecs / cols);
    ry += gridRows * (itemH + 3) + 6;

    // ── DISCLAIMER BOX ────────────────────────────────────────────
    if (ry < H - 30) {
      F('#f1f5f9');
      pdf.roundedRect(mx, ry, mw, 14, 3, 3, 'F');
      T('#94a3b8'); font('italic', 6);
      const disclaimer = 'This report is generated by AI and is intended for informational purposes only. Please consult a dermatologist for professional advice.';
      const disLines = pdf.splitTextToSize(disclaimer, mw - 8);
      pdf.text(disLines, mx + 4, ry + 5.5);
    }

    // ── FOOTER ────────────────────────────────────────────────────
    F('#0f172a'); pdf.rect(54, H - 12, W - 54, 12, 'F');
    F(skinAccent); pdf.rect(54, H - 12, 3, 12, 'F');
    T('#64748b'); font('normal', 6);
    pdf.text('SkinSense AI · Personalized Skincare Analysis', mx, H - 4.5);
    T('#475569'); font('normal', 5.5);
    pdf.text(dateStr, W - 10, H - 4.5, { align: 'right' });

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

          <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-400 mb-2">{t('result_title2')}</h1>
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-8">{formatDate(item.created_at)}</p>

          {/* Foto + Result card — side by side */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6 items-stretch">

            {/* Foto kiri */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 min-h-[320px]">
              <div className="absolute inset-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Foto analisis" className="w-full h-full object-cover object-top" />
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

            {/* Result card kanan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 flex flex-col justify-between">
  <div>
    <div className="flex justify-between items-start mb-5">
      <div className="mt-3">
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

    {/* Confidence bar */}
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('result_confidence')}</p>
        <span className="text-xs font-bold text-amber-500">{score}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>

    {/* Skin type badges */}
    <div className="mb-5">
  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t('result_char_title')}</p>
  <div className="flex flex-wrap gap-2">
    {(skinType.toLowerCase() === 'oily' || skinType.toLowerCase() === 'berminyak') && (
      <>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">💧 {t('char_oily_1')}</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">✨ {t('char_oily_2')}</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">⚖️ {t('char_oily_3')}</span>
      </>
    )}
    {(skinType.toLowerCase() === 'dry' || skinType.toLowerCase() === 'kering') && (
      <>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">🌿 {t('char_dry_1')}</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">✨ {t('char_dry_2')}</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">🛡️ {t('char_dry_3')}</span>
      </>
    )}
    {skinType.toLowerCase() === 'normal' && (
      <>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">✅ {t('char_normal_1')}</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">💧 {t('char_normal_2')}</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">🌿 {t('char_normal_3')}</span>
      </>
    )}
    {(skinType.toLowerCase() === 'acne' || skinType.toLowerCase() === 'berjerawat') && (
      <>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">🧪 {t('char_acne_1')}</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">🔬 {t('char_acne_2')}</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">🌿 {t('char_acne_3')}</span>
      </>
    )}
  </div>
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
                {t('result_rec_desc')}{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">{skinType}</span>
              </p>
            </div>
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {recommendations.map((rec, i) => {
                  const normalizedCategory = rec.Kategori_Fungsi?.toLowerCase().replace(/[\s-_]/g, '');
                  return (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors rounded-xl p-3 flex flex-col items-center text-center gap-2">
                      <div className="text-3xl">{categoryEmoji[normalizedCategory] || '🧴'}</div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs capitalize leading-tight">{rec.Bahan_Standar}</p>
            <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
              {rec.Kategori_Fungsi}
            </span>                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">{t('result_no_rec')}</p>
            )}
          </div>

          {/* Download PDF */}
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