import { useEffect, useRef } from 'react';
import { useLang } from '../context/LanguageContext';

export default function FaceScanHero() {
  const scanRef = useRef(null);
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    let pos = -130;
    let dir = 1;
    const interval = setInterval(() => {
      pos += dir * 1.2;
      if (pos >= 130) dir = -1;
      if (pos <= -130) dir = 1;
      if (scanRef.current) {
        scanRef.current.style.transform = `translateY(${pos}px)`;
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[460px]">

      {/* Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-100 dark:bg-blue-900/20 opacity-60"
        style={{ filter: 'blur(48px)' }} />

      {/* Ring orbits */}
      <div
        className="absolute w-80 h-80 rounded-full border border-dashed border-blue-200 dark:border-blue-800"
        style={{ animation: 'spin 12s linear infinite' }}
      />
      <div
        className="absolute w-[26rem] h-[26rem] rounded-full border border-dashed border-indigo-100 dark:border-indigo-900"
        style={{ animation: 'spin 20s linear infinite reverse' }}
      />

      {/* Face wrapper */}
      <div
        className="relative w-60 h-80"
        style={{ animation: 'float 4s ease-in-out infinite' }}
      >
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-blue-500 opacity-80 z-10" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-blue-500 opacity-80 z-10" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-blue-500 opacity-80 z-10" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-blue-500 opacity-80 z-10" />

        {/* SVG: foto + efek overlay */}
        <svg
          viewBox="0 0 260 320"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Clip oval untuk foto */}
            <clipPath id="faceClip">
              <ellipse cx="130" cy="155" rx="115" ry="148" />
            </clipPath>
          </defs>

          {/* ✅ Foto asli */}
          <image
            href="/images/face-model.jpg"
            x="-10" y="0"
            width="280" height="320"
            clipPath="url(#faceClip)"
            preserveAspectRatio="xMidYMid slice"
          />

          {/* Mesh dots overlay di atas foto */}
          <g fill="rgba(59,130,246,0.30)" clipPath="url(#faceClip)">
            <circle cx="70"  cy="110" r="1.5"/><circle cx="90"  cy="95"  r="1.5"/>
            <circle cx="112" cy="88"  r="1.5"/><circle cx="130" cy="85"  r="1.5"/>
            <circle cx="148" cy="88"  r="1.5"/><circle cx="170" cy="95"  r="1.5"/>
            <circle cx="188" cy="110" r="1.5"/><circle cx="65"  cy="135" r="1.5"/>
            <circle cx="85"  cy="148" r="1.5"/><circle cx="108" cy="155" r="1.5"/>
            <circle cx="130" cy="158" r="1.5"/><circle cx="152" cy="155" r="1.5"/>
            <circle cx="175" cy="148" r="1.5"/><circle cx="193" cy="135" r="1.5"/>
            <circle cx="72"  cy="170" r="1.5"/><circle cx="95"  cy="183" r="1.5"/>
            <circle cx="118" cy="195" r="1.5"/><circle cx="142" cy="195" r="1.5"/>
            <circle cx="165" cy="183" r="1.5"/><circle cx="186" cy="170" r="1.5"/>
            <circle cx="88"  cy="215" r="1.5"/><circle cx="130" cy="225" r="1.5"/>
            <circle cx="172" cy="215" r="1.5"/>
          </g>

          {/* Thin grid lines overlay */}
          <g stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" clipPath="url(#faceClip)">
            <line x1="15" y1="107" x2="245" y2="107"/>
            <line x1="15" y1="145" x2="245" y2="145"/>
            <line x1="15" y1="183" x2="245" y2="183"/>
            <line x1="15" y1="221" x2="245" y2="221"/>
            <line x1="65"  y1="15" x2="65"  y2="305"/>
            <line x1="108" y1="15" x2="108" y2="305"/>
            <line x1="152" y1="15" x2="152" y2="305"/>
            <line x1="195" y1="15" x2="195" y2="305"/>
          </g>

          {/* Eye ring pulse — mata kiri */}
          <circle cx="88" cy="128" r="4" fill="none" stroke="#3b82f6" strokeWidth="1">
            <animate attributeName="r" values="4;10;4" dur="2.2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2.2s" repeatCount="indefinite"/>
          </circle>

          {/* Eye ring pulse — mata kanan */}
          <circle cx="172" cy="128" r="4" fill="none" stroke="#3b82f6" strokeWidth="1">
            <animate attributeName="r" values="4;10;4" dur="2.2s" begin="0.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2.2s" begin="0.4s" repeatCount="indefinite"/>
          </circle>

          {/* Nose bridge dot */}
          <circle cx="130" cy="185" r="3" fill="none" stroke="#60a5fa" strokeWidth="1">
            <animate attributeName="r" values="3;6;3" dur="3s" begin="0.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" begin="0.8s" repeatCount="indefinite"/>
          </circle>

          {/* Subtle blue tint overlay */}
          <ellipse cx="130" cy="155" rx="115" ry="148"
            fill="rgba(59,130,246,0.04)" />
        </svg>

        {/* Scan line */}
        <div
          ref={scanRef}
          className="absolute left-0 right-0 h-0.5 z-10 pointer-events-none"
          style={{
            top: '50%',
            background: 'linear-gradient(90deg, transparent, #3b82f6, #93c5fd, #3b82f6, transparent)',
            boxShadow: '0 0 10px #3b82f6, 0 0 2px #93c5fd',
          }}
        />
      </div>

      {/* Analysis tags */}
      {/* Tag 1: AI Confidence — kiri atas */}
<div className="absolute left-2 top-16 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2 shadow-sm">
  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
  <span className="text-gray-500 dark:text-gray-400">{t('analysis_text1')}</span>
  <span className="font-semibold text-gray-800 dark:text-white">{t('analysis_subtext1')}</span>
</div>

{/* Tag 2: Skin Type — kanan atas */}
<div className="absolute right-0 top-29 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2 shadow-sm">
  <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
  <span className="text-gray-500 dark:text-gray-400">{t('analysis_text2')}</span>
  <span className="font-semibold text-gray-800 dark:text-white">{t('analysis_subtext2')}</span>
</div>

{/* Tag 3: Bahan Aktif — bawah tengah, animasi pulse */}
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2 shadow-sm">
  <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"
    style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
  <span className="text-gray-500 dark:text-gray-400">{t('analysis_text3')}</span>
  <span className="font-semibold text-blue-600 dark:text-blue-400">{t('analysis_subtext3')}</span>
</div>
    </div>
  );
}