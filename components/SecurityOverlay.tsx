
import React, { useState } from 'react';
import { Lock, ShieldCheck, ChevronRight } from 'lucide-react';

interface SecurityOverlayProps {
  onUnlock: (pin: string) => void;
  error?: string;
}

const SecurityOverlay: React.FC<SecurityOverlayProps> = ({ onUnlock, error }) => {
  const [pin, setPin] = useState('');

  const handleNumClick = (num: string) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleClear = () => setPin('');

  const handleConfirm = () => {
    if (pin.length === 4) onUnlock(pin);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900 dark:bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 mb-10">
          <Lock size={48} />
        </div>
        
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Vault Locked</h2>
        <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mb-10">Security Authentication Required</p>

        <div className="flex gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                pin.length > i ? 'bg-indigo-500 border-indigo-500 scale-125' : 'border-slate-700 dark:border-slate-800'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-rose-500 text-xs font-black uppercase mb-8 animate-bounce">{error}</p>}

        <div className="grid grid-cols-3 gap-6 w-full mb-12">
          {['1','2','3','4','5','6','7','8','9','C','0','OK'].map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'C') handleClear();
                else if (btn === 'OK') handleConfirm();
                else handleNumClick(btn);
              }}
              className={`h-20 rounded-3xl text-2xl font-black transition-all active:scale-90 ${
                btn === 'OK' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 
                btn === 'C' ? 'bg-slate-800 dark:bg-slate-900 text-slate-400' : 'bg-slate-800 dark:bg-slate-900 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-600">
          <ShieldCheck size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Local Persistence</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityOverlay;
