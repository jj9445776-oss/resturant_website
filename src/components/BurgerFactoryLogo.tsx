import React from 'react';

interface BurgerFactoryLogoProps {
  variant?: 'light' | 'dark' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BurgerFactoryLogo: React.FC<BurgerFactoryLogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
}) => {
  const textColor = variant === 'dark' ? 'text-[#0f0f12]' : 'text-white';
  const subColor = variant === 'dark' ? 'text-[#6b7280]' : 'text-[#f59e0b]';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base tracking-wider',
    md: 'text-xl tracking-wider',
    lg: 'text-3xl tracking-widest',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Exact stacked burger icon matching the screenshot */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full text-[#f59e0b]" xmlns="http://www.w3.org/2000/svg">
          {/* Top Bun */}
          <path
            d="M8 20C8 13.3726 13.3726 8 20 8H28C34.6274 8 40 13.3726 40 20C40 21.1046 39.1046 22 38 22H10C8.89543 22 8 21.1046 8 20Z"
            fill="#f59e0b"
          />
          {/* Sesame seeds */}
          <ellipse cx="18" cy="13" rx="1.5" ry="0.8" fill="#121217" />
          <ellipse cx="28" cy="13" rx="1.5" ry="0.8" fill="#121217" />
          <ellipse cx="23" cy="16.5" rx="1.5" ry="0.8" fill="#121217" />

          {/* Cheese slice droop */}
          <path
            d="M6 25L24 29L42 25L38 27L24 31L10 27L6 25Z"
            fill="#fbbf24"
          />

          {/* Meat Patty */}
          <rect x="7" y="29" width="34" height="6" rx="3" fill="#f59e0b" />

          {/* Bottom Bun */}
          <path
            d="M8 38C8 36.8954 8.89543 36 10 36H38C39.1046 36 40 36.8954 40 38C40 41.3137 37.3137 44 34 44H14C10.6863 44 8 41.3137 8 38Z"
            fill="#f59e0b"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight text-left">
        <span className={`font-display font-bold uppercase ${textColor} ${textSizes[size]} leading-none`}>
          BURGER FACTORY
        </span>
        {showSubtitle && (
          <span className={`text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase ${subColor} mt-0.5`}>
            • EST. 2016 •
          </span>
        )}
      </div>
    </div>
  );
};
