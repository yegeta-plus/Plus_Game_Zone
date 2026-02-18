
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  Smartphone,
  Banknote,
  Building2,
  FileText,
  Trash2,
  Edit2,
  ChevronDown,
  XCircle,
  Calculator,
  Zap,
  MoreVertical
} from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod, UserRole, ExpenseCategory } from '../types';

interface TransactionListProps {
  type: TransactionType;
  transactions: Transaction[];
  onAdd: () => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  userRole?: UserRole;
}

const TransactionList: React.FC<TransactionListProps> = ({ type, transactions, onAdd, onEdit, onDelete, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'ALL'>('ALL');

  const isAdminOrSuper = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = t.type === type;
      const matchesSearch = 
        t.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMethod = selectedMethod === 'ALL' || t.method === selectedMethod;
      const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;

      return matchesType && matchesSearch && matchesMethod && matchesCategory;
    });
  }, [transactions, type, searchTerm, selectedMethod, selectedCategory]);

  const totalFilteredSum = useMemo(() => {
    return filtered.reduce((sum, t) => sum + t.amount, 0);
  }, [filtered]);

  const getMethodIcon = (method: PaymentMethod) => {
    switch(method) {
      case PaymentMethod.CASH: return <Banknote size={16} />;
      case PaymentMethod.TELEBIRR: return <Smartphone size={16} />;
      case PaymentMethod.CBE: return <Building2 size={16} />;
      case PaymentMethod.EBIRR: return <Smartphone size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMethod('ALL');
    setSelectedCategory('ALL');
  };

  const hasActiveFilters = searchTerm !== '' || selectedMethod !== 'ALL' || selectedCategory !== 'ALL';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            {type === TransactionType.INCOME ? 'Sales Hub' : 'Cost Journal'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1 text-sm sm:text-base">
            {type === TransactionType.INCOME ? 'Direct revenue & digital receipts' : 'Operational costs & settlements'}
          </p>
        </div>
        <button 
          onClick={onAdd}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 uppercase tracking-widest ${
            type === TransactionType.INCOME ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
        >
          <Plus size={20} />
          Record New
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-8 sm:p-10 rounded-[2.5rem] border shadow-2xl relative overflow-hidden group col-span-1 lg:col-span-2 ${type === TransactionType.INCOME ? 'bg-emerald-600 border-emerald-500 dark:bg-emerald-700' : 'bg-rose-600 border-rose-500 dark:bg-rose-700'} text-white text-left`}>
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
             <Calculator size={180} />
          </div>
          <div className="relative z-10">
            <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Consolidated {type === TransactionType.INCOME ? 'Sales' : 'Costs'}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-7xl font-black tabular-nums">{totalFilteredSum.toLocaleString()}</span>
              <span className="text-lg sm:text-xl font-bold opacity-80 uppercase tracking-widest">ETB</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
               <div className="px-4 py-2 bg-white/20 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                 {filtered.length} Indexed Nodes
               </div>
               {hasActiveFilters && (
                 <button onClick={clearFilters} className="px-4 py-2 bg-white text-slate-900 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                   Reset Filters
                 </button>
               )}
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-white/5 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Zap size={140} />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">Network Health</p>
            <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Active Stream</h4>
            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
              Monitoring {selectedMethod === 'ALL' ? 'omni-channel' : selectedMethod} flow for this cycle.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search nodes..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-8 py-4 border rounded-2xl text-xs font-black transition-all ${
              showFilters || hasActiveFilters 
                ? 'bg-indigo-50 dark:bg-indigo-600 border-indigo-200 dark:border-indigo-400 text-indigo-700 dark:text-white shadow-lg' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Filter size={18} />
            Config
            <ChevronDown size={16} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Channel Source</label>
              <select 
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as any)}
              >
                <option value="ALL">All Nodes</option>
                {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Allocation Hub</label>
              <select 
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
              >
                <option value="ALL">All Sectors</option>
                {Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto border-t border-slate-100 dark:border-white/5 pt-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-4 py-4">Descriptor</th>
                <th className="px-4 py-4">Channel</th>
                <th className="px-4 py-4">Timestamp</th>
                <th className="px-4 py-4">Sector</th>
                <th className="px-4 py-4 text-right">Magnitude</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-all group">
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${type === TransactionType.INCOME ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                        {type === TransactionType.INCOME ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-800 dark:text-white">{t.note || 'General Flow'}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{t.vendor || 'Floor Node'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-white/5">
                      {getMethodIcon(t.method)}
                      <span className="text-[10px] font-black uppercase tracking-wider">{t.method}</span>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-300">{new Date(t.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-6">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                      {t.category?.replace('_', ' ') || 'General'}
                    </span>
                  </td>
                  <td className="px-4 py-6 text-right">
                    <p className={`text-xl font-black tabular-nums ${type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {type === TransactionType.INCOME ? '+' : '-'}{t.amount.toLocaleString()} 
                      <span className="text-[11px] ml-1.5 opacity-60 font-bold">ETB</span>
                    </p>
                  </td>
                  <td className="px-4 py-6 text-right">
                    {isAdminOrSuper && (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit?.(t)}
                          className="p-3 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete?.(t.id)}
                          className="p-3 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 pt-4">
          {filtered.map((t) => (
            <div key={t.id} className="p-6 bg-slate-50/50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${type === TransactionType.INCOME ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                    {type === TransactionType.INCOME ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-white truncate max-w-[120px]">{t.note || 'General Flow'}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{t.vendor || 'Floor Node'}</p>
                  </div>
                </div>
                <p className={`text-lg font-black tabular-nums ${type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {type === TransactionType.INCOME ? '+' : '-'}{t.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-white/5">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {t.method}
                  </span>
                  <span className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {t.category?.replace('_', ' ') || 'General'}
                  </span>
                </div>
                {isAdminOrSuper && (
                  <div className="flex gap-1">
                    <button onClick={() => onEdit?.(t)} className="p-2 text-indigo-600 dark:text-indigo-400"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete?.(t.id)} className="p-2 text-rose-600 dark:text-rose-400"><Trash2 size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
             <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="text-slate-200 dark:text-slate-700" size={40} />
             </div>
             <p className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Node History Empty</p>
             <p className="text-sm font-medium mt-1 text-slate-400 dark:text-slate-500">Initialize your first transaction entry.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
