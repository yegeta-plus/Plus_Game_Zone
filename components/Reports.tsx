
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { 
  Activity, ShieldCheck, Download, Sparkles,
  TrendingUp, Wallet, Banknote, Target, Scale, FileText
} from 'lucide-react';
import { Transaction, TransactionType, Loan, EqubGroup, Goal, ExpenseCategory, GoalStatus } from '../types';
import { getDetailedBusinessReport } from '../services/geminiService';

interface ReportsProps {
  transactions: Transaction[];
  loans: Loan[];
  equbs: EqubGroup[];
  goals: Goal[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, loans, equbs, goals }) => {
  const [report, setReport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'WEEK' | 'MONTH' | 'QUARTER'>('MONTH');

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      if (transactions.length > 0) {
        const res = await getDetailedBusinessReport(transactions);
        setReport(res);
      } else {
        setReport("Establish more transaction history for 'Plus Game Zone' to unlock AI-powered business health scores and automated report cards.");
      }
      setIsLoading(false);
    };
    fetchReport();
  }, [transactions]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
    const savings = transactions
      .filter(t => t.category === ExpenseCategory.ROSCA_CONTRIBUTION || t.note.toLowerCase().includes('save'))
      .reduce((s, t) => s + t.amount, 0);
    
    const activeDebt = loans.reduce((s, l) => s + l.remainingAmount, 0);
    const netCashFlow = income - expense;
    
    const monthlyLoanObligation = loans.reduce((s, l) => s + (l.monthlyRepayment + (l.monthlyCompulsorySaving || 0)), 0);
    const stressRatio = income > 0 ? (monthlyLoanObligation / (income / (transactions.length > 0 ? 1 : 1))) * 100 : 0;

    return { income, expense, netCashFlow, savings, activeDebt, stressRatio, monthlyLoanObligation };
  }, [transactions, loans]);

  const cashFlowTrendData = useMemo(() => {
    const days = timeRange === 'WEEK' ? 7 : timeRange === 'MONTH' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        Income: transactions.filter(t => t.type === TransactionType.INCOME && t.date.startsWith(dateStr)).reduce((s, t) => s + t.amount, 0),
        Expense: transactions.filter(t => t.type === TransactionType.EXPENSE && t.date.startsWith(dateStr)).reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions, timeRange]);

  const expenseCategoryData = useMemo(() => {
    const categories = Object.values(ExpenseCategory);
    return categories.map(cat => ({
      name: cat.replace('_', ' '),
      value: transactions.filter(t => t.type === TransactionType.EXPENSE && t.category === cat).reduce((s, t) => s + t.amount, 0)
    })).filter(c => c.value > 0);
  }, [transactions]);

  const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-left">
          <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Plus Game Zone Intel</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">Official Performance and Health Report Card</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex items-center">
            {(['WEEK', 'MONTH', 'QUARTER'] as const).map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  timeRange === range ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl font-black text-sm active:scale-95">
            <Download size={20} />
            Export Intel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm text-left group hover:border-indigo-200 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/20 px-3 py-1 rounded-full uppercase">Net Pos.</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Zone Net Cash</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{stats.netCashFlow.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-400">ETB</span>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm text-left group hover:border-emerald-200 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 px-3 py-1 rounded-full uppercase">Growth</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Savings</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{stats.savings.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-400">ETB</span>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm text-left group hover:border-rose-200 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl">
              <Banknote size={24} />
            </div>
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-500/20 px-3 py-1 rounded-full uppercase">Liability</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Institutional Debt</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{stats.activeDebt.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-400">ETB</span>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm text-left group hover:border-amber-200 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
              <Target size={24} />
            </div>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-500/20 px-3 py-1 rounded-full uppercase">Vision</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Completion</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
              {goals.length > 0 ? Math.round((goals.filter(g => g.status === GoalStatus.COMPLETED).length / goals.length) * 100) : 0}%
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col text-left">
          <div className="flex items-center justify-between mb-10">
            <div className="text-left">
              <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase flex items-center gap-3">
                <Activity size={24} className="text-indigo-600" />
                Capital Velocity
              </h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Plus Game Zone Operating Performance</p>
            </div>
          </div>
          <div className="h-80 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowTrendData}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)', padding: '20px' }}
                />
                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="Expense" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm text-left">
          <div className="text-left mb-10">
             <h4 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase flex items-center gap-3">
               <FileText size={24} className="text-amber-500" />
               Zone Balance Node
             </h4>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-white/5">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                   <ShieldCheck size={28} />
                </div>
                <div>
                   <p className="text-sm font-black dark:text-white">Authorized Entity</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plus Game Zone</p>
                </div>
             </div>
             <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-slate-500">Report Status</span>
                   <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase">Verified</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-slate-500">Node ID</span>
                   <span className="text-[10px] font-mono text-slate-400 uppercase">{Math.random().toString(36).substr(2, 8)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 bg-indigo-600 dark:bg-indigo-700 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group text-left">
           <div className="absolute top-0 right-0 p-12 opacity-10 -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-1000">
              <ShieldCheck size={350} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-5 mb-10">
                <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
                  <Sparkles size={32} className="text-white" />
                </div>
                <h4 className="text-2xl font-black tracking-tight uppercase">Plus Game Zone AI Audit</h4>
              </div>
              
              <div className="text-white text-lg font-medium leading-relaxed bg-black/10 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-md shadow-inner text-left">
                {isLoading ? (
                  <div className="space-y-6">
                     <div className="h-6 bg-white/10 rounded-full w-3/4 animate-pulse" />
                     <div className="h-6 bg-white/10 rounded-full w-full animate-pulse" />
                  </div>
                ) : (
                  <div className="whitespace-pre-line prose prose-invert max-w-none opacity-90 text-sm md:text-base leading-loose font-medium text-left">
                    {report}
                  </div>
                )}
              </div>
           </div>
        </div>

        <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group text-left">
          <div className="absolute top-0 right-0 p-12 opacity-5 -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-1000">
             <Scale size={300} />
          </div>
          <div className="relative z-10">
            <h4 className="text-2xl font-black tracking-tight uppercase mb-2">Debt Health Score</h4>
            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest italic mb-8">Plus Game Zone Financial Leverage</p>
            
            <div className="flex items-center justify-center py-8">
              <div className={`w-32 h-32 rounded-full border-[12px] flex items-center justify-center text-4xl font-black ${stats.stressRatio > 40 ? 'border-rose-500 text-rose-500' : 'border-emerald-500 text-emerald-500'}`}>
                {Math.round(100 - Math.min(100, stats.stressRatio))}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Leverage Ratio</p>
                 <p className="text-xl font-black text-white">{(stats.activeDebt / (stats.income || 1)).toFixed(1)}x</p>
               </div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stress Factor</p>
                 <p className="text-xl font-black text-white">{Math.round(stats.stressRatio)}%</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
