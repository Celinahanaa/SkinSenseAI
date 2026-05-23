import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useRef, useEffect } from 'react'; 
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  try {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210, H = 297;
    const m = 14;

    const rgb = (hex) => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
    const F = (hex) => { const [r,g,b]=rgb(hex); pdf.setFillColor(r,g,b); };
    const S = (hex) => { const [r,g,b]=rgb(hex); pdf.setDrawColor(r,g,b); };
    const T = (hex) => { const [r,g,b]=rgb(hex); pdf.setTextColor(r,g,b); };
    const font = (s,n) => { pdf.setFont('helvetica',s); pdf.setFontSize(n); };

    // ── FULL PAGE BG ──────────────────────────────────────────────
    F('#f0f4ff'); pdf.rect(0,0,W,H,'F');

    // left sidebar
    F('#1a3c8f'); pdf.rect(0,0,58,H,'F');

    // ── SIDEBAR CONTENT ───────────────────────────────────────────

    // App name
    T('#ffffff'); font('bold', 14);
    pdf.text('Skin', 14, 22);
    T('#93c5fd'); font('bold', 14);
    pdf.text('Sense', 30, 22);

    T('#bfdbfe'); font('normal', 6.5);
    pdf.text('AI SKIN ANALYSIS', 14, 28);

    // divider
    F('#2563eb'); pdf.rect(14, 31, 30, 0.4, 'F');

    // photo box
    const photoY = 36, photoH = 52;
    F('#1e4db7'); pdf.roundedRect(8, photoY, 42, photoH, 3, 3, 'F');
    if (imageUrl) {
      try { pdf.addImage(imageUrl, 'JPEG', 8, photoY, 42, photoH, '', 'FAST'); }
      catch(_) {}
    }

    // skin type label below photo
    const skinColors = {
      oily:'#fbbf24', dry:'#60a5fa', normal:'#34d399',
      combination:'#a78bfa', berminyak:'#fbbf24', kering:'#60a5fa',
      kombinasi:'#a78bfa'
    };
    const skinHex = skinColors[skinType.toLowerCase()] || '#93c5fd';
    T(skinHex); font('bold', 16);
    pdf.text(skinType.toUpperCase(), 29, photoY + photoH + 10, { align:'center' });

    T('#bfdbfe'); font('normal', 6.5);
    pdf.text('DETECTED SKIN TYPE', 29, photoY + photoH + 16, { align:'center' });

    // confidence circle (manual)
    const cx = 29, cy = photoY + photoH + 34, cr = 12;
    F('#1e4db7'); pdf.circle(cx, cy, cr, 'F');
    S(skinHex); pdf.setLineWidth(1.5);
    pdf.circle(cx, cy, cr, 'S');
    T('#ffffff'); font('bold', 11);
    pdf.text(`${score}%`, cx, cy + 3.5, { align:'center' });
    T('#bfdbfe'); font('normal', 6);
    pdf.text('CONFIDENCE', cx, cy + cr + 5, { align:'center' });

    // sidebar: prob list
    let sy = photoY + photoH + 60;
    T('#93c5fd'); font('bold', 7);
    pdf.text('PROBABILITY', 14, sy);
    sy += 5;

    sortedProbs.forEach(([type, prob], i) => {
      const pct = Math.round(prob * 100);
      const bw = 36;
      T(i===0 ? '#ffffff' : '#93c5fd'); font(i===0?'bold':'normal', 7);
      pdf.text(type, 14, sy);
      pdf.text(`${pct}%`, 52, sy, { align:'right' });

      F('#1e4db7'); pdf.roundedRect(14, sy+1.5, bw, 3, 1,1,'F');
      const barHex = i===0 ? skinHex : '#3b82f6';
      F(barHex);
      if(pct>0) pdf.roundedRect(14, sy+1.5, bw*(pct/100), 3, 1,1,'F');

      sy += 10;
    });

    // sidebar footer
    T('#3b5fd4'); font('normal', 6);
    pdf.text(new Date().toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'}), 29, H-8, { align:'center' });

    // ── MAIN CONTENT (right panel) ────────────────────────────────
    const rx = 66, rw = W - rx - m;

    // ── SECTION: Result heading ───────────────────────────────────
    T('#1a3c8f'); font('bold', 18);
    pdf.text('Analysis', rx, 20);
    T(skinHex); font('bold', 18);
    pdf.text('Report', rx + 34, 20);

    T('#6b7280'); font('normal', 7);
    pdf.text('Your personalized skin type result & recommendations', rx, 27);

    F('#e5e7eb'); pdf.rect(rx, 30, rw, 0.4, 'F');

    // ── SECTION: Description card ─────────────────────────────────
    let ry = 35;
    F('#ffffff'); S('#e5e7eb'); pdf.setLineWidth(0.3);
    pdf.roundedRect(rx, ry, rw, 36, 3,3,'FD');

    // top accent
    F(skinHex); pdf.roundedRect(rx, ry, rw, 5, 3,3,'F');
    pdf.rect(rx, ry+2, rw, 3, 'F');

    T('#1f2937'); font('bold', 8);
    pdf.text('ABOUT YOUR SKIN TYPE', rx+6, ry+17);

    const desc = getSkinDescription(skinType);
    const descLines = pdf.splitTextToSize(desc, rw - 12);
    T('#4b5563'); font('normal', 7.5);
    pdf.text(descLines.slice(0,4), rx+6, ry+23);

    ry += 42;

    // ── SECTION: Recommendations ──────────────────────────────────
    T('#1a3c8f'); font('bold', 9);
    pdf.text('Recommended Ingredients', rx, ry);
    T('#6b7280'); font('normal', 6.5);
    pdf.text(`Tailored for ${skinType} skin`, rx, ry+5);
    ry += 10;

    // grid: 2 columns
    const cols = 2;
    const colW = (rw - 4) / cols;
    const itemH = 14;
    const maxRecs = Math.min(recommendations.length, 12);

    recommendations.slice(0, maxRecs).forEach((rec, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const ix = rx + col * (colW + 4);
      const iy = ry + row * (itemH + 3);

      F('#ffffff'); S('#e5e7eb'); pdf.setLineWidth(0.2);
      pdf.roundedRect(ix, iy, colW, itemH, 2,2,'FD');

      // left accent
      F(i % 3 === 0 ? '#1a3c8f' : i % 3 === 1 ? skinHex : '#6366f1');
      pdf.roundedRect(ix, iy, 3, itemH, 1,1,'F');

      T('#1f2937'); font('bold', 7.5);
      const name = rec.Bahan_Standar.length > 22
        ? rec.Bahan_Standar.slice(0,20)+'…'
        : rec.Bahan_Standar;
      pdf.text(name, ix+6, iy+6);

      T('#6b7280'); font('normal', 6.5);
      const cat = rec.Kategori_Fungsi || '';
      const catShort = cat.length > 18 ? cat.slice(0,16)+'…' : cat;
      pdf.text(catShort, ix+6, iy+11);
    });

    const gridRows = Math.ceil(maxRecs / cols);
    ry += gridRows * (itemH + 3) + 6;

    // ── FOOTER BAR ─────────────────────────────────────────────────
    F('#1a3c8f'); pdf.rect(58, H-14, W-58, 14, 'F');
    T('#93c5fd'); font('normal', 6.5);
    pdf.text('SkinSense · For informational purposes only · AI-generated report', rx, H-5.5);

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
    <h3 className="font-bold text-gray-800 dark:text-white text-lg">
      {t('result_rec_title')}
    </h3>

    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
      {t('result_rec_desc')}{' '}
      <span className="font-semibold text-blue-600 dark:text-blue-400">
        {skinType}
      </span>
    </p>
  </div>

  {recommendations.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {recommendations.map((rec, i) => {
        console.log(rec.Kategori_Fungsi);

        const normalizedCategory = rec.Kategori_Fungsi
          ?.toLowerCase()
          .replace(/[\s-_]/g, '');

        return (
          <div
            key={i}
            className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors rounded-xl p-3 flex flex-col items-center text-center gap-2"
          >
            <div className="text-3xl">
              {categoryEmoji[normalizedCategory] || '🧴'}
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