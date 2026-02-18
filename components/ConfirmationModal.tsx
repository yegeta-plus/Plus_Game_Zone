
import React from 'react';
import { AlertTriangle, Trash2, Edit3, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  type?: 'danger' | 'warning';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = 'Confirm',
  type = 'danger' 
}) => {
  if (!isOpen) return null;

  const isDanger = type === 'danger';

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border dark:border-white/5">
        <div className="p-8 text-center">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 ${
            isDanger 
            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' 
            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }`}>
            {isDanger ? <Trash2 size={40} /> : <AlertTriangle size={40} />}
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-4">
            {message}
          </p>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 flex gap-4 border-t dark:border-white/5">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl dark:shadow-none transition-all active:scale-95 ${
              isDanger ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-100'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
