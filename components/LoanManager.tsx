import React, { useMemo, useState } from 'react';
import { 
  Banknote, 
  Calendar, 
  Percent, 
  Plus, 
  ArrowRight, 
  ShieldAlert, 
  Edit, 
  Trash2, 
  Clock, 
  Wallet, 
  CheckCircle2, 
  AlertCircle,
  Calculator,
  Check,
  TrendingDown,
  Search,
  ArrowRightCircle
} from 'lucide-react';
import { Loan } from '../types';

interface LoanManagerProps {
  loans: Loan[];
  onPay: (loanId: string, amount: number) => void;
  onAdd: () => void;
  onEdit?: (loan: Loan) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const LoanManager: React.FC<LoanManagerProps> = ({ loans, onPay, onAdd, onEdit, onDelete, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionPaidLoans, setSessionPaidLoans] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return loans.filter(l => 
      l.loanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.lenderName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [loans, searchTerm]);

  const stats = useMemo(() => {
    const totalBorrowed = loans.reduce((sum, l) => sum + l.totalAmount, 0);
    const totalRemaining = loans.reduce((sum, l) => sum + l.remainingAmount, 0);
    const totalInterest = loans.reduce((sum, l) => sum + l.totalInterest, 0);
    const activeCount = loans.filter(l => l.remainingAmount > 0).length;
    return { totalBorrowed, totalRemaining, totalInterest, activeCount };
  }, [loans]);

  const handleLocalPay = (loanId: string, amount: number) => {
    onPay(loanId, amount);
    setSessionPaidLoans(prev => new Set(prev).add(loanId));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="text-left">
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Microfinance Hub</h3>
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">Institutional capital and liability management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-10 rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-white/5 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2 text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
             <Calculator size={180} />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Total Outstanding Debt</p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-black tabular-nums">{stats.totalRemaining.toLocaleString()}</span>
                <span className="text-xl font-bold opacity-60">ETB</span>
              </div>
            </div>
            <div className="h-20 w-px bg-white/10 hidden sm:block" />
            <div className="text-left text-left">
              <div className="mb-4">
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Accounts</p>
                <p className="text-2xl font-black text-white">{stats.activeCount}</p>
              </div>
              <div>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Principal</p>
                <p className="text-2xl font-black text-white">{stats.totalBorrowed.toLocaleString()} <span className="text-xs font-bold opacity-40">ETB</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-950 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left text-left">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <TrendingDown size={140} />
          </div>
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-2">Interest Curve</h4>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
              Timely repayments on microfinance contracts help secure future large-scale capital.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search loan contracts or lenders..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button 
              onClick={onAdd}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
            >
              <Plus size={18} />
              New Loan
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {filtered.map(loan => {
            const isPaidOff = loan.remainingAmount <= 0;
            const isRecentlyPaid = sessionPaidLoans.has(loan.id);
            const totalMonthly = loan.monthlyRepayment + (loan.monthlyCompulsorySaving || 0);
            const progressPercent = Math.min(100, (loan.paymentsMadeCount / loan.durationMonths) * 100);

            return (
              <div key={loan.id} className={`rounded-[2.5rem] border transition-all shadow-sm p-8 group/card relative text-left ${
                isPaidOff 
                ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-500/20 dark:bg-emerald-500/5' 
                : 'border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30'
              }`}>
                <div className="flex items-start justify-between mb-8">
                  <div className={`p-4 rounded-2xl shadow-lg transition-all ${
                    isPaidOff ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-indigo-600 text-white shadow-indigo-100'
                  }`}>
                    {isPaidOff ? <CheckCircle2 size={24} /> : <Banknote size={24} />}
                  </div>
                  <div className="flex gap-2 items-center">
                    {loan.paymentsMadeCount > 0 && (
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                        In Progress
                      </span>
                    )}
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                      !isPaidOff ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isPaidOff ? 'SETTLED' : 'ACTIVE'}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-1 ml-2">
                        <button 
                          onClick={() => onEdit?.(loan)}
                          className="p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete?.(loan.id)}
                          className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{loan.loanName}</h4>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">{loan.lenderName}</p>

                <div className="flex items-center gap-4 mb-8 p-4 bg-white/50 dark:bg-slate-950/30 border border-slate-100 dark:border-white/5 rounded-2xl text-left">
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Commenced</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{formatDate(loan.startDate)}</p>
                  </div>
                  <ArrowRightCircle size={14} className="text-slate-300 dark:text-slate-700" />
                  <div className="flex-1 text-right">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Contract End</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{formatDate(loan.endDate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 mt-6 text-left">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Clock size={20} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-bold">{loan.durationMonths} Months</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Percent size={20} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-bold uppercase tracking-tight">{loan.interestRate}% Interest</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 size={20} className="text-indigo-500 dark:text-indigo-400" />
                    <span className="text-sm font-black">Paid: {loan.paymentsMadeCount}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <AlertCircle size={20} className="text-amber-500 dark:text-amber-400" />
                    <span className="text-sm font-black">Left: {loan.paymentsRemainingCount}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8 text-left text-left">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Repayment Progress</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="h-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isPaidOff ? 'bg-emerald-600' : 'bg-indigo-600'}`} 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-between shadow-sm text-left">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                      {isPaidOff ? 'Loan Settled' : 'Next Installment'}
                    </p>
                    <p className={`text-xl font-black ${isPaidOff ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {totalMonthly.toLocaleString()} <span className="text-xs font-bold text-slate-400 dark:text-slate-600">ETB</span>
                    </p>
                  </div>
                  {!isPaidOff && (
                    <button 
                      onClick={() => handleLocalPay(loan.id, totalMonthly)}
                      className="px-6 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 active:scale-95"
                    >
                      <Plus size={14} />
                      Settle
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoanManager;