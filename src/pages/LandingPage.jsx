import { useNavigate } from 'react-router-dom';
import { Scan, FlaskConical, TrendingUp, AlertTriangle, Zap, Droplets, Camera, Brain, LayoutDashboard, Download, Share2, Shield } from 'lucide-react';
import Footer from '../components/Footer';

const features = [
  {
    icon: <Scan size={22} className="text-white" />,
    title: 'Skin Type Detection',
    desc: 'Stop guessing if you\'re "combination" or "sensitive." Our AI analyzes sebum levels and texture to provide an objective classification across 16 different dermatological profiles.',
  },
  {
    icon: <FlaskConical size={22} className="text-white" />,
    title: 'Ingredient Analysis',
    desc: 'Upload a product label to see if it\'s safe for your specific profile. We cross-reference ingredients against clinical contraindications to prevent breakouts before they happen.',
  },
  {
    icon: <TrendingUp size={22} className="text-white" />,
    title: 'Progress Tracking',
    desc: 'Visualize your improvement over time with side-by-side heatmaps. See exactly how your barrier health and clarity are improving with your new science-backed routine.',
  },
];

const problems = [
  {
    icon: <AlertTriangle size={20} className="text-red-500" />,
    bg: 'bg-red-50',
    title: 'Hidden Reactivity',
    desc: 'Standard products often contain ingredients that trigger micro-inflammation invisible to the naked eye until it\'s too late.',
  },
  {
    icon: <Zap size={20} className="text-pink-500" />,
    bg: 'bg-pink-50',
    title: 'Chemical Conflict',
    desc: 'Many "viral" skincare trends combine actives that neutralize each other or cause long-term sensitivity when used incorrectly.',
  },
  {
    icon: <TrendingUp size={20} className="text-orange-400" />,
    bg: 'bg-orange-50',
    title: 'Barrier Fatigue',
    desc: 'Without precise data, it\'s easy to over-treat your skin, leading to chronic dehydration and premature aging.',
  },
];

const phases = [
  {
    icon: <Camera size={24} className="text-white" />,
    phase: 'PHASE 01',
    title: 'Capture & Scan',
    desc: 'Use our intelligent viewfinder to secure a high-fidelity image in your environment.',
  },
  {
    icon: <Brain size={24} className="text-white" />,
    phase: 'PHASE 02',
    title: 'Neural Diagnostics',
    desc: 'Our proprietary model scans for over 40 specific markers, from pore congestion to elasticity.',
  },
  {
    icon: <LayoutDashboard size={24} className="text-white" />,
    phase: 'PHASE 03',
    title: 'See Results',
    desc: 'Access your personalized dashboard with recommended formulations and a daily habit tracker.',
  },
];

const team = [
  { name: 'Fajrul Falaq', role: 'Data Scientist' },
  { name: 'Nada Firda', role: 'Data Scientist' },
  { name: 'Celina Hana', role: 'Full Stack Developer' },
  { name: 'Vergi Mutia', role: 'Full Stack Developer' },
  { name: 'Elok Faiqoh', role: 'AI Engineer' },
  { name: 'Maulana Ardhiansyah', role: 'AI Engineer' },
];

const roleColors = {
  'Data Scientist': 'bg-blue-100 text-blue-700',
  'Full Stack Developer': 'bg-green-100 text-green-700',
  'AI Engineer': 'bg-purple-100 text-purple-700',
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 pt-20">

<nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
      <span className="text-white text-xs font-black">SS</span>
    </div>
    <span className="font-bold text-gray-900">SkinSense AI</span>
  </div>
  <div className="flex items-center gap-3">
    <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 hover:text-blue-800">
      Sign In
    </button>
    <button onClick={() => navigate('/register')} className="bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-900">
      Analyze My Skin
    </button>
  </div>
</nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-5">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wider">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              NEURAL NETWORK DERMATOLOGY ENGINE
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              The Science of Perfect Skin,{' '}
              <span className="text-blue-800">Decoded by Deep Learning</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-lg">
              Experience the first AI-driven skincare companion that bridges the gap between clinical research and your daily routine. DermaAI uses advanced computer vision to understand your skin's unique cellular needs.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/analysis')}
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
                style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.3)' }}
              >
                <Scan size={16} /> Try the Scanner
              </button>
              <button className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                <FlaskConical size={16} /> Explore Technology
              </button>
            </div>
          </div>
        </section>

        {/* Designed for Your Journey */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Designed for Your Journey</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                DermaAI isn't just a scanner; it's a comprehensive platform for lifelong skin health management.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i}>
                  <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Guessing Fails */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Guessing Fails</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                The skincare industry relies on trial and error. We believe your skin deserves a more rigorous, evidence-based approach.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {problems.map((p, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-6 bg-white">
                  <div className={`w-10 h-10 ${p.bg} rounded-xl flex items-center justify-center mb-4`}>
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clinical Roadmap */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Clinical Roadmap</h2>
                <p className="text-gray-500 text-sm max-w-sm">
                  Our three-step neural analysis transforms a simple smartphone capture into a data-rich dermatological assessment.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full self-start lg:mt-2">
                <Shield size={12} /> Encrypted Clinical Data
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {phases.map((p, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    {p.icon}
                  </div>
                  <p className="text-xs font-bold text-blue-600 tracking-widest mb-2">{p.phase}</p>
                  <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-10 px-4">
          <div className="max-w-3xl mx-auto bg-blue-800 rounded-3xl px-8 py-14 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Ready for your healthiest skin ever?</h2>
            <p className="text-blue-200 text-sm mb-2 max-w-md mx-auto">
              Join over 50,000 users who have transformed their skincare journey with precision data. Start your first clinical scan today.
            </p>
            <p className="text-blue-300 text-xs mb-8">Instant results. No subscription required for your first scan.</p>
            <button
              onClick={() => navigate('/analysis')}
              className="bg-white text-blue-800 font-bold px-8 py-3 rounded-xl text-sm hover:bg-blue-50 transition-all"
            >
              Analyze My Skin
            </button>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet Our Team</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                The specialized minds bridging the gap between advanced deep learning and your daily skincare routine.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg viewBox="0 0 40 40" className="w-10 h-10 text-gray-400" fill="currentColor">
                      <circle cx="20" cy="14" r="7" />
                      <path d="M4 36c0-8.837 7.163-16 16-16s16 7.163 16 16" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}