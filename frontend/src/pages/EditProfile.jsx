import { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Mail, Phone, Calendar, Save, Loader2, Check } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { apiUpdateProfile, apiGetProfile } from '../services/api';
import { useLang } from '../context/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    skinType: 'normal',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthdate: user.birthdate || '',
        skinType: user.skin_type || 'normal',
      });
    }
  }, [user]);

  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarPreview(`${API_BASE}${user.avatar_url}`);
    }
  }, [user]);

  useEffect(() => {
    console.log('user:', user);
    console.log('avatar_url:', user?.avatar_url);
  }, [user]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const skinTypes = [
    { value: 'normal',    labelKey: 'edit_skin_normal' },
    { value: 'berminyak', labelKey: 'edit_skin_oily' },
    { value: 'kering',    labelKey: 'edit_skin_dry' },
    { value: 'kombinasi', labelKey: 'edit_skin_combo' },
    { value: 'sensitif',  labelKey: 'edit_skin_sensitive' },
  ];

  const handleAvatarChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('birthdate', form.birthdate);
      formData.append('skin_type', form.skinType);

      if (fileRef.current?.files[0]) {
        formData.append('avatar', fileRef.current.files[0]);
      }

      await apiUpdateProfile(formData);
      const updatedUser = await apiGetProfile();
      setUser(updatedUser);
      setSaved(true);
      await new Promise(r => setTimeout(r, 1000));
      navigate('/profile');
    } catch (err) {
      console.error('Gagal simpan:', err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
    text-sm font-medium placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent
    transition-all
  `;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 pt-7 pb-8 bg-gradient-to-br from-[#f8faff] to-[#eef4ff] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400">{t('edit_title')}</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{t('edit_subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-blue-400 dark:text-blue-500" />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-900 transition-colors shadow"
              >
                <Camera size={14} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">{t('edit_avatar_hint')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-5">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5">{t('edit_personal_info')}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">{t('edit_name')}</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputClass + ' pl-10'} placeholder={t('edit_name_placeholder')} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">{t('edit_email')}</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} disabled className={inputClass + ' pl-10 opacity-60 cursor-not-allowed'} placeholder={t('edit_email_placeholder')} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">{t('edit_phone')}</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputClass + ' pl-10'} placeholder="+62 ..." />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">{t('edit_birthdate')}</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" value={form.birthdate} onChange={e => setForm(p => ({ ...p, birthdate: e.target.value }))} className={inputClass + ' pl-10'} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="h-[45px] items-center justify-center flex-1 py-4 rounded-2xl font-bold text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              {t('edit_cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`h-[45px] flex-1 py-4 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 ${
                saved ? 'bg-green-500' : 'bg-blue-800 hover:bg-blue-900'
              }`}
              style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.3)' }}
            >
              {saving ? (
                <><Loader2 size={18} className="animate-spin" /> {t('edit_saving')}</>
              ) : saved ? (
                <><Check size={18} /> {t('edit_saved')}</>
              ) : (
                <><Save size={18} /> {t('edit_save')}</>
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
