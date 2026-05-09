import { Globe, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const footerLinks = [
    { to: '/home', label: 'Home' },
    { to: '/analysis', label: 'Analysis' },
    { to: '/history', label: 'History' },
    { to: '/profile', label: 'Profile' },
  ];
  
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between h-full gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-blue-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">SS</span>
              </div>
              <span className="font-bold text-blue-900">SkinSense AI</span>
            </div>
            <p className="text-xs text-gray-400">
              © 2026 SkinSense AI. Promoting Healthy Lives<br />
              through Precision Science.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-2 text-sm text-gray-500">
          <Link to="/home" className="hover:text-blue-800 transition-colors">Home</Link>
          <Link to="/analysis" className="hover:text-blue-800 transition-colors">Analysis</Link>
          <Link to="/history" className="hover:text-blue-800 transition-colors">History</Link>
          <Link to="/profile" className="hover:text-blue-800 transition-colors">Profile</Link>
        </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-800 hover:text-blue-800 transition-colors text-gray-400">
              <Globe size={16} />
            </button>
            <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-800 hover:text-blue-800 transition-colors text-gray-400">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
