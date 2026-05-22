import { Link } from 'react-router-dom';
import { Mail, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  const footerLinks = [
    { to: '/home', label: 'Home' },
    { to: '/analysis', label: 'Analysis' },
    { to: '/history', label: 'History' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-black">SS</span>
              </div>
              <span className="font-bold text-white text-lg">SkinSense AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform analisis kulit berbasis AI untuk membantu kamu menemukan rutinitas skincare yang tepat secara ilmiah.
            </p>
          </div>

          {/* Menu */}
          {user && (
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-blue-600 pb-2 w-fit">Menu Utama</h3>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <span className="text-blue-500">›</span> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hubungi Kami */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-blue-600 pb-2 w-fit">Hubungi Kami</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-blue-400" />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">skinsenseai@gmail.com</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe size={14} className="text-white" />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">@skinsense.ai</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">© 2026 SkinSense AI. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-white">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}