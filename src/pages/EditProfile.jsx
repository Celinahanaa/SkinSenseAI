import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Mail, Phone, Calendar, Save, Loader2, Check } from 'lucide-react';
import Footer from '../components/Footer';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: 'Anissa Prisilia',
    email: 'celina.23102@mhs.unesa.ac.id',
    phone: '+62 812 3456 7890',
    birthdate: '2003-05-14',
    skinType: 'berminyak',
    skinConcerns: ['jerawat', 'pori-pori'],
  });

  const skinTypes = [
    { value: 'normal', label: 'Normal' },
    { value: 'berminyak', label: 'Berminyak' },
    { value: 'kering', label: 'Kering' },
    { value: 'kombinasi', label: 'Kombinasi' },
    { value: 'sensitif', label: 'Sensitif' },
  ];

  const skinConcernOptions = [
    'Jerawat', 'Pori-Pori', 'Flek Hitam', 'Kerutan',
    'Kulit Kusam', 'Lingkaran Hitam', 'Minyak Berlebih', 'Kulit Kering',
  ];

  const handleAvatarChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarPreview(URL.createObjectURL(f));
  };

  const toggleConcern = (concern) => {
    const key = concern.toLowerCase();
    setForm(prev => ({
      ...prev,
      skinConcerns: prev.skinConcerns.includes(key)
        ? prev.skinConcerns.filter(c => c !== key)
        : [...prev.skinConcerns, key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1800));
    setSaving(false);
    setSaved(true);
    await new Promise(r => setTimeout(r, 1000));
    navigate('/profile');
  };

  const inputClass = `
    w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
    text-gray-800 text-sm font-medium placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent
    transition-all
  `;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-7 pb-8" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef4ff 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-800 hover:bg-blue-50 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Edit Profil</h1>
              <p className="text-sm text-gray-400 mt-0.5">Perbarui informasi akun Anda</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-blue-400" />
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
            <p className="text-xs text-gray-400 mt-3">Klik ikon kamera untuk ganti foto</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">Informasi Pribadi</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Nama Lengkap</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className={inputClass + ' pl-10'}
                    placeholder="Nama lengkap"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className={inputClass + ' pl-10'}
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Nomor Telepon</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className={inputClass + ' pl-10'}
                    placeholder="+62 ..."
                  />
                </div>
              </div>

              {/* Birthdate */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Tanggal Lahir</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={form.birthdate}
                    onChange={e => setForm(p => ({ ...p, birthdate: e.target.value }))}
                    className={inputClass + ' pl-10'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skin Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">Profil Kulit</h2>

            {/* Skin Type */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 mb-3 block">Tipe Kulit</label>
              <div className="flex flex-wrap gap-2">
                {skinTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setForm(p => ({ ...p, skinType: type.value }))}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      form.skinType === type.value
                        ? 'bg-blue-800 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Concerns */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-3 block">Masalah Kulit</label>
              <div className="flex flex-wrap gap-2">
                {skinConcernOptions.map(concern => {
                  const isSelected = form.skinConcerns.includes(concern.toLowerCase());
                  return (
                    <button
                      key={concern}
                      onClick={() => toggleConcern(concern)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isSelected
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-700 border border-transparent'
                      }`}
                    >
                      {concern}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 py-4 rounded-2xl font-bold text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 ${
                saved ? 'bg-green-500' : 'bg-blue-800 hover:bg-blue-900'
              }`}
              style={{ boxShadow: '0 4px 20px rgba(26,60,143,0.3)' }}
            >
              {saving ? (
                <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
              ) : saved ? (
                <><Check size={18} /> Tersimpan!</>
              ) : (
                <><Save size={18} /> Simpan Perubahan</>
              )}
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}