
import React, { useState, useMemo } from 'react';
import { Wallet, ArrowRightLeft, Plus, Smartphone, Building2, Banknote, History, ArrowUpRight, ArrowDownLeft, Calculator, Zap, Building, XCircle } from 'lucide-react';
import { PaymentMethod, WalletBalances, Transaction, TransactionType } from '../types';

interface WalletViewProps {
  balances: WalletBalances;
  transactions: Transaction[];
  onTransfer: (from: PaymentMethod, to: PaymentMethod, amount: number) => void;
  onAddFunds: (method: PaymentMethod, amount: number) => void;
}

const WalletView: React.FC<WalletViewProps> = ({ balances, transactions, onTransfer, onAddFunds }) => {
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferData, setTransferData] = useState({ from: PaymentMethod.TELEBIRR, to: PaymentMethod.CASH, amount: '' });

  const totalBalance = (Object.values(balances) as number[]).reduce((s, b) => s + b, 0);

  const walletConfigs = [
    { method: PaymentMethod.TELEBIRR, color: 'bg-amber-400 dark:bg-amber-500', textColor: 'text-amber-950 dark:text-amber-950', icon: Smartphone, label: 'Telebirr' },
    { method: PaymentMethod.CBE, color: 'bg-indigo-900 dark:bg-indigo-950', textColor: 'text-white', icon: Building2, label: 'CBE Birr' },
    { method: PaymentMethod.EBIRR, color: 'bg-emerald-600 dark:bg-emerald-700', textColor: 'text-white', icon: Smartphone, label: 'eBirr' },
    { method: PaymentMethod.CASH, color: 'bg-slate-800 dark:bg-slate-900', textColor: 'text-white', icon: Banknote, label: 'Physical Cash' },
  ];

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferData.amount);
    if (amount > 0 && balances[transferData.from] >= amount) {
      onTransfer(transferData.from, transferData.to, amount);
      setShowTransfer(false);
      setTransferData({ ...transferData, amount: '' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Digital Vault</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1 text-sm sm:text-base">Consolidated liquidity and omni-channel settlements</p>
        </div>
        <button 
          onClick={() => setShowTransfer(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl font-black text-sm active:scale-95 uppercase tracking-widest"
        >
          <ArrowRightLeft size={20} />
          Execute Swap
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-indigo-900 dark:bg-indigo-950 border border-indigo-800 dark:border-white/5 text-white shadow-2xl relative overflow-hidden group col-span-1 lg:col-span-2 text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
             <Calculator size={180} />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
            <div>
              <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Net Dynamic Liquidity</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-7xl font-black tabular-nums">{totalBalance.toLocaleString()}</span>
                <span className="text-lg sm:text-xl font-bold opacity-60 uppercase tracking-widest">ETB</span>
              </div>
            </div>
            <div className="h-24 w-px bg-white/10 hidden sm:block" />
            <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-4">
              {walletConfigs.map(c => (
                <div key={c.method}>
                  <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest leading-none mb-2">{c.label}</p>
                  <p className="text-lg sm:text-xl font-black tabular-nums leading-none">{balances[c.method].toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-emerald-600 dark:bg-emerald-700 border border-emerald-500 dark:border-white/5 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Zap size={140} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 p-2 rounded-xl w-fit mb-4">
              <Smartphone size={24} />
            </div>
            <h4 className="text-xl font-black mb-1 uppercase tracking-tight">Active Nodes</h4>
            <p className="text-emerald-50 text-xs sm:text-sm font-medium leading-relaxed opacity-90">
              Your CBE and Telebirr nodes are currently synchronized with the master ledger.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-fit">
          {walletConfigs.map((config) => (
            <div key={config.method} className={`${config.color} ${config.textColor} p-6 sm:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group transition-all hover:scale-[1.02] min-h-[180px] sm:h-64 border border-black/5 text-left`}>
              <div className="relative z-10 flex flex-col h-full justify-between gap-8 sm:gap-0">
                <div className="flex justify-between items-start">
                  <div className="p-3 sm:p-4 rounded-2xl bg-white/20 backdrop-blur-md shadow-sm">
                    <config.icon size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{config.label}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Asset Value</p>
                  <p className="text-3xl sm:text-4xl font-black tabular-nums">{balances[config.method].toLocaleString()} <span className="text-sm font-bold opacity-70 uppercase tracking-widest ml-1">ETB</span></p>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            </div>
          ))}
        </div>

        <div className="space-y-6 h-full flex flex-col text-left">
           <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm flex-1 overflow-hidden">
              <h4 className="font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3 text-lg uppercase tracking-tight">
                <History size={22} className="text-indigo-600" />
                Flow History
              </h4>
              <div className="space-y-6">
                {transactions.filter(t => t.type === TransactionType.TRANSFER).slice(0, 4).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <ArrowRightLeft size={18} />
                      </div>
                      <div className="max-w-[100px] sm:max-w-none">
                        <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white truncate">{tx.method} → {tx.toMethod}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">-{tx.amount.toLocaleString()}</p>
                  </div>
                ))}
                {transactions.filter(t => t.type === TransactionType.TRANSFER).length === 0 && (
                  <div className="py-20 text-center opacity-20 flex flex-col items-center">
                    <History size={48} className="mb-4" />
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">No movement logs</p>
                  </div>
                )}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                    <Building size={24} className="text-indigo-400" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight uppercase">Bank Bridge</h4>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-8 leading-relaxed">
                  Bridge institutional accounts with local wallets for automated settlements.
                </p>
                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] sm:text-xs shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all uppercase tracking-[0.2em] active:scale-95">
                  Link Node
                </button>
              </div>
              <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Building size={250} />
              </div>
           </div>
        </div>
      </div>

      {showTransfer && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[600] flex items-end sm:items-center justify-center p-0 sm:p-4 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[3rem] w-full max-w-lg p-8 sm:p-12 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="flex justify-between items-center mb-8 text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Internal Swap</h3>
              <button onClick={() => setShowTransfer(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 transition-all">
                 <XCircle size={28} />
              </button>
            </div>
            <form onSubmit={handleTransferSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Source Node</label>
                  <select 
                    className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-sm dark:text-white"
                    value={transferData.from}
                    onChange={(e) => setTransferData({...transferData, from: e.target.value as PaymentMethod})}
                  >
                    {walletConfigs.map(c => <option key={c.method} value={c.method}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Node</label>
                  <select 
                    className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-sm dark:text-white"
                    value={transferData.to}
                    onChange={(e) => setTransferData({...transferData, to: e.target.value as PaymentMethod})}
                  >
                    {walletConfigs.map(c => <option key={c.method} value={c.method}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Swap Magnitude (ETB)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full p-5 sm:p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-3xl sm:text-4xl font-black tabular-nums dark:text-white"
                  value={transferData.amount}
                  onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                />
                <p className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Authorization Limit: {balances[transferData.from].toLocaleString()} ETB</p>
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-2xl active:scale-95 uppercase tracking-widest mt-4"
              >
                Execute Swap
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletView;
