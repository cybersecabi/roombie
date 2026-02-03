import React from 'react';

interface FantasticFourImageProps {
  size?: 'sm' | 'md' | 'lg';
}

export const FantasticFourImage: React.FC<FantasticFourImageProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-48 h-32',
    md: 'w-64 h-40',
    lg: 'w-80 h-48'
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto mb-6 relative`}>
      <svg
        viewBox="0 0 320 200"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="50%" stopColor="#E0F6FF" />
            <stop offset="100%" stopColor="#FFE4B5" />
          </linearGradient>
          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#90EE90" />
            <stop offset="100%" stopColor="#228B22" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="320" height="200" fill="url(#skyGradient)" rx="16" />

        {/* Clouds */}
        <g fill="white" opacity="0.8">
          <ellipse cx="60" cy="40" rx="25" ry="15" />
          <ellipse cx="80" cy="45" rx="20" ry="12" />
          <ellipse cx="40" cy="45" rx="18" ry="10" />
          
          <ellipse cx="250" cy="35" rx="30" ry="18" />
          <ellipse cx="275" cy="40" rx="22" ry="14" />
          <ellipse cx="225" cy="42" rx="20" ry="12" />
        </g>

        {/* Sun */}
        <circle cx="280" cy="50" r="20" fill="#FFD700">
          <animate attributeName="r" values="20;22;20" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.8;1" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Sun rays */}
        <g stroke="#FFD700" strokeWidth="3" strokeLinecap="round">
          <line x1="280" y1="20" x2="280" y2="10">
            <animate attributeName="y2" values="10;5;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="280" y1="80" x2="280" y2="90">
            <animate attributeName="y2" values="90;95;90" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="250" y1="50" x2="240" y2="50">
            <animate attributeName="x2" values="240;235;240" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="310" y1="50" x2="320" y2="50">
            <animate attributeName="x2" values="320;325;320" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="258" y1="28" x2="250" y2="20">
            <animate attributeName="x2" values="250;245;250" dur="2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="20;15;20" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="302" y1="28" x2="310" y2="20">
            <animate attributeName="x2" values="310;315;310" dur="2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="20;15;20" dur="2s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Ground */}
        <path d="M0 140 Q80 130 160 135 Q240 140 320 130 L320 200 L0 200 Z" fill="url(#groundGradient)" />

        {/* Building silhouette (Baxter Building style) */}
        <rect x="220" y="70" width="60" height="70" fill="#4A5568" opacity="0.6" />
        <rect x="225" y="75" width="12" height="12" fill="#CBD5E0" opacity="0.5" />
        <rect x="245" y="75" width="12" height="12" fill="#CBD5E0" opacity="0.5" />
        <rect x="265" y="75" width="12" height="12" fill="#CBD5E0" opacity="0.5" />
        <rect x="225" y="95" width="12" height="12" fill="#CBD5E0" opacity="0.5" />
        <rect x="245" y="95" width="12" height="12" fill="#CBD5E0" opacity="0.5" />
        <rect x="265" y="95" width="12" height="12" fill="#CBD5E0" opacity="0.5" />

        {/* Mr. Fantastic (Reed Richards) - Blue suit, stretching arm */}
        <g filter="url(#shadow)">
          {/* Body */}
          <ellipse cx="80" cy="115" rx="18" ry="28" fill="#1E3A8A" />
          {/* Head */}
          <circle cx="80" cy="82" r="14" fill="#FDBA74" />
          {/* Hair */}
          <path d="M68 75 Q80 65 92 75" stroke="#4B5563" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Eyes */}
          <ellipse cx="76" cy="82" rx="3" ry="4" fill="white" />
          <ellipse cx="84" cy="82" rx="3" ry="4" fill="white" />
          <circle cx="77" cy="82" r="1.5" fill="#1F2937" />
          <circle cx="85" cy="82" r="1.5" fill="#1F2937" />
          {/* Glasses */}
          <rect x="72" y="78" width="8" height="8" rx="2" stroke="#374151" strokeWidth="1" fill="none" />
          <rect x="80" y="78" width="8" height="8" rx="2" stroke="#374151" strokeWidth="1" fill="none" />
          <line x1="80" y1="82" x2="80" y2="82" stroke="#374151" strokeWidth="1" />
          {/* Stretching arm (animated) */}
          <path d="M95 110 Q130 100 160 95" stroke="#1E3A8A" strokeWidth="10" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M95 110 Q130 100 160 95;M95 110 Q140 110 170 105;M95 110 Q130 100 160 95" dur="2s" repeatCount="indefinite" />
          </path>
          {/* Hand at end of stretch */}
          <circle cx="160" cy="95" r="8" fill="#FDBA74">
            <animate attributeName="cx" values="160;170;160" dur="2s" repeatCount="indefinite" />
            <animate attributeName="cy" values="95;105;95" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Invisible Woman (Sue Storm) - Making force field */}
        <g filter="url(#shadow)">
          {/* Force field (invisible effect) */}
          <ellipse cx="130" cy="100" rx="25" ry="35" fill="#A7F3D0" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
            <animate attributeName="rx" values="25;28;25" dur="2s" repeatCount="indefinite" />
          </ellipse>
          {/* Body */}
          <ellipse cx="130" cy="115" rx="15" ry="26" fill="#1E3A8A" />
          {/* Head */}
          <circle cx="130" cy="85" r="12" fill="#FDBA74" />
          {/* Hair */}
          <ellipse cx="130" cy="78" rx="14" ry="8" fill="#FDE047" />
          {/* Eyes */}
          <ellipse cx="127" cy="85" rx="2.5" ry="3.5" fill="white" />
          <ellipse cx="133" cy="85" rx="2.5" ry="3.5" fill="white" />
          <circle cx="128" cy="85" r="1.5" fill="#1F2937" />
          <circle cx="134" cy="85" r="1.5" fill="#1F2937" />
          {/* Blonde hair flowing */}
          <path d="M118 78 Q115 90 118 100" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M118 78 Q115 90 118 100;M118 78 Q112 90 115 100;M118 78 Q115 90 118 100" dur="1.5s" repeatCount="indefinite" />
          </path>
          <path d="M142 78 Q145 90 142 100" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M142 78 Q145 90 142 100;M142 78 Q148 90 145 100;M142 78 Q145 90 142 100" dur="1.5s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Human Torch (Johnny Storm) - Flying with flames */}
        <g filter="url(#shadow)">
          {/* Flame trail */}
          <g opacity="0.7">
            <ellipse cx="185" cy="70" rx="15" ry="8" fill="#EF4444">
              <animate attributeName="rx" values="15;20;15" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.4;0.7" dur="0.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="175" cy="65" rx="12" ry="6" fill="#F97316">
              <animate attributeName="rx" values="12;16;12" dur="0.6s" repeatCount="indefinite" begin="0.1s" />
            </ellipse>
            <ellipse cx="165" cy="60" rx="10" ry="5" fill="#FBBF24">
              <animate attributeName="rx" values="10;13;10" dur="0.7s" repeatCount="indefinite" begin="0.2s" />
            </ellipse>
          </g>
          {/* Body on fire */}
          <ellipse cx="195" cy="55" rx="14" ry="20" fill="#DC2626">
            <animate attributeName="fill" values="#DC2626;#EF4444;#DC2626" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          {/* Head with flames */}
          <circle cx="195" cy="35" r="12" fill="#FDBA74" />
          {/* Hair as flames */}
          <g>
            <ellipse cx="195" cy="28" rx="12" ry="6" fill="#FBBF24">
              <animate attributeName="ry" values="6;10;6" dur="0.2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="188" cy="25" rx="5" ry="8" fill="#F97316">
              <animate attributeName="ry" values="8;12;8" dur="0.25s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="202" cy="25" rx="5" ry="8" fill="#F97316">
              <animate attributeName="ry" values="8;12;8" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
          </g>
          {/* Eyes */}
          <ellipse cx="192" cy="36" rx="3" ry="4" fill="white" />
          <ellipse cx="198" cy="36" rx="3" ry="4" fill="white" />
          <circle cx="193" cy="36" r="1.5" fill="#1F2937" />
          <circle cx="199" cy="36" r="1.5" fill="#1F2937" />
          {/* Flame on chest */}
          <circle cx="195" cy="52" r="5" fill="#FBBF24" opacity="0.8">
            <animate attributeName="r" values="5;7;5" dur="0.4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* The Thing (Ben Grimm) - Strong pose */}
        <g filter="url(#shadow)">
          {/* Large rocky body */}
          <ellipse cx="250" cy="115" rx="35" ry="40" fill="#B45309" />
          {/* Rock texture */}
          <circle cx="235" cy="100" r="6" fill="#92400E" opacity="0.5" />
          <circle cx="260" cy="95" r="5" fill="#92400E" opacity="0.5" />
          <circle cx="245" cy="125" r="7" fill="#92400E" opacity="0.5" />
          <circle cx="265" cy="120" r="5" fill="#92400E" opacity="0.5" />
          <circle cx="255" cy="140" r="6" fill="#92400E" opacity="0.5" />
          {/* Head */}
          <path d="M235 75 Q250 65 265 75 L265 90 Q250 100 235 90 Z" fill="#B45309" />
          {/* Rock brow */}
          <path d="M238 78 Q250 74 262 78" stroke="#92400E" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Eyes */}
          <ellipse cx="245" cy="83" rx="3" ry="4" fill="white" />
          <ellipse cx="255" cy="83" rx="3" ry="4" fill="white" />
          <circle cx="246" cy="83" r="1.5" fill="#1F2937" />
          <circle cx="256" cy="83" r="1.5" fill="#1F2937" />
          {/* Strong arms raised */}
          <path d="M215 100 L200 80" stroke="#B45309" strokeWidth="12" strokeLinecap="round">
            <animate attributeName="d" values="M215 100 L200 80;M215 100 L195 75;M215 100 L200 80" dur="1s" repeatCount="indefinite" />
          </path>
          <circle cx="195" cy="75" r="10" fill="#B45309">
            <animate attributeName="cy" values="75;70;75" dur="1s" repeatCount="indefinite" />
          </circle>
          <path d="M285 100 L300 80" stroke="#B45309" strokeWidth="12" strokeLinecap="round">
            <animate attributeName="d" values="M285 100 L300 80;M285 100 L305 75;M285 100 L300 80" dur="1s" repeatCount="indefinite" />
          </path>
          <circle cx="305" cy="75" r="10" fill="#B45309">
            <animate attributeName="cy" values="75;70;75" dur="1s" repeatCount="indefinite" />
          </circle>
        </g>

      </svg>
    </div>
  );
};
