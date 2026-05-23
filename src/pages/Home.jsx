import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Zap, Brain, Star, Camera } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useRef } from 'react';

function HeroCard() {
  const { user } = useAuth();
  const { t } = useLang();

  return (
    <div className="bg-white dark:bg-blue-900 rounded-3xl shadow-card-hover p-6 relative overflow-hidden w-full max-w-sm mx-auto">
      <div className="relative h-56 bg-gradient-to-b dark:white rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
        <div className="relative">
          <div className="w-40 h-40 relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-amber-200 to-orange-300 opacity-80" />
            <div className="absolute inset-2 rounded-lg bg-gradient-to-b from-amber-100 to-amber-200 opacity-90" />
            <div className="absolute inset-4 rounded-md bg-amber-50 opacity-80" />
            <div className="absolute inset-0 rounded-xl border-2 border-green-400 opacity-60" />
            <div className="absolute left-0 right-0 h-0.5 bg-green-400 opacity-50 top-1/2" />
          </div>
        </div>
        <div className="absolute top-3 left-3 w-5 h-5 border-2 border-green-400 rounded-sm" />
        <div className="absolute top-3 right-3 w-5 h-5 border-2 border-green-400 rounded-sm" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-2 border-green-400 rounded-sm" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-2 border-green-400 rounded-sm" />
      </div>

      <div className="flex justify-between items-center px-1">
        <div>
          <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 text-xs font-semibold mb-0.5">
            <CheckCircle2 size={12} />
            <span>{t('result_detection')}</span>
          </div>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{t('home_badge2')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">SKIN TYPE</p>
          <p className="text-sm font-bold text-green-600 dark:text-green-400">{t('analysis_subtext2')}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const { user } = useAuth();
  const { t } = useLang();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f0f4ff] via-[#e8f0fe] to-[#dce8ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto py-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <CheckCircle2 size={12} />
                {t('home_badge')}
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                {t('home_title1')}<br />{t('home_title2')}
              </h1>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-blue-800 dark:text-blue-400">
                {t('home_subtitle')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
              {t('landing_hero_desc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={user ? '/analysis' : '/register'}
                  className="btn-primary py-3.5 px-8 rounded-xl text-base"
                  style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.35)' }}
                >
                  {t('landing_analyze_btn')} <ArrowRight size={18} />
                </Link>
                <button onClick={scrollToFeatures} className="btn-outline py-3.5 px-8 rounded-xl text-base">
                  {t('landing_explore_tech')}
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-3 gap-4 h-full">
              <div className="col-span-1 flex flex-col gap-4">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-md">
                  <img src="/images/skincare.jpg" alt="Skincare" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden shadow-md">
                  <img src="/images/skin-texture.jpg" alt="Skin Texture" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="col-span-2">
                <div className="h-full rounded-2xl overflow-hidden shadow-md">
                  <img src="/images/lab.jpg" alt="Lab Analysis" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-blue-800 dark:text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">{t('landing_problems_title')}</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('home_title3')}</h2>
              <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-8">{t('home_subtitle2')}</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{t('prob1_title')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t('prob1_desc')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{t('prob2_title')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t('prob2_desc')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-l-4 border-blue-800 dark:border-blue-500">
                <p className="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed">
                {t('home_text1')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section ref={featuresRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe] dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{t('landing_roadmap_title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('landing_roadmap_desc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="card dark:bg-gray-800 dark:border-gray-700 animate-fade-in-up">
              <div className="w-9 h-9 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold text-sm mb-5">1</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('phase1_title')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">{t('phase1_desc')}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2 size={14} className="text-green-500" />
                  {t('home_text2')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2 size={14} className="text-green-500" />
                  {t('home_text3')}
                </div>
              </div>
            </div>

            {/* Center phone mockup */}
            <div className="card dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center animate-fade-in-up delay-200 order-first md:order-none">
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
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center font-medium">{t('landing_encrypted')}</p>
            </div>

            {/* Step 2 */}
            <div className="card dark:bg-gray-800 dark:border-gray-700 animate-fade-in-up delay-100">
              <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm mb-5">2</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('phase2_title')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">{t('phase2_desc')}</p>
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full border-2 border-dashed border-blue-200 dark:border-blue-700 flex items-center justify-center">
                <Brain size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Step 3 + Science First */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="card dark:bg-gray-800 dark:border-gray-700 animate-fade-in-up delay-300">
              <div className="w-9 h-9 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full flex items-center justify-center font-bold text-sm mb-5">3</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('phase3_title')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t('phase3_desc')}</p>
            </div>

            <div className="rounded-2xl p-6 text-white animate-fade-in-up delay-400" style={{ background: 'linear-gradient(135deg, #1a3c8f 0%, #0f2460 100%)' }}>
              <h3 className="text-2xl font-bold mb-3">{t('landing_features_title')}</h3>
              <p className="text-blue-200 text-sm leading-relaxed">{t('landing_features_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('landing_cta_title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">{t('landing_cta_desc')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/analysis' : '/register'}
              className="btn-primary py-4 px-10 rounded-xl text-base"
              style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.35)' }}
            >
              {t('landing_analyze_btn')} <Camera size={18} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-blue-400', 'bg-purple-400', 'bg-pink-400'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-white dark:border-gray-900`} />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#FBBF24" className="text-yellow-400" />)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('landing_cta_note')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}