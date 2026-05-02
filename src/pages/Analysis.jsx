import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, AlertTriangle, Loader2, ImageIcon } from 'lucide-react';
import Footer from '../components/Footer';

export default function Analysis() {
  const [mode, setMode] = useState('upload'); // 'upload' | 'camera'
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
    // Simulate AI processing
    await new Promise(r => setTimeout(r, 2500));
    setLoading(false);
    navigate('/result');
  };

  const tips = [
    { title: 'Wajah', desc: 'Pastikan wajah Anda terlihat jelas tanpa tertutup objek apapun' },
    { title: 'Cahaya', desc: 'Gunakan pencahayaan yang cukup agar hasil analisis lebih akurat' },
    { title: 'Disclaimer', desc: 'Hasil analisis yang Anda dapatkan bisa berbeda tergantung kualitas foto' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-20 pb-8" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef4ff 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Mode tabs */}
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-card mb-10">
            {['upload', 'camera'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === m
                    ? 'text-blue-800 bg-blue-50 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'upload' ? 'Upload Foto' : 'Gunakan Kamera'}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Upload area */}
            <div>
              {mode === 'upload' ? (
                <div>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-blue-200 rounded-2xl bg-white cursor-pointer hover:border-blue-400 transition-colors overflow-hidden"
                    style={{ minHeight: '360px' }}
                  >
                    <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFile} className="hidden" />

                    {preview ? (
                      <div className="relative h-full" style={{ minHeight: '360px' }}>
                        <img src={preview} alt="preview" className="w-full h-full object-cover" style={{ minHeight: '360px' }} />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white font-medium text-sm bg-black/50 px-4 py-2 rounded-xl">Klik untuk ganti foto</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 px-8">
                        <div className="w-20 h-20 text-gray-300 mb-4">
                          <Upload size={60} className="mx-auto text-blue-300" />
                        </div>
                        <p className="font-bold text-gray-700 text-base mb-1">Click to upload</p>
                        <p className="text-xs text-gray-400">Supported formats: JPEG, JPG, PNG, WEBP</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-card p-8 flex flex-col items-center justify-center" style={{ minHeight: '360px' }}>
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Camera size={36} className="text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-700 mb-2">Aktifkan Kamera</p>
                  <p className="text-sm text-gray-400 text-center mb-6">Pastikan Anda berada di ruangan yang cukup cahaya</p>
                  <button className="btn-primary py-3 px-6 rounded-xl text-sm">
                    <Camera size={16} /> Buka Kamera
                  </button>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || (!preview && mode === 'upload')}
                className={`w-full mt-5 py-4 rounded-2xl font-bold text-base text-white transition-all ${
                  preview || mode === 'camera'
                    ? 'bg-blue-800 hover:bg-blue-900 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={preview || mode === 'camera' ? { boxShadow: '0 4px 20px rgba(26,60,143,0.3)' } : {}}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" /> Menganalisis Kulit...
                  </span>
                ) : (
                  'ANALISIS'
                )}
              </button>
            </div>

            {/* Tips */}
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide">
                TIPS
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">Quick Check Skin</h2>
              <h2 className="text-4xl font-bold text-blue-800 mb-8">With Us!</h2>

              <div className="space-y-6">
                {tips.map((tip, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle size={18} className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{tip.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading overlay inside card during analysis */}
              {loading && (
                <div className="mt-8 card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Loader2 size={16} className="text-blue-600 animate-spin" />
                    </div>
                    <p className="font-semibold text-gray-700 text-sm">Memproses gambar...</p>
                  </div>
                  <div className="space-y-2">
                    {['Mendeteksi wajah', 'Menganalisis tekstur kulit', 'Menghitung kadar minyak', 'Menyiapkan rekomendasi'].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        </div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
