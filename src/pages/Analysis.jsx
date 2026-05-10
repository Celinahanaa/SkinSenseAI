import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, AlertTriangle, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';

export default function Analysis() {
  const { t } = useLang();
  const [mode, setMode] = useState('upload');
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

const handleAnalyze = async () => {
  if (!preview && mode === 'upload') return;
  setLoading(true);
  await new Promise(r => setTimeout(r, 2500)); // nanti ganti dengan apiAnalyze(file)
  setLoading(false);
  navigate('/result', {
    state: {
      imageUrl: preview, // ✅ kirim foto preview
      // nanti ganti dengan response API:
      // skinType, score, tags, metrics, dll
    }
  });
};

  const tips = [
    { title: t('tip1_title'), desc: t('tip1_desc') },
    { title: t('tip2_title'), desc: t('tip2_desc') },
    { title: t('tip3_title'), desc: t('tip3_desc') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 pt-20 pb-8 bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Mode tabs */}
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-2xl p-1.5 shadow-card mb-10">
            {['upload', 'camera'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === m
                    ? 'text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {m === 'upload' ? t('analysis_upload') : t('analysis_camera')}
              </button>
            ))}
          </div>

          <div className={mode === 'camera' ? 'block' : 'grid lg:grid-cols-2 gap-10 items-start'}>
            {/* Upload area */}
            <div>
              {mode === 'upload' ? (
                <div>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors overflow-hidden"
                    style={{ minHeight: '360px' }}
                  >
                    <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFile} className="hidden" />

                    {preview ? (
                      <div className="relative h-full" style={{ minHeight: '360px' }}>
                        <img src={preview} alt="preview" className="w-full h-full object-cover" style={{ minHeight: '360px' }} />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white font-medium text-sm bg-black/50 px-4 py-2 rounded-xl">{t('analysis_change')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 px-8">
                        <div className="w-20 h-20 mb-4">
                          <Upload size={60} className="mx-auto text-blue-300 dark:text-blue-600" />
                        </div>
                        <p className="font-bold text-gray-700 dark:text-gray-200 text-base mb-1">{t('analysis_click')}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('analysis_formats')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden relative">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs text-red-500 font-semibold">Live</span>
                  </div>

                  <div className="rounded-2xl p-8 flex flex-col items-center justify-center" style={{ minHeight: '360px' }}>
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                      <Camera size={36} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('analysis_camera_allow')}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-6">Pastikan Anda berada di ruangan yang cukup cahaya</p>
                    <button className="btn-primary py-3 px-6 rounded-xl text-sm">
                      <Camera size={16} /> {t('analysis_camera_activate')}
                    </button>
                  </div>

                  <div className="px-5 pb-5">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 flex items-start gap-3">
                      <span className="bg-white dark:bg-gray-700 text-blue-800 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">{t('analysis_tips_label')}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t('analysis_tips_text')}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || (!preview && mode === 'upload')}
                className={`w-full mt-5 py-4 rounded-2xl font-bold text-base text-white transition-all ${
                  preview || mode === 'camera'
                    ? 'bg-blue-800 hover:bg-blue-900 cursor-pointer'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                style={preview || mode === 'camera' ? { boxShadow: '0 4px 20px rgba(26,60,143,0.3)' } : {}}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" /> {t('analysis_loading')}
                  </span>
                ) : (
                  t('analysis_btn')
                )}
              </button>
            </div>

            {/* Tips */}
            {mode === 'upload' && (
              <div>
                <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide">
                  {t('analysis_tips_label')}
                </span>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{t('analysis_tips_title')}</h2>
                <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-8">{t('analysis_tips_subtitle')}</h2>

                <div className="space-y-6">
                  {tips.map((tip, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle size={18} className="text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{tip.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {loading && (
                  <div className="mt-8 card dark:bg-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Loader2 size={16} className="text-blue-600 dark:text-blue-400 animate-spin" />
                      </div>
                      <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Memproses gambar...</p>
                    </div>
                    <div className="space-y-2">
                      {['Mendeteksi wajah', 'Menganalisis tekstur kulit', 'Menghitung kadar minyak', 'Menyiapkan rekomendasi'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-blue-600 dark:text-blue-400 rounded-full" />
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}