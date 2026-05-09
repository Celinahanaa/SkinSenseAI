import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    nav_home: 'Home',
    nav_analysis: 'Analysis',
    nav_history: 'History',
    nav_profile: 'Profile',
    nav_signin: 'Sign In',
    nav_register: 'Register',
    nav_getstarted: 'Get Started',
    nav_signout: 'Sign Out',
    nav_darkmode: 'Dark Mode',
    nav_lightmode: 'Light Mode',

    // Footer
    footer_copy: '© 2026 SkinSense AI. Promoting Healthy Lives',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_contact: 'Contact Support',
    footer_medical: 'Medical Disclaimer',

    // Landing Page
    landing_badge: 'NEURAL NETWORK DERMATOLOGY ENGINE',
    landing_hero_title: 'The Science of Perfect Skin,',
    landing_hero_subtitle: 'Decoded by Deep Learning',
    landing_hero_desc: "Experience the first AI-driven skincare companion that bridges the gap between clinical research and your daily routine. DermaAI uses advanced computer vision to understand your skin's unique cellular needs.",
    landing_try_scanner: 'Try the Scanner',
    landing_explore_tech: 'Explore Technology',
    landing_features_title: 'Designed for Your Journey',
    landing_features_desc: "DermaAI isn't just a scanner; it's a comprehensive platform for lifelong skin health management.",
    landing_problems_title: 'Why Guessing Fails',
    landing_problems_desc: 'The skincare industry relies on trial and error. We believe your skin deserves a more rigorous, evidence-based approach.',
    landing_roadmap_title: 'Your Clinical Roadmap',
    landing_roadmap_desc: 'Our three-step neural analysis transforms a simple smartphone capture into a data-rich dermatological assessment.',
    landing_encrypted: 'Encrypted Clinical Data',
    landing_cta_title: 'Ready for your healthiest skin ever?',
    landing_cta_desc: 'Join over 50,000 users who have transformed their skincare journey with precision data. Start your first clinical scan today.',
    landing_cta_note: 'Instant results. No subscription required for your first scan.',
    landing_analyze_btn: 'Analyze My Skin',
    landing_team_title: 'Meet Our Team',
    landing_team_desc: 'The specialized minds bridging the gap between advanced deep learning and your daily skincare routine.',

    // Features
    feat1_title: 'Skin Type Detection',
    feat1_desc: 'Stop guessing if you\'re "combination" or "sensitive." Our AI analyzes sebum levels and texture to provide an objective classification across 16 different dermatological profiles.',
    feat2_title: 'Ingredient Analysis',
    feat2_desc: 'Upload a product label to see if it\'s safe for your specific profile. We cross-reference ingredients against clinical contraindications to prevent breakouts before they happen.',
    feat3_title: 'Progress Tracking',
    feat3_desc: 'Visualize your improvement over time with side-by-side heatmaps. See exactly how your barrier health and clarity are improving with your new science-backed routine.',

    // Problems
    prob1_title: 'Hidden Reactivity',
    prob1_desc: "Standard products often contain ingredients that trigger micro-inflammation invisible to the naked eye until it's too late.",
    prob2_title: 'Chemical Conflict',
    prob2_desc: 'Many "viral" skincare trends combine actives that neutralize each other or cause long-term sensitivity when used incorrectly.',
    prob3_title: 'Barrier Fatigue',
    prob3_desc: "Without precise data, it's easy to over-treat your skin, leading to chronic dehydration and premature aging.",

    // Phases
    phase1: 'PHASE 01',
    phase1_title: 'Capture & Scan',
    phase1_desc: 'Use our intelligent viewfinder to secure a high-fidelity image in your environment.',
    phase2: 'PHASE 02',
    phase2_title: 'Neural Diagnostics',
    phase2_desc: 'Our proprietary model scans for over 40 specific markers, from pore congestion to elasticity.',
    phase3: 'PHASE 03',
    phase3_title: 'See Results',
    phase3_desc: 'Access your personalized dashboard with recommended formulations and a daily habit tracker.',

    // Login
    login_welcome: 'Welcome Back',
    login_subtitle: 'Access your personalized dermatological dashboard.',
    login_email: 'Email Address',
    login_password: 'Password',
    login_forgot: 'Forgot password?',
    login_remember: 'Keep me signed in for 30 days',
    login_btn: 'Sign In',
    login_or: 'Or continue with',
    login_no_account: "New to SkinSense?",
    login_create: 'Create an account',
    login_loading: 'Signing in...',

    // Register
    register_title: 'Create Account',
    register_subtitle: 'Start your personalized clinical skin journey today.',
    register_name: 'Full Name',
    register_email: 'Email Address',
    register_password: 'Password',
    register_confirm: 'Confirm Password',
    register_agree: 'I agree to the',
    register_terms: 'Term of Service',
    register_and: 'and',
    register_privacy: 'Privacy Policy',
    register_clinical: 'regarding clinical data usage.',
    register_btn: 'Register Now',
    register_or: 'Or continue with',
    register_have_account: 'Already have an account?',
    register_signin: 'Sign in',
    register_loading: 'Registering...',

    // Analysis
    analysis_upload: 'Upload Foto',
    analysis_camera: 'Gunakan Kamera',
    analysis_click: 'Click to upload',
    analysis_formats: 'Supported formats: JPEG, JPG, PNG, WEBP',
    analysis_change: 'Klik untuk ganti foto',
    analysis_camera_allow: 'Izinkan Akses Kamera pada Situs ini',
    analysis_camera_activate: 'AKTIFKAN KAMERA',
    analysis_tips_label: 'TIPS',
    analysis_tips_text: 'Untuk mendapatkan hasil analisis yang optimal, pastikan wajah terlihat jelas dengan pencahayaan yang baik serta tanpa penggunaan filter atau makeup berlebih.',
    analysis_btn: 'ANALISIS',
    analysis_loading: 'Menganalisis Kulit...',
    analysis_tips_title: 'Quick Check Skin',
    analysis_tips_subtitle: 'With Us!',
    tip1_title: 'Wajah',
    tip1_desc: 'Pastikan wajah Anda terlihat jelas tanpa tertutup objek apapun',
    tip2_title: 'Cahaya',
    tip2_desc: 'Gunakan pencahayaan yang cukup agar hasil analisis lebih akurat',
    tip3_title: 'Disclaimer',
    tip3_desc: 'Hasil analisis yang Anda dapatkan bisa berbeda tergantung kualitas foto',
  },

  id: {
    // Navbar
    nav_home: 'Beranda',
    nav_analysis: 'Analisis',
    nav_history: 'Riwayat',
    nav_profile: 'Profil',
    nav_signin: 'Masuk',
    nav_register: 'Daftar',
    nav_getstarted: 'Mulai',
    nav_signout: 'Keluar',
    nav_darkmode: 'Mode Gelap',
    nav_lightmode: 'Mode Terang',

    // Footer
    footer_copy: '© 2026 SkinSense AI. Mempromosikan Hidup Sehat',
    footer_privacy: 'Kebijakan Privasi',
    footer_terms: 'Syarat Layanan',
    footer_contact: 'Hubungi Dukungan',
    footer_medical: 'Disclaimer Medis',

    // Landing Page
    landing_badge: 'MESIN DERMATOLOGI JARINGAN NEURAL',
    landing_hero_title: 'Ilmu Kulit Sempurna,',
    landing_hero_subtitle: 'Didekode oleh Deep Learning',
    landing_hero_desc: 'Rasakan pendamping skincare berbasis AI pertama yang menjembatani kesenjangan antara riset klinis dan rutinitas harian Anda. SkinSense AI menggunakan computer vision canggih untuk memahami kebutuhan unik kulit Anda.',
    landing_try_scanner: 'Coba Scanner',
    landing_explore_tech: 'Jelajahi Teknologi',
    landing_features_title: 'Dirancang untuk Perjalanan Anda',
    landing_features_desc: 'SkinSense AI bukan sekadar scanner; ini adalah platform komprehensif untuk manajemen kesehatan kulit seumur hidup.',
    landing_problems_title: 'Mengapa Menebak Itu Gagal',
    landing_problems_desc: 'Industri skincare bergantung pada coba-coba. Kami percaya kulit Anda layak mendapat pendekatan yang lebih ketat dan berbasis bukti.',
    landing_roadmap_title: 'Peta Jalan Klinis Anda',
    landing_roadmap_desc: 'Analisis neural tiga langkah kami mengubah foto smartphone sederhana menjadi penilaian dermatologis yang kaya data.',
    landing_encrypted: 'Data Klinis Terenkripsi',
    landing_cta_title: 'Siap untuk kulit paling sehat Anda?',
    landing_cta_desc: 'Bergabunglah dengan lebih dari 50.000 pengguna yang telah mengubah perjalanan skincare mereka dengan data presisi. Mulai scan klinis pertama Anda hari ini.',
    landing_cta_note: 'Hasil instan. Tidak perlu langganan untuk scan pertama Anda.',
    landing_analyze_btn: 'Analisis Kulit Saya',
    landing_team_title: 'Kenali Tim Kami',
    landing_team_desc: 'Pikiran-pikiran terspesialisasi yang menjembatani kesenjangan antara deep learning canggih dan rutinitas skincare harian Anda.',

    // Features
    feat1_title: 'Deteksi Jenis Kulit',
    feat1_desc: 'Berhenti menebak apakah kulit Anda "kombinasi" atau "sensitif." AI kami menganalisis kadar sebum dan tekstur untuk memberikan klasifikasi objektif di 16 profil dermatologis.',
    feat2_title: 'Analisis Bahan',
    feat2_desc: 'Upload label produk untuk melihat apakah aman untuk profil spesifik Anda. Kami mencocokkan bahan dengan kontraindikasi klinis untuk mencegah jerawat sebelum terjadi.',
    feat3_title: 'Lacak Perkembangan',
    feat3_desc: 'Visualisasikan perbaikan Anda dari waktu ke waktu dengan heatmap berdampingan. Lihat persis bagaimana kesehatan barrier dan kejernihan kulit Anda meningkat.',

    // Problems
    prob1_title: 'Reaktivitas Tersembunyi',
    prob1_desc: 'Produk standar sering mengandung bahan yang memicu peradangan mikro yang tidak terlihat mata hingga terlambat.',
    prob2_title: 'Konflik Bahan Kimia',
    prob2_desc: 'Banyak tren skincare "viral" menggabungkan bahan aktif yang saling menetralkan atau menyebabkan sensitivitas jangka panjang.',
    prob3_title: 'Kelelahan Barrier',
    prob3_desc: 'Tanpa data yang tepat, mudah terjadi over-treatment kulit yang menyebabkan dehidrasi kronis dan penuaan dini.',

    // Phases
    phase1: 'FASE 01',
    phase1_title: 'Ambil & Pindai',
    phase1_desc: 'Gunakan viewfinder cerdas kami untuk mendapatkan gambar berkualitas tinggi di lingkungan Anda.',
    phase2: 'FASE 02',
    phase2_title: 'Diagnostik Neural',
    phase2_desc: 'Model kami memindai lebih dari 40 penanda spesifik, dari kemacetan pori hingga elastisitas.',
    phase3: 'FASE 03',
    phase3_title: 'Lihat Hasil',
    phase3_desc: 'Akses dashboard personal Anda dengan formulasi yang direkomendasikan dan pelacak kebiasaan harian.',

    // Login
    login_welcome: 'Selamat Datang Kembali',
    login_subtitle: 'Akses dashboard dermatologi personal Anda.',
    login_email: 'Alamat Email',
    login_password: 'Kata Sandi',
    login_forgot: 'Lupa kata sandi?',
    login_remember: 'Tetap masuk selama 30 hari',
    login_btn: 'Masuk',
    login_or: 'Atau lanjutkan dengan',
    login_no_account: 'Baru di SkinSense?',
    login_create: 'Buat akun',
    login_loading: 'Sedang masuk...',

    // Register
    register_title: 'Buat Akun',
    register_subtitle: 'Mulai perjalanan kulit klinis personal Anda hari ini.',
    register_name: 'Nama Lengkap',
    register_email: 'Alamat Email',
    register_password: 'Kata Sandi',
    register_confirm: 'Konfirmasi Kata Sandi',
    register_agree: 'Saya setuju dengan',
    register_terms: 'Syarat Layanan',
    register_and: 'dan',
    register_privacy: 'Kebijakan Privasi',
    register_clinical: 'terkait penggunaan data klinis.',
    register_btn: 'Daftar Sekarang',
    register_or: 'Atau lanjutkan dengan',
    register_have_account: 'Sudah punya akun?',
    register_signin: 'Masuk',
    register_loading: 'Mendaftarkan...',

    // Analysis
    analysis_upload: 'Upload Foto',
    analysis_camera: 'Gunakan Kamera',
    analysis_click: 'Klik untuk upload',
    analysis_formats: 'Format didukung: JPEG, JPG, PNG, WEBP',
    analysis_change: 'Klik untuk ganti foto',
    analysis_camera_allow: 'Izinkan Akses Kamera pada Situs ini',
    analysis_camera_activate: 'AKTIFKAN KAMERA',
    analysis_tips_label: 'TIPS',
    analysis_tips_text: 'Untuk mendapatkan hasil analisis yang optimal, pastikan wajah terlihat jelas dengan pencahayaan yang baik serta tanpa penggunaan filter atau makeup berlebih.',
    analysis_btn: 'ANALISIS',
    analysis_loading: 'Menganalisis Kulit...',
    analysis_tips_title: 'Cek Kulit Cepat',
    analysis_tips_subtitle: 'Bersama Kami!',
    tip1_title: 'Wajah',
    tip1_desc: 'Pastikan wajah Anda terlihat jelas tanpa tertutup objek apapun',
    tip2_title: 'Cahaya',
    tip2_desc: 'Gunakan pencahayaan yang cukup agar hasil analisis lebih akurat',
    tip3_title: 'Disclaimer',
    tip3_desc: 'Hasil analisis yang Anda dapatkan bisa berbeda tergantung kualitas foto',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id');
  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
