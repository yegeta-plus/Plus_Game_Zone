
import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const containerSizes = {
    sm: 'w-16 h-10',
    md: 'w-32 h-20',
    lg: 'w-48 h-30',
    xl: 'w-80 h-50'
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`${containerSizes[size]} relative flex items-center justify-center select-none group ${className}`}>
      
      {/* Outer Halo Glow */}
      <div className="absolute inset-[-10%] rounded-full bg-indigo-500/20 blur-2xl group-hover:bg-indigo-400/40 transition-all duration-700 opacity-60" />

      {/* Main Oval Body - PS Button Aesthetic */}
      <div className="absolute inset-0 rounded-full bg-slate-900 border-[1.5px] border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.05)] overflow-hidden transition-transform duration-500 group-hover:scale-105">
        
        {/* Internal Gradient Mesh for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(99,102,241,0.15)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_rgba(0,0,0,0.4)_0%,_transparent_50%)]" />
        
        {/* Glossy Overlay Reflection */}
        <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent rounded-t-full" />
      </div>

      {/* High-Fidelity SVG Neon Ring */}
      <svg viewBox="0 0 160 100" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <defs>
          <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        
        {/* Secondary Inner Glow Ring */}
        <ellipse 
          cx="80" cy="50" rx="77" ry="47" 
          fill="none" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="0.5"
        />

        {/* Animated Segmented Neon Ring */}
        <ellipse 
          cx="80" cy="50" rx="78" ry="48" 
          fill="none" 
          stroke="url(#neonGradient)" 
          strokeWidth="2.5" 
          strokeDasharray="50 150"
          filter="url(#neonBlur)"
          className="animate-[spin_10s_linear_infinite] opacity-90"
          style={{ transformOrigin: '50px 50px' }}
        />
      </svg>

      {/* Typography Node */}
      <div className="relative z-10 flex flex-col items-center">
        <span className={`
          ${textSizes[size]} 
          font-black italic uppercase tracking-[0.2em]
          text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400
          drop-shadow-[0_0_12px_rgba(99,102,241,0.8)]
          transition-all duration-300
          group-hover:tracking-[0.3em]
          pointer-events-none
        `}
        style={{
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          Plus
        </span>
        
        {/* Dynamic Accented Underline */}
        <div className={`
          h-1 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 
          ${size === 'xl' ? 'w-40 mt-3' : size === 'lg' ? 'w-24 mt-2' : 'w-12 mt-1'} 
          shadow-[0_0_15px_rgba(99,102,241,0.6)]
          transition-all duration-500
          group-hover:w-full
        `} />
      </div>
    </div>
  );
};

export default BrandLogo;
