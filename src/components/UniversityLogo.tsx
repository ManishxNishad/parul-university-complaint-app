import React from 'react';
import { useTheme } from '../theme';

interface UniversityLogoProps {
  variant?: 'light' | 'dark' | 'drawer' | 'compact';
  subtitle?: string;
  className?: string;
  shieldPrimary?: string;
  shieldSecondary?: string;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  variant = 'light',
  subtitle,
  className = '',
  shieldPrimary,
  shieldSecondary,
}) => {
  const { theme } = useTheme();
  const isDark = variant === 'dark' || variant === 'drawer';

  const primaryShield = shieldPrimary || theme.colors.crestShieldPrimary;
  const secondaryShield = shieldSecondary || theme.colors.crestShieldSecondary;

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* University Crest / Emblem */}
      <div className="relative mb-2 flex items-center justify-center">
        <svg
          className="w-14 h-14 drop-shadow-md"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Outer Ring */}
          <path
            d="M50 5 L85 20 V52 C85 75 50 95 50 95 C50 95 15 75 15 52 V20 L50 5 Z"
            fill={secondaryShield}
            stroke="#FDE68A"
            strokeWidth="3"
          />
          {/* Inner Shield Body */}
          <path
            d="M50 10 L80 23 V50 C80 70 50 88 50 88 C50 88 20 70 20 50 V23 L50 10 Z"
            fill={primaryShield}
          />
          {/* Central Heraldic Elements */}
          {/* Crown */}
          <path
            d="M36 28 L42 34 L50 24 L58 34 L64 28 L62 40 H38 L36 28 Z"
            fill="#FBBF24"
            stroke="#78350F"
            strokeWidth="1"
          />
          {/* Open Book of Knowledge */}
          <path
            d="M35 48 C42 46 47 48 50 52 C53 48 58 46 65 48 V65 C58 63 53 65 50 69 C47 65 42 63 35 65 V48 Z"
            fill="#FEF3C7"
            stroke="#92400E"
            strokeWidth="1.5"
          />
          {/* Torch of Enlightenment */}
          <path
            d="M48 64 H52 V78 H48 Z"
            fill="#F59E0B"
          />
          <path
            d="M50 58 C47 61 45 64 50 67 C55 64 53 61 50 58 Z"
            fill="#EF4444"
          />
          {/* Stars */}
          <circle cx="28" cy="40" r="2.5" fill="#FDE68A" />
          <circle cx="72" cy="40" r="2.5" fill="#FDE68A" />
          <circle cx="30" cy="58" r="2" fill="#FDE68A" />
          <circle cx="70" cy="58" r="2" fill="#FDE68A" />
        </svg>
      </div>

      {/* University Typography */}
      <div className="leading-tight">
        <h1
          className={`font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          } ${variant === 'compact' ? 'text-lg' : 'text-2xl sm:text-3xl'}`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          Parul
          <span className="block text-xl sm:text-2xl font-semibold -mt-1">
            University
          </span>
        </h1>

        {subtitle && (
          <p
            className={`mt-1.5 text-xs sm:text-sm font-medium tracking-wide ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
