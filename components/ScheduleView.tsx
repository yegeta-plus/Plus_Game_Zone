import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  ArrowRight, 
  Wallet, 
  Banknote, 
  Clock, 
  Bell, 
  Filter, 
  CheckCircle2, 
  Calendar,
  Calculator,
  Check,
  Zap,
  CheckCircle
} from 'lucide-react';
import { EqubGroup, Loan, PlannedPayment, Recurrence } from '../types';

interface ScheduleViewProps {
  equbs: EqubGroup[];
  loans: Loan[];
  planned: PlannedPayment[];
  onPayLoan: (loanId: string, amount: number) => void;
}

interface ScheduleItem {
  id: string;
  sourceId: string;
  title: string;
  amount: number;
  date: Date;
  type: 'Equb' | 'Loan' | 'Planned';
  subType: string;
  icon: any;
  color: string;
  darkColor: string;
}

type Timeframe = 'ALL' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';

const ScheduleView: React.FC<ScheduleViewProps> = ({ equbs, loans, planned, onPayLoan }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'EQUB' | 'LOAN' | 'PLANNED'>('ALL');
  const [timeframe, setTimeframe] = useState<Timeframe>('ALL');
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());

  const getNextDates = (startDate: string, frequency: Recurrence, count: number): Date[] => {
    const dates: Date[] = [];
    let current = new Date(startDate);
    const now = new Date();

    while (current < now) {
      switch (frequency) {
        case 'DAILY': current.setDate(current.getDate() + 1); break;
        case 'WEEKLY': current.setDate(current.getDate() + 7); break;
        case 'EVERY_10_DAYS': current.setDate(current.getDate() + 10); break;
        case 'EVERY_15_DAYS': current.setDate(current.getDate() + 15); break;
        case 'MONTHLY': current.setMonth(current.getMonth() + 1); break;
        case 'BI_MONTHLY': current.setMonth(current.getMonth() + 2); break;
        case 'QUARTERLY': current.setMonth(current.getMonth() + 3); break;
        default: current.setMonth(current.getMonth() + 1);
      }
    }

    for (let i = 0; i < count; i++) {
      const nextDate = new Date(current);
      dates.push(nextDate);
      switch (frequency) {
        case 'DAILY': current.setDate(current.getDate() + 1); break;
        case 'WEEKLY': current.setDate(current.getDate() + 7); break;
        case 'EVERY_10_DAYS': current.setDate(current.getDate() + 10); break;
        case 'EVERY_15_DAYS': current.setDate(current.getDate() + 15); break;
        case 'MONTHLY': current.setMonth(current.getMonth() + 1); break;
        case 'BI_MONTHLY': current.setMonth(current.getMonth() + 2); break;
        case 'QUARTERLY': current.setMonth(current.getMonth() + 3); break;
      }
    }
    return dates;
  };

  const projectedSchedules = useMemo(() => {
    const items: ScheduleItem[] = [];
    const now = new Date();

    loans.forEach(l => {
      const nextDates = getNextDates(l.nextPaymentDate, l.recurrence, 12);
      nextDates.forEach((date, idx) => {
        items.push({
          id: `loan-combined-${l.id}-${idx}`,
          sourceId: l.id,
          title: l.loanName,
          amount: l.monthlyRepayment + l.monthlyCompulsorySaving,
          date,
          type: 'Loan',
          subType: 'Loan Installment',
          icon: Banknote,
          color: 'text-indigo-600 bg-indigo-50',
          darkColor: 'dark:text-indigo-400 dark:bg-indigo-500/10'
        });
      });
    });

    equbs.forEach(e => {
      const nextDates = getNextDates(e.startDate, e.frequency, 12);
      nextDates.forEach((date, idx) => {
        items.push({
          id: `equb-${e.id}-${idx}`,
          sourceId: e.id,
          title: e.name,
          amount: e.contributionAmount,
          date,
          type: 'Equb',
          subType: 'Equb Contribution',
          icon: Wallet,
          color: 'text-blue-600 bg-blue-50',
          darkColor: 'dark:text-blue-400 dark:bg-blue-500/10'
        });
      });
    });

    planned.forEach(p => {
      items.push({
        id: `planned-${p.id}`,
        sourceId: p.id,
        title: p.title,
        amount: p.amount,
        date: new Date(p.dueDate),
        type: 'Planned',
        subType: 'Planned Expense',
        icon: Clock,
        color: 'text-rose-600 bg-rose-50',
        darkColor: 'dark:text-rose-400 dark:bg-rose-500/10'
      });
    });

    return items
      .filter(item => {
        const matchesCategory = filterType === 'ALL' || item.type.toUpperCase() === filterType;
        if (!matchesCategory) return false;

        const diffTime = item.date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (timeframe === 'WEEKLY') return diffDays >= -1 && diffDays <= 7;
        if (timeframe === 'MONTHLY') return diffDays >= -1 && diffDays <= 30;
        if (timeframe === 'QUARTERLY') return diffDays >= -1 && diffDays <= 90;
        
        return diffDays >= -1;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [equbs, loans, planned, filterType, timeframe]);

  const stats = useMemo(() => {
    const totalFiltered = projectedSchedules.reduce((sum, item) => sum + item.amount, 0);
    const totalPending = projectedSchedules
      .filter(item => !paidIds.has(item.id))
      .reduce((sum, item) => sum + item.amount, 0);
    const totalPaid = projectedSchedules
      .filter(item => paidIds.has(item.id))
      .reduce((sum, item) => sum + item.amount, 0);
    
    return { totalFiltered, totalPending, totalPaid };
  }, [projectedSchedules, paidIds]);

  const handleAction = (item: ScheduleItem) => {
    if (item.type === 'Loan') {
      onPayLoan(item.sourceId, item.amount);
    }
    const newPaidIds = new Set(paidIds);
    newPaidIds.add(item.id);
    setPaidIds(newPaidIds);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Payment Roadmap</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Real-time projections and status tracking</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-x-auto">
            {(['ALL', 'EQUB', 'LOAN', 'PLANNED'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${
                  filterType === type ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-x-auto text-left">
            {(['ALL', 'WEEKLY', 'MONTHLY', 'QUARTERLY'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${
                  timeframe === tf ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}
              >
                {tf === 'ALL' ? 'ALL TIME' : tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-indigo-900 dark:bg-indigo-950 border border-indigo-800 dark:border-white/5 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2 text-left text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
             <Calculator size={180} />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Filtered Payments</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tabular-nums">{stats.totalFiltered.toLocaleString()}</span>
                <span className="text-xl font-bold opacity-60">ETB</span>
              </div>
            </div>
            <div className="h-20 w-px bg-white/10 hidden sm:block" />
            <div className="text-left">
              <div className="mb-4">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Already Settled</p>
                <p className="text-2xl font-black text-emerald-300">{stats.totalPaid.toLocaleString()} <span className="text-xs font-bold">ETB</span></p>
              </div>
              <div>
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Still Outstanding</p>
                <p className="text-2xl font-black text-white">{stats.totalPending.toLocaleString()} <span className="text-xs font-bold">ETB</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-emerald-600 dark:bg-emerald-700 border border-emerald-500 dark:border-white/5 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <CheckCircle size={140} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 p-2 rounded-xl w-fit mb-4">
              <Zap size={24} />
            </div>
            <h4 className="text-xl font-black mb-1">Instant Pay</h4>
            <p className="text-emerald-100 text-sm font-medium leading-relaxed">
              Mark items as paid to keep your roadmap up to date.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Due Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-slate-900 dark:text-slate-100">
              {projectedSchedules.length > 0 ? (
                projectedSchedules.map((item) => {
                  const isPaid = paidIds.has(item.id);
                  return (
                    <tr key={item.id} className={`group transition-all duration-300 ${isPaid ? 'bg-emerald-50/40 dark:bg-emerald-500/5' : 'hover:bg-slate-50/80 dark:hover:bg-white/5'}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl transition-all duration-500 ${isPaid ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                            {isPaid ? <CheckCircle2 size={20} /> : <Calendar size={20} />}
                          </div>
                          <div className="text-left">
                            <p className={`font-black text-lg transition-colors duration-300 ${isPaid ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                              {item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                              {item.date.toLocaleDateString(undefined, { weekday: 'long' })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 text-left">
                          <div className={`p-2 rounded-xl transition-colors duration-300 ${isPaid ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : `${item.color} ${item.darkColor}`}`}>
                            {isPaid ? <Check size={16} /> : <item.icon size={16} />}
                          </div>
                          <div className="text-left">
                            <p className={`text-sm font-black transition-colors duration-300 ${isPaid ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>{item.subType}</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">{item.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col text-left">
                          <p className={`text-xl font-black tabular-nums transition-all duration-300 ${isPaid ? 'text-emerald-600 dark:text-emerald-500 line-through opacity-40 translate-x-1' : 'text-slate-900 dark:text-white'}`}>
                            {item.amount.toLocaleString()} <span className="text-xs font-bold text-slate-400 dark:text-slate-600 ml-0.5">ETB</span>
                          </p>
                          {!isPaid && (
                            <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-1">
                              IN {Math.ceil((item.date.getTime() - new Date().getTime()) / (1000 * 3600 * 24))} DAYS
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end">
                          {isPaid ? (
                            <div className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-emerald-100 animate-in zoom-in-95 duration-300">
                              <CheckCircle2 size={16} />
                              PAID
                              <Check size={16} className="ml-1" />
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleAction(item)}
                              className="px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-[11px] font-black hover:bg-emerald-600 dark:hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-slate-100 dark:shadow-none group/btn"
                            >
                              PAY NOW
                              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-32 text-center text-slate-400 dark:text-slate-600">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <Bell size={40} className="opacity-20" />
                      </div>
                      <div>
                        <p className="font-black text-xl text-slate-900 dark:text-white">No commitments found</p>
                        <p className="text-sm font-medium mt-1">Try adjusting your filters or timeframes.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;