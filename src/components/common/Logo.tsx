import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`} id="nexora-brand-logo">
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <div className="w-full h-full bg-black rounded-lg flex items-center justify-center font-black italic text-white shadow-md">
          N
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight text-black ${textSizes[size]}`}>
            NEXORA
          </span>
          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-zinc-800 tracking-wider">
            PORTAL
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-zinc-500 font-medium tracking-tight">
            Banking Without Borders
          </span>
        )}
      </div>
    </div>
  );
};

