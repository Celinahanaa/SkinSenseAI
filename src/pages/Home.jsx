import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Zap, Brain, ChevronRight, Star, Camera } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

function HeroCard() {
  return (
    <div className="bg-white rounded-3xl shadow-card-hover p-6 relative overflow-hidden w-full max-w-sm mx-auto">
      {/* Skin layer visual */}
      <div className="relative h-44 bg-gradient-to-b from-amber-50 to-orange-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
        <div className="relative">
          {/* Simplified skin cross-section visual */}
          <div className="w-32 h-32 relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-amber-200 to-orange-300 opacity-80" />
            <div className="absolute inset-2 rounded-lg bg-gradient-to-b from-amber-100 to-amber-200 opacity-90" />
            <div className="absolute inset-4 rounded-md bg-amber-50 opacity-80" />
            {/* Scan lines */}
            <div className="absolute inset-0 rounded-xl border-2 border-green-400 opacity-60" />
            <div className="absolute left-0 right-0 h-0.5 bg-green-400 opacity-50 top-1/2" />
          </div>
        </div>
        {/* Corner dots */}
        <div className="absolute top-3 left-3 w-5 h-5 border-2 border-green-400 rounded-sm" />
        <div className="absolute top-3 right-3 w-5 h-5 border-2 border-green-400 rounded-sm" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-2 border-green-400 rounded-sm" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-2 border-green-400 rounded-sm" />
      </div>

      {/* Stats row */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold mb-0.5">
            <CheckCircle2 size={12} />
            <span>DETECTION COMPLETE</span>
          </div>
          <p className="text-sm font-bold text-gray-800">Hydration: 78%</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-0.5">STATUS</p>
          <p className="text-sm font-bold text-green-600">Healthy Glow</p>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    num: '1',
    title: 'High-Res Capture',
    desc: 'Upload foto wajah berkualitas tinggi. AI kami memandu pencahayaan untuk hasil terbaik.',
    checks: ['AI-guided lighting correction', 'Auto-focus for macro precision'],
    color: 'bg-blue-800',
  },
  {
    num: '2',
    title: 'Neural Processing',
    desc: 'Model deep learning kami menganalisis ratusan parameter kulit secara real-time.',
    icon: <Brain size={28} className="text-blue-600" />,
    color: 'bg-blue-100',
  },
  {
    num: '3',
    title: 'Smart Routine',
    desc: 'Dapatkan rekomendasi bahan aktif yang dipersonalisasi berdasarkan hasil analisis Anda.',
    color: 'bg-green-50',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #dce8ff 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-6">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <CheckCircle2 size={12} />
                85% ACCURACY RATE
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3">
                Precision<br />Dermatology,
              </h1>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: '#1a3c8f' }}>
                Powered by AI.
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
                Hentikan siklus trial-and-error yang mahal. Neural network kami memberikan analisis kulit instan dan rekomendasi berbasis sains yang sesuai biologi unik Anda.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={user ? '/analysis' : '/register'}
                  className="btn-primary py-3.5 px-8 rounded-xl text-base"
                  style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.35)' }}
                >
                  Start Analysis <ArrowRight size={18} />
                </Link>
                <button className="btn-outline py-3.5 px-8 rounded-xl text-base">
                  How it Works
                </button>
              </div>
            </div>

            <div className="animate-fade-in-up delay-200 flex justify-center">
              <HeroCard />
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-40 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🧴</div>
                    <p className="text-xs text-amber-700 font-medium">Skincare</p>
                  </div>
                </div>
                <div className="h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                  <div className="text-3xl">✨</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-28 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                  <div className="text-3xl">🔬</div>
                </div>
                <div className="h-40 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💊</div>
                    <p className="text-xs text-green-700 font-medium">Ingredients</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-blue-800 text-sm font-semibold uppercase tracking-wider mb-3">Mengapa SkinSense AI?</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Kenali Kulit</h2>
              <h2 className="text-4xl font-bold text-blue-800 mb-8">Anda Lebih Dalam</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Acne Cosmetica Risks</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Penggunaan kosmetik yang tidak sesuai jenis kulit dapat memicu jerawat kosmetik (acne cosmetica) yang memperburuk kondisi kulit.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Ingredient Mismatches</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">38,1% pasien melaporkan perburukan kondisi kulit akibat penggunaan skincare yang tidak sesuai kebutuhan spesifik mereka (Ryu et al., 2021).</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl border-l-4 border-blue-800">
                <p className="text-gray-600 text-sm italic leading-relaxed">
                  "SkinSense AI was born to bridge the gap between expensive dermatological consultations and the guesswork of the beauty aisle."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Precision Analysis in Seconds</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Teknologi canggih kami memproses citra wajah Anda dan menghasilkan rekomendasi dalam hitungan detik.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="card animate-fade-in-up">
              <div className="w-9 h-9 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold text-sm mb-5">1</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">High-Res Capture</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">Upload foto wajah berkualitas tinggi. Sistem kami memandu pencahayaan optimal.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={14} className="text-green-500" />
                  AI-guided lighting correction
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={14} className="text-green-500" />
                  Auto-focus for macro precision
                </div>
              </div>
            </div>

            {/* Center phone mockup */}
            <div className="card flex flex-col items-center justify-center animate-fade-in-up delay-200 order-first md:order-none">
              <div className="w-32 h-52 bg-gray-900 rounded-3xl flex items-center justify-center relative shadow-xl">
                <div className="w-28 h-48 bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center">
                      <Camera size={24} className="text-blue-400" />
                    </div>
                    <div className="absolute inset-4 border border-blue-400 border-dashed rounded-xl opacity-60" />
                    <div className="absolute top-2 left-1/2 w-8 h-1 -translate-x-1/2 bg-gray-700 rounded-full" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center font-medium">SAFE SCAN</p>
            </div>

            {/* Step 2 */}
            <div className="card animate-fade-in-up delay-100">
              <div className="w-9 h-9 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mb-5">2</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Neural Processing</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">Model deep learning menganalisis ratusan parameter kulit secara real-time dengan akurasi tinggi.</p>
              <div className="w-14 h-14 bg-blue-50 rounded-full border-2 border-dashed border-blue-200 flex items-center justify-center">
                <Brain size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Step 3 + Science First */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="card animate-fade-in-up delay-300">
              <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm mb-5">3</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Routine</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Dapatkan rekomendasi bahan aktif yang dipersonalisasi berdasarkan jenis dan kondisi kulit unik Anda.</p>
            </div>

            <div className="rounded-2xl p-6 text-white animate-fade-in-up delay-400" style={{ background: 'linear-gradient(135deg, #1a3c8f 0%, #0f2460 100%)' }}>
              <h3 className="text-2xl font-bold mb-3">Science-First Approach</h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-5">Setiap rekomendasi didasarkan pada penelitian ilmiah yang tervalidasi untuk memastikan keamanan dan efektivitas.</p>
              <button className="border border-white/40 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
                Learn about our Research <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready for your clearest skin ever?</h2>
          <p className="text-gray-500 mb-8 text-lg">Bergabunglah dengan ribuan pengguna yang telah menemukan rutinitas skincare yang tepat untuk mereka.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/analysis' : '/register'}
              className="btn-primary py-4 px-10 rounded-xl text-base"
              style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.35)' }}
            >
              Start Free Analysis <Camera size={18} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-blue-400', 'bg-purple-400', 'bg-pink-400'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-white`} />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#FBBF24" className="text-yellow-400" />)}
                </div>
                <p className="text-xs text-gray-500">4.9/5 Rating dari verified users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
