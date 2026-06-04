import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Loader2, User, Sun, Info } from 'lucide-react';
import Footer from '../components/Footer';
import { useLang } from '../context/LanguageContext';
import { apiAnalyze, apiSaveHistory, apiUploadImage, apiGetQuota } from '../services/api';

export default function Analysis() {
  const { t } = useLang();
  const [mode, setMode] = useState('upload');
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const streamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

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

  const handleActivateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      alert('Kamera tidak dapat diakses. Pastikan izin kamera sudah diberikan.');
    }
  };

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  useEffect(() => {
    if (mode === 'upload' && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraActive(false);
      setCapturedImage(null);
    }
  }, [mode]);

  const [quota, setQuota] = useState(null);

  useEffect(() => {
    apiGetQuota().then(setQuota).catch(() => setQuota(null));
  }, []);

  const toBase64 = (f) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(f);
  });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      let fileToAnalyze = file;
      let imageUrl = preview;

      if (mode === 'camera') {
        if (!capturedImage) {
          alert('Ambil foto terlebih dahulu.');
          setLoading(false);
          return;
        }
        setAnalyzing(true);
        imageUrl = capturedImage;
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        fileToAnalyze = new File([blob], 'camera.jpg', { type: 'image/jpeg' });
      }

      if (!fileToAnalyze) {
        alert('Pilih gambar terlebih dahulu.');
        setLoading(false);
        return;
      }

      const imageBase64 = mode === 'camera' ? imageUrl : await toBase64(fileToAnalyze);
      const result = await apiAnalyze(fileToAnalyze);

      const uploadRes = await apiUploadImage(fileToAnalyze);
      const cloudinaryUrl = uploadRes.url;

      await apiSaveHistory({
        skin_type: result.skin_type,
        confidence: result.confidence,
        probabilities: result.probabilities,
        recommendations: result.recommendations,
        image_url: cloudinaryUrl,
      });

      apiGetQuota().then(setQuota).catch(() => {});

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setCameraActive(false);
      }
      setAnalyzing(false);
      setCapturedImage(null);

      navigate('/result', {
        state: {
          imageUrl: imageBase64,
          skinType: result.skin_type,
          confidence: result.confidence,
          probabilities: result.probabilities,
          recommendations: result.recommendations,
        }
      });
    } catch (err) {
      console.error('Analyze error:', err);
      setAnalyzing(false);
      alert('Analisis gagal: ' + (err?.message || err?.detail || 'Terjadi kesalahan, cek console untuk detail.'));
    } finally {
      setLoading(false);
    }
  };

  const tips = [
    { icon: <User size={18} className="text-gray-500" />, bg: 'bg-gray-200 dark:bg-gray-700', title: t('tip1_title'), desc: t('tip1_desc') },
    { icon: <Sun size={18} className="text-yellow-500" />, bg: 'bg-yellow-50 dark:bg-yellow-900/30', title: t('tip2_title'), desc: t('tip2_desc') },
    { icon: <Info size={18} className="text-red-500" />, bg: 'bg-red-100 dark:bg-red-900/30', title: t('tip3_title'), desc: t('tip3_desc') },
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 pt-20 pb-8 bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-2xl p-1.5 shadow-card">
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
            {quota !== null && (
              <div className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full ${
                quota.remaining === 0
                  ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                  : quota.remaining <= 2
                  ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                  : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
              }`}>
                {quota.remaining === 0 ? (
                  <span>🚫 {t('quota_full')}</span>
                ) : (
                  <span>✦ {t('quota_remaining')} {quota.remaining} / {quota.limit}</span>
                )}
              </div>
            )}
          </div>
          <div className={mode === 'camera' ? 'block' : 'grid lg:grid-cols-2 gap-10 items-start'}>
            <div>
              {mode === 'upload' ? (
                <div>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => !loading && fileRef.current?.click()}
                    className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors overflow-hidden"
                    style={{ height: '360px' }}
                  >
                    <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFile} className="hidden" />
                    {preview ? (
                      <div className="relative h-full" style={{ height: '360px' }}>
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-full object-cover transition-opacity duration-300"
                          style={{ height: '360px', opacity: loading ? 0.82 : 1 }}
                        />
                        {!loading && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white font-medium text-sm bg-black/50 px-4 py-2 rounded-xl">{t('analysis_change')}</p>
                          </div>
                        )}
                        {loading && (
                          <>
                            <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                backgroundImage: 'radial-gradient(circle, rgba(96,165,250,0.18) 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                              }}
                            />
                            <div className="scan-line absolute left-0 right-0 pointer-events-none" />
                            <div className="scan-corner tl" />
                            <div className="scan-corner tr" />
                            <div className="scan-corner bl" />
                            <div className="scan-corner br" />
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 px-8">
                        <div className="w-20 h-20 mb-2 mt-8">
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
                  {cameraActive && !capturedImage ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-2xl"
                        style={{ height: '450px', objectFit: 'cover', transform: 'scaleX(-1)' }}
                      />
                      <div className="absolute inset-0 bg-blue-500/5 pointer-events-none rounded-2xl" />
                      <div
                        className="absolute inset-0 pointer-events-none rounded-2xl"
                        style={{
                          backgroundImage: 'radial-gradient(circle, rgba(96,165,250,0.18) 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      />
                      <button
                        onClick={() => {
                          const canvas = document.createElement('canvas');
                          canvas.width = videoRef.current.videoWidth;
                          canvas.height = videoRef.current.videoHeight;
                          const ctx = canvas.getContext('2d');
                          ctx.translate(canvas.width, 0);
                          ctx.scale(-1, 1);
                          ctx.drawImage(videoRef.current, 0, 0);
                          setCapturedImage(canvas.toDataURL('image/jpeg'));
                        }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-blue-800 font-bold px-6 py-2.5 rounded-xl shadow-lg hover:bg-blue-50 transition z-10 flex items-center gap-2"
                      >
                        <Camera size={16} /> {t('analysis_camera_take')}
                      </button>
                    </div>
                  ) : capturedImage ? (
                    <div className="relative">
                      <img
                        src={capturedImage}
                        alt="captured"
                        className="w-full rounded-2xl"
                        style={{ height: '450px', objectFit: 'cover' }}
                      />
                      {analyzing && (
                        <>
                          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none rounded-2xl" />
                          <div
                            className="absolute inset-0 pointer-events-none rounded-2xl"
                            style={{
                              backgroundImage: 'radial-gradient(circle, rgba(96,165,250,0.18) 1px, transparent 1px)',
                              backgroundSize: '20px 20px',
                            }}
                          />
                          <div className="scan-line absolute left-0 right-0 pointer-events-none" />
                          <div className="scan-corner tl" />
                          <div className="scan-corner tr" />
                          <div className="scan-corner bl" />
                          <div className="scan-corner br" />
                        </>
                      )}
                      <button
                        onClick={() => {
                          setCapturedImage(null);
                          // Pastikan video element dapat stream lagi
                          setTimeout(() => {
                            if (videoRef.current && streamRef.current) {
                              videoRef.current.srcObject = streamRef.current;
                            }
                          }, 0);
                        }}
                        className="absolute top-4 left-4 bg-white/80 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-white transition z-10"
                      >
                        {t('analysis_camera_retake')}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl p-8 flex flex-col items-center justify-center" style={{ height: '450px' }}>
                      <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                        <Camera size={36} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('analysis_camera_allow')}</p>
                      <br />
                      <button onClick={handleActivateCamera} className="btn-primary py-3 px-6 rounded-xl text-sm flex items-center gap-2">
                        <Camera size={16} /> {t('analysis_camera_activate')}
                      </button>
                    </div>
                  )}
                  <div className="px-5 pb-5 pt-5">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 flex items-start gap-3">
                      <span className="bg-white dark:bg-gray-700 text-blue-800 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">{t('analysis_tips_label')}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t('analysis_tips_text')}</p>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={handleAnalyze}
                disabled={loading || (!preview && mode === 'upload') || quota?.remaining === 0}
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
                      <div className={`w-10 h-10 ${tip.bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        {tip.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{tip.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
