
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Briefcase, 
  CreditCard,
  Sparkles,
  Calculator,
  ArrowUpRight,
  ArrowDownLeft,
  LayoutDashboard,
  Download,
  Info,
  Smartphone,
  Monitor,
  X,
  Share,
  PlusSquare,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod } from '../types.ts';
import { getFinancialAdvice } from '../services/geminiService.ts';

interface DashboardProps {
  transactions: Transaction[];
  isMasked?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, isMasked }) => {
  const [advice, setAdvice] = React.useState<string>("Loading zone intelligence...");
  const [isAdviceLoading, setIsAdviceLoading] = React.useState(true);
  const [canInstall, setCanInstall] = React.useState(false);
  const [showInstallGuide, setShowInstallGuide] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [isInIframe, setIsInIframe] = React.useState(false);

  React.useEffect(() => {
    const fetchAdvice = async () => {
      setIsAdviceLoading(true);
      const res = await getFinancialAdvice(transactions);
      setAdvice(res);
      setIsAdviceLoading(false);
    };
    fetchAdvice();

    const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!isPWA);
    setIsInIframe(window.self !== window.top);

    // Initial check for deferredPrompt
    if ((window as any).deferredPrompt) {
      setCanInstall(true);
    }

    const checkInstall = () => {
      if ((window as any).deferredPrompt) {
        setCanInstall(true);
      }
    };

    window.addEventListener('pwa-installable', checkInstall);
    const timer = setInterval(checkInstall, 1000);
    
    return () => {
      window.removeEventListener('pwa-installable', checkInstall);
      clearInterval(timer);
    };
  }, [transactions]);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt;
    if (!promptEvent) {
      setShowInstallGuide(true);
      return;
    }
    
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      (window as any).deferredPrompt = null;
      setCanInstall(false);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const chartData = [
    { name: 'Sales', amount: totalIncome },
    { name: 'Costs', amount: totalExpense },
  ];

  const methodData = Object.values(PaymentMethod).map(method => ({
    name: method,
    value: transactions
      .filter(t => t.method === method)
      .reduce((sum, t) => sum + t.amount, 0)
  })).filter(d => d.value > 0);

  const formatAmount = (amount: number) => {
    if (isMasked) return '••••••';
    return amount.toLocaleString();
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-left">
          <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Command Dashboard</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">Real-time financial pulse of Plus Game Zone</p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isStandalone && (
            <>
              {isInIframe ? (
                <a 
                  href={window.location.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                >
                  <ExternalLink size={18} />
                  Launch Full App
                </a>
              ) : canInstall ? (
                <button 
                  onClick={handleInstallClick}
                  className="animate-bounce bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                >
                  <Download size={18} />
                  Install App
                </button>
              ) : (
                <button 
                  onClick={() => setShowInstallGuide(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Info size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest text-left">Install Help</span>
                </button>
              )}
            </>
          )}
          {isStandalone && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest text-left">App Mode Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-10 rounded-[2.5rem] bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-950 text-white shadow-2xl relative overflow-hidden group col-span-1 lg:col-span-2 text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
             <Calculator size={180} />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8 text-left">
            <div className="text-left">
              <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-left">Zone Net Capital</p>
              <div className="flex items-baseline gap-3 text-left">
                <span className="text-6xl font-black tabular-nums">{formatAmount(balance)}</span>
                <span className="text-xl font-bold opacity-60 text-left">ETB</span>
              </div>
            </div>
            <div className="h-24 w-px bg-white/20 hidden sm:block" />
            <div className="text-center sm:text-left flex flex-col gap-4 text-left">
              <div className="text-left">
                <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-1 text-left">Total Sales</p>
                <div className="flex items-center gap-2 text-left">
                   <ArrowUpRight size={18} className="text-emerald-400" />
                   <p className="text-2xl font-black text-white text-left">{formatAmount(totalIncome)}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-rose-300 text-[10px] font-black uppercase tracking-widest mb-1 text-left">Total Costs</p>
                <div className="flex items-center gap-2 text-left">
                   <ArrowDownLeft size={18} className="text-rose-400" />
                   <p className="text-2xl font-black text-white text-left">{formatAmount(totalExpense)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-700 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left">
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <LayoutDashboard size={140} />
          </div>
          <div className="relative z-10 text-left">
            <div className="bg-white/20 p-2 rounded-xl w-fit mb-4">
              <CreditCard size={24} />
            </div>
            <h4 className="text-xl font-black mb-1">Digital Settlements</h4>
            <p className="text-white text-2xl font-black tabular-nums">
              {formatAmount(transactions.filter(t => t.method !== PaymentMethod.CASH).reduce((s, t) => s + t.amount, 0))} 
            </p>
            <p className="text-[10px] font-black text-amber-100 uppercase tracking-widest mt-1 text-left">Wallet Transaction Volume</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-800 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 opacity-20 -translate-y-4 translate-x-4 group-hover:scale-125 transition-transform duration-1000">
           <Sparkles size={250} />
        </div>
        <div className="bg-white/20 p-5 rounded-3xl shadow-lg backdrop-blur-md">
          <Sparkles className={isAdviceLoading ? "animate-spin" : "animate-pulse"} size={32} />
        </div>
        <div className="flex-1 relative z-10 text-center md:text-left">
          <h3 className="text-xl font-black mb-1 uppercase tracking-tight text-left">Plus Zone Intelligence</h3>
          <p className="text-white text-base font-medium leading-relaxed max-w-3xl italic opacity-90 text-left">
            "{isAdviceLoading ? "Parsing Plus Zone trends..." : advice}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 transition-colors text-left">
          <div className="flex items-center justify-between mb-10 text-left">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight text-left">Zone Velocity</h3>
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-600 text-indigo-700 dark:text-white rounded-xl text-[10px] font-black uppercase">Rolling History</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                />
                <Bar dataKey="amount" radius={[12, 12, 12, 12]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 transition-colors text-left">
          <div className="flex items-center justify-between mb-10 text-left">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight text-left">Capital Allocation</h3>
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-600 text-amber-700 dark:text-white rounded-xl text-[10px] font-black uppercase">Channel Nodes</div>
          </div>
          <div className="h-80 flex flex-col sm:flex-row items-center justify-center gap-10">
            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={methodData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {methodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-4 text-left">
              {methodData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-3 text-left">
                  <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black text-slate-400 dark:text-indigo-400 uppercase tracking-widest text-left">{item.name}</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white text-left">{formatAmount(item.value)} <span className="text-[10px] text-slate-400 dark:text-slate-500">ETB</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[600] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border dark:border-white/5">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50 text-left">
              <div className="flex items-center gap-3 text-left">
                <Download className="text-indigo-600" />
                <h3 className="text-2xl font-black uppercase tracking-tight dark:text-white">Install PlusZone</h3>
              </div>
              <button onClick={() => setShowInstallGuide(false)} className="p-3 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] text-left">
              {isInIframe && (
                <div className="p-6 bg-rose-50 dark:bg-rose-500/10 rounded-3xl border border-rose-100 dark:border-rose-500/20 text-left">
                  <h4 className="font-black text-rose-700 dark:text-rose-400 text-sm uppercase mb-2">Sandbox Restriction</h4>
                  <p className="text-xs text-rose-600/80 dark:text-rose-400/80 font-medium">
                    You are currently in a "Preview" window. Browsers block installation inside iframes. Please <strong>click the "Launch Full App" button</strong> above to open the app in a real tab first.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 text-left">
                  <div className="flex items-center gap-2 mb-4 text-left">
                    <Smartphone className="text-indigo-500" size={20} />
                    <span className="font-black text-xs uppercase dark:text-white">iPhone / iPad</span>
                  </div>
                  <ol className="text-xs space-y-3 font-medium text-slate-600 dark:text-slate-400 text-left">
                    <li className="flex gap-2"><span>1.</span> Open Safari browser.</li>
                    <li className="flex gap-2"><span>2.</span> Tap <Share size={14} className="inline text-indigo-500" /> "Share".</li>
                    <li className="flex gap-2"><span>3.</span> Tap <PlusSquare size={14} className="inline text-indigo-500" /> "Add to Home Screen".</li>
                  </ol>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 text-left">
                  <div className="flex items-center gap-2 mb-4 text-left">
                    <Smartphone className="text-emerald-500" size={20} />
                    <span className="font-black text-xs uppercase dark:text-white">Android</span>
                  </div>
                  <ol className="text-xs space-y-3 font-medium text-slate-600 dark:text-slate-400 text-left">
                    <li className="flex gap-2"><span>1.</span> Open Chrome browser.</li>
                    <li className="flex gap-2"><span>2.</span> Tap <MoreVertical size={14} className="inline text-emerald-500" /> (3-dots) menu.</li>
                    <li className="flex gap-2"><span>3.</span> Tap "Install app" or "Add to Home screen".</li>
                  </ol>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 text-left">
                  <div className="flex items-center gap-2 mb-4 text-left">
                    <Monitor className="text-amber-500" size={20} />
                    <span className="font-black text-xs uppercase dark:text-white">Desktop (PC/Mac)</span>
                  </div>
                  <ol className="text-xs space-y-3 font-medium text-slate-600 dark:text-slate-400 text-left">
                    <li className="flex gap-2"><span>1.</span> Look at the right side of your address bar.</li>
                    <li className="flex gap-2 text-left"><span>2.</span> Click the <Download size={14} className="inline text-amber-500" /> icon or go to <strong>Settings > Save and Share > Install</strong>.</li>
                  </ol>
                </div>
              </div>

              <div className="p-6 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 flex items-start gap-4 text-left">
                <Sparkles size={24} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div className="text-left">
                  <h4 className="font-black text-sm uppercase text-indigo-700 dark:text-indigo-300 mb-1 text-left">Why Install?</h4>
                  <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-medium leading-relaxed text-left">
                    Installing provides a full-screen workspace, offline journal access, and instant entry from your home screen for Plus Game Zone.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-950/50 border-t dark:border-white/5">
              <button 
                onClick={() => setShowInstallGuide(false)}
                className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
