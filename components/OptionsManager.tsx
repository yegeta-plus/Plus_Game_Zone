import React, { useState, useMemo } from 'react';
import { 
  Handshake, 
  Plus, 
  Info, 
  CheckCircle, 
  Trash2, 
  Edit, 
  Search, 
  Calculator, 
  Zap,
  TrendingUp,
  CircleDollarSign
} from 'lucide-react';
import { Investment } from '../types';

interface OptionsManagerProps {
  investments: Investment[];
  onAddInvestment: () => void;
  onEditInvestment?: (inv: Investment) => void;
  onRemoveInvestment: (id: string) => void;
  isAdmin?: boolean;
}

const OptionsManager: React.FC<OptionsManagerProps> = ({ 
  investments, 
  onAddInvestment, 
  onEditInvestment,
  onRemoveInvestment,
  isAdmin 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return investments.filter(inv => 
      inv.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.terms.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [investments, searchTerm]);

  const totalCapital = useMemo(() => {
    return investments.reduce((sum, inv) => sum + inv.amount, 0);
  }, [investments]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="text-left">
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Investment Portfolio</h3>
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">Strategic capital injections and partner equity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-10 rounded-[2.5rem] bg-emerald-600 dark:bg-emerald-700 border border-emerald-500 dark:border-white/5 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2 text-left text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
             <Calculator size={180} />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-10">
            <div>
              <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Total Injected Capital</p>
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-black tabular-nums">{totalCapital.toLocaleString()}</span>
                <span className="text-xl font-bold opacity-60">ETB</span>
              </div>
            </div>
            <div className="h-24 w-px bg-white/10 hidden sm:block" />
            <div className="text-center sm:text-left">
              <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest mb-1">Portfolio Count</p>
              <p className="text-3xl font-black text-white">{investments.length} <span className="text-xs font-bold opacity-40">ACTIVE</span></p>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-white/5 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <TrendingUp size={140} />
          </div>
          <div className="relative z-10 text-left">
            <div className="bg-white/20 p-2 rounded-xl w-fit mb-4">
              <CircleDollarSign size={24} />
            </div>
            <h4 className="text-xl font-black mb-1">Zero Interest</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Managing capital from partners or relatives without traditional interest burdens.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by investor name or terms..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button 
              onClick={onAddInvestment}
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95 uppercase tracking-widest"
            >
              <Plus size={18} />
              Partner
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {filtered.map((inv) => (
            <div key={inv.id} className="bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 p-8 group/card relative hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all shadow-sm text-left text-left text-left">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100 dark:shadow-none">
                  <Handshake size={24} />
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => onEditInvestment?.(inv)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onRemoveInvestment(inv.id)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{inv.investorName}</h4>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">{inv.returnType.replace('_', ' ')}</p>
                
                <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums mb-6">
                  {inv.amount.toLocaleString()} 
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-600 ml-2">ETB</span>
                </p>

                <div className="p-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl mb-6">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Info size={14} />
                    Investment Terms
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                    "{inv.terms}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{new Date(inv.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                    <CheckCircle size={16} />
                    Capital Verified
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-40 text-center text-slate-400 dark:text-slate-700">
              <Handshake size={64} className="mx-auto opacity-10 mb-6 dark:text-white" />
              <p className="font-black text-xl text-slate-900 dark:text-white">No capital records found</p>
              <p className="text-sm font-medium mt-1 dark:text-slate-500">Start by adding your first investment partner.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionsManager;