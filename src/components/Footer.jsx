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
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 mt-auto h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between h-full gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="/images/logo.jpg" alt="SkinSense AI" className="h-8 w-auto" />
              <span className="font-bold text-blue-900 dark:text-white">SkinSense AI</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © 2026 SkinSense AI. Promoting Healthy Lives
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-blue-800 dark:hover:border-blue-400 hover:text-blue-800 dark:hover:text-blue-400 transition-colors text-gray-400 dark:text-gray-500">
              <Globe size={16} />
            </button>
            <button className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-blue-800 dark:hover:border-blue-400 hover:text-blue-800 dark:hover:text-blue-400 transition-colors text-gray-400 dark:text-gray-500">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}