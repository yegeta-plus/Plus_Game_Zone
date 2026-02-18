
import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Gamepad2, 
  TrendingUp, 
  Maximize, 
  Scan, 
  PlusCircle, 
  AlertCircle,
  Triangle,
  Square,
  Circle,
  X as CloseIcon
} from 'lucide-react';

interface JoystickMenuProps {
  onAction: (action: 'ADD_SALES' | 'ADD_EXPENSE' | 'AI_INSIGHT' | 'SCAN') => void;
}

const JoystickMenu: React.FC<JoystickMenuProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttons = [
    { 
      id: 'ADD_SALES', 
      label: 'Sales', 
      icon: <Triangle className="w-5 h-5 sm:w-6 sm:h-6 fill-emerald-500 text-emerald-500" />, 
      color: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500',
      pos: 'bottom-[120px] right-0 sm:bottom-[130px] sm:right-0',
      action: 'ADD_SALES' as const
    },
    { 
      id: 'SCAN', 
      label: 'Scan', 
      icon: <Circle className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-500 text-rose-500" />, 
      color: 'bg-rose-500/10 border-rose-500/50 text-rose-500',
      pos: 'bottom-[60px] right-[100px] sm:bottom-[70px] sm:right-[110px]',
      action: 'SCAN' as const
    },
    { 
      id: 'ADD_EXPENSE', 
      label: 'Cost', 
      icon: <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 stroke-[4px]" />, 
      color: 'bg-indigo-500/10 border-indigo-500/50 text-indigo-500',
      pos: 'bottom-0 right-[120px] sm:bottom-0 sm:right-[130px]',
      action: 'ADD_EXPENSE' as const
    },
    { 
      id: 'AI_INSIGHT', 
      label: 'Intel', 
      icon: <Square className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-500 text-amber-500" />, 
      color: 'bg-amber-500/10 border-amber-500/50 text-amber-500',
      pos: 'bottom-[100px] right-[70px] sm:bottom-[110px] sm:right-[80px]',
      action: 'AI_INSIGHT' as const
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[600] pointer-events-none">
      <div className="relative w-40 h-40 sm:w-52 sm:h-52">
        {/* Expanded Buttons */}
        {buttons.map((btn, idx) => (
          <button
            key={btn.id}
            onClick={() => {
              onAction(btn.action);
              setIsOpen(false);
            }}
            className={`
              absolute pointer-events-auto
              flex flex-col items-center justify-center
              w-14 h-14 sm:w-16 sm:h-16 rounded-full border backdrop-blur-md shadow-2xl
              transition-all duration-500 ease-out
              ${btn.color}
              ${isOpen ? `${btn.pos} opacity-100 scale-100 rotate-0` : 'bottom-0 right-0 opacity-0 scale-50 rotate-90'}
              hover:scale-110 active:scale-90 group
            `}
            style={{ transitionDelay: isOpen ? `${idx * 40}ms` : '0ms' }}
          >
            <div className="relative">
              {btn.icon}
              <div className="absolute inset-0 blur-md opacity-30 group-hover:opacity-100 transition-opacity">
                {btn.icon}
              </div>
            </div>
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest mt-1 group-hover:scale-110 transition-transform">{btn.label}</span>
          </button>
        ))}

        {/* Main Joystick Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            absolute bottom-0 right-0 pointer-events-auto
            w-16 h-16 sm:w-20 sm:h-20 rounded-full
            bg-slate-900 border-2 border-white/20
            shadow-[0_0_30px_rgba(99,102,241,0.4)]
            flex items-center justify-center
            transition-all duration-500
            ${isOpen ? 'rotate-45 scale-90' : 'rotate-0 scale-100'}
            hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]
            active:scale-95
            overflow-hidden group
          `}
        >
          {/* Internal Glow Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(99,102,241,0.4)_0%,_transparent_70%)]" />
          
          <div className="relative z-10 flex items-center justify-center">
             <Plus 
               size={32} 
               className={`text-white transition-all duration-500 sm:w-10 sm:h-10 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} 
             />
             <div className={`absolute transition-all duration-500 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                <Gamepad2 size={28} className="text-indigo-400 animate-pulse sm:w-8 sm:h-8" />
             </div>
          </div>

          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40 pointer-events-none" />
        </button>
      </div>

      {/* Screen Dimmer when open */}
      <div 
        className={`fixed inset-0 bg-slate-950/40 backdrop-blur-sm -z-10 transition-opacity duration-500 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
};

export default JoystickMenu;
