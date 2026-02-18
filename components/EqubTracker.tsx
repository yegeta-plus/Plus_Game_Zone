import React, { useState, useMemo } from 'react';
import { Wallet, Calendar, Users, Trophy, Plus, CheckCircle2, Edit, Trash2, Search, Filter, Calculator, Sparkles, CreditCard, Check, ArrowRight, Info } from 'lucide-react';
import { EqubGroup, Recurrence } from '../types';

interface EqubTrackerProps {
  groups: EqubGroup[];
  onAdd?: () => void;
  onEdit?: (group: EqubGroup) => void;
  onDelete?: (id: string) => void;
  onSettle?: (group: EqubGroup) => void;
  isAdmin?: boolean;
}

const EqubTracker: React.FC<EqubTrackerProps> = ({ groups, onAdd, onEdit, onDelete, onSettle, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return groups.filter(g => 
      g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]);

  const totalMonthlyCommitment = useMemo(() => {
    return groups.reduce((sum, g) => sum + g.contributionAmount, 0);
  }, [groups]);

  const calculateEndDate = (startDate: string, frequency: Recurrence, membersCount: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    
    let daysToAdd = 0;
    switch (frequency) {
      case 'DAILY': daysToAdd = membersCount; break;
      case 'WEEKLY': daysToAdd = membersCount * 7; break;
      case 'EVERY_10_DAYS': daysToAdd = membersCount * 10; break;
      case 'EVERY_15_DAYS': daysToAdd = membersCount * 15; break;
      case 'MONTHLY': daysToAdd = membersCount * 30; break;
      case 'BI_MONTHLY': daysToAdd = membersCount * 60; break;
      case 'QUARTERLY': daysToAdd = membersCount * 90; break;
    }
    
    end.setDate(start.getDate() + daysToAdd);
    return end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase text-left">Equb Ecosystem</h3>
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1 text-left">Community-based ROSCA saving cycles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-900 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2 text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
             <Calculator size={180} />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Active Monthly Commitment</p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black tabular-nums">{totalMonthlyCommitment.toLocaleString()}</span>
              <span className="text-xl font-bold opacity-60">ETB</span>
            </div>
            <div className="mt-6 flex items-center gap-4">
               <div className="px-4 py-2 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                 {groups.length} Circles Active
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-400 to-teal-500 dark:from-indigo-500 dark:to-teal-700 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Sparkles size={140} />
          </div>
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-2">Social Trust</h4>
            <p className="text-indigo-50 text-sm font-medium leading-relaxed opacity-90">
              Equb is a powerful tool for large capital accumulation without traditional bank interests.
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
              placeholder="Search your financial circles..." 
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
              New Circle
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {filtered.map((group) => {
            const progress = group.status === 'COMPLETED' 
              ? 100 
              : Math.round(((group.currentRound - 1) / group.membersCount) * 100);
            
            const startDateFormatted = new Date(group.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            const endDateFormatted = calculateEndDate(group.startDate, group.frequency, group.membersCount);
            
            return (
              <div key={group.id} className={`rounded-[2.5rem] border transition-all shadow-sm p-8 group/card relative text-left ${
                group.status === 'COMPLETED' 
                ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-500/20 dark:bg-emerald-500/5' 
                : 'border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30'
              }`}>
                <div className="flex items-start justify-between mb-8">
                  <div className={`p-4 rounded-2xl shadow-lg transition-all ${
                    group.status === 'COMPLETED' ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-indigo-600 text-white shadow-indigo-100'
                  }`}>
                    {group.status === 'COMPLETED' ? <Check size={24} /> : <Wallet size={24} />}
                  </div>
                  <div className="flex gap-2 items-center">
                    {group.joinedAtRound && group.joinedAtRound > 1 && (
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                        Joined Round {group.joinedAtRound}
                      </span>
                    )}
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                      group.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {group.status}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-1 ml-2">
                        <button 
                          onClick={() => onEdit?.(group)}
                          className="p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete?.(group.id)}
                          className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{group.name}</h4>
                
                <div className="flex items-center gap-4 mb-8 p-4 bg-white/50 dark:bg-slate-950/30 border border-slate-100 dark:border-white/5 rounded-2xl text-left">
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Commenced</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{startDateFormatted}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 dark:text-slate-700" />
                  <div className="flex-1 text-right">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Maturity Date</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{endDateFormatted}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-8 text-left">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Users size={20} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-bold">{group.membersCount} Members</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Calendar size={20} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-bold uppercase tracking-tight">{group.frequency}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Trophy size={20} className="text-indigo-500 dark:text-indigo-400" />
                    <span className="text-sm font-black">My Turn #{group.myTurnIndex}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Sparkles size={20} className={`${group.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'}`} />
                    <span className="text-sm font-black">
                      {group.status === 'COMPLETED' ? 'Finished' : `Round ${group.currentRound} / ${group.membersCount}`}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Circle Maturity</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{progress}%</span>
                  </div>
                  <div className="h-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${group.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-indigo-600'}`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-between shadow-sm text-left">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                      {group.status === 'COMPLETED' ? 'Total Saved' : 'Due Contribution'}
                    </p>
                    <p className={`text-xl font-black ${group.status === 'COMPLETED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {group.contributionAmount.toLocaleString()} <span className="text-xs font-bold text-slate-400 dark:text-slate-600">ETB</span>
                    </p>
                  </div>
                  {group.status === 'ACTIVE' ? (
                    <button 
                      onClick={() => onSettle?.(group)}
                      className="px-6 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 active:scale-95"
                    >
                      <CreditCard size={14} />
                      Settle Dues
                    </button>
                  ) : (
                    <div className="px-6 py-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      Complete
                    </div>
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

export default EqubTracker;