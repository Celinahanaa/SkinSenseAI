import { Link } from 'react-router-dom';
import { Mail, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { user } = useAuth();
  const { t } = useLang();

  const footerLinks = [
    { to: '/home',     label: t('nav_home') },
    { to: '/analysis', label: t('nav_analysis') },
    { to: '/history',  label: t('nav_history') },
    { to: '/profile',  label: t('nav_profile') },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto text-center md:text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/logo2.png" alt="SkinSense AI" className="h-8 w-auto" />
              <span className="font-bold text-blue-900 dark:text-white text-lg whitespace-nowrap">SkinSense AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
              {t('footer_desc')}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-blue-600 pb-2 w-fit">
              {t('footer_menu')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to} className="flex justify-center md:justify-start">
                  <Link to={link.to} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <span className="text-blue-500">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-blue-600 pb-2 w-fit">
              {t('footer_contact')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-white" />
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
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">{t('footer_copy')}</p>
          <div className="flex gap-5 text-xs text-white">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">{t('footer_privacy')}</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">{t('footer_terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
