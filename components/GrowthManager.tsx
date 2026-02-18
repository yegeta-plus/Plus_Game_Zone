import React from 'react';
import { Target, Clock, Plus, Zap, TrendingUp, Calculator, Wallet, Edit, Trash2, CheckCircle2, AlertTriangle, ArrowRight, Banknote } from 'lucide-react';
import { Goal, GoalStatus, GoalType, PlannedPayment, UserRole } from '../types';

interface GrowthManagerProps {
  goals: Goal[];
  planned: PlannedPayment[];
  onAddGoal?: () => void;
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (id: string) => void;
  onAddPlanned?: () => void;
  isAdmin?: boolean;
}

const GrowthManager: React.FC<GrowthManagerProps> = ({ 
  goals, 
  planned, 
  onAddGoal, 
  onEditGoal,
  onDeleteGoal,
  onAddPlanned,
  isAdmin
}) => {
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const getStatusConfig = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.COMPLETED:
        return { color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400', icon: CheckCircle2, label: 'Completed' };
      case GoalStatus.BEHIND:
        return { color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400', icon: AlertTriangle, label: 'Behind' };
      default:
        return { color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400', icon: TrendingUp, label: 'On Track' };
    }
  };

  const getGoalTypeIcon = (type: GoalType) => {
    switch (type) {
      case GoalType.ASSET_PURCHASE: return <Zap size={18} />;
      case GoalType.LOAN_PAYOFF: return <Calculator size={18} />;
      default: return <Target size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="text-left">
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Growth Stratosphere</h3>
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">Strategic accumulation and long-term capital objectives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-10 rounded-[2.5rem] bg-indigo-900 dark:bg-indigo-950 border border-indigo-800 dark:border-white/5 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2 text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
             <TrendingUp size={180} />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Consolidated Savings Progress</p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black tabular-nums">{totalCurrent.toLocaleString()}</span>
              <span className="text-xl font-bold opacity-60">/ {totalTarget.toLocaleString()} ETB</span>
            </div>
            <div className="mt-8 space-y-3">
               <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1">
                  <div className="h-full bg-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }} />
               </div>
               <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">{Math.round(overallProgress)}% Overall Completion</p>
                 <div className="flex gap-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{goals.filter(g => g.status === GoalStatus.COMPLETED).length} Finished</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{goals.filter(g => g.status === GoalStatus.ON_TRACK).length} Active</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-900 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Zap size={140} />
          </div>
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-2">Compound Vision</h4>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90">
              Your capital turnover has increased by 14% since adding targeted asset-purchase goals.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col h-fit text-left">
          <div className="flex items-center justify-between mb-10">
            <h4 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight flex items-center gap-3 uppercase">
              <Target size={28} className="text-indigo-600" />
              Strategic Targets
            </h4>
            {isAdmin && (
              <button onClick={onAddGoal} className="px-6 py-3 bg-indigo-50 dark:bg-indigo-600 text-indigo-600 dark:text-white rounded-2xl hover:bg-indigo-600 hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-sm">
                <Plus size={18} className="inline mr-1" /> Add Goal
              </button>
            )}
          </div>
          <div className="space-y-10 flex-1">
            {goals.length > 0 ? goals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const StatusIcon = getStatusConfig(goal.status).icon;
              const remainingBirr = goal.targetAmount - goal.currentAmount;
              const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

              return (
                <div key={goal.id} className="p-8 rounded-[2.5rem] border border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-slate-800/50 group hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-50/50 dark:hover:shadow-indigo-500/10 transition-all duration-500 text-left">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-slate-700 shadow-sm rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {getGoalTypeIcon(goal.type)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 dark:text-white text-lg">{goal.title}</p>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${getStatusConfig(goal.status).color}`}>
                             <StatusIcon size={12} />
                             {getStatusConfig(goal.status).label}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{goal.fundingSource} Funded</span>
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => onEditGoal?.(goal)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-xl transition-all"><Edit size={16} /></button>
                         <button onClick={() => onDeleteGoal?.(goal.id)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-white/5 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{Math.round(progress)}%</span>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Remaining</p>
                         <p className="text-base font-black text-slate-700 dark:text-slate-300">{remainingBirr.toLocaleString()} <span className="text-[10px] opacity-60">ETB</span></p>
                      </div>
                    </div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-1 shadow-inner border border-slate-200/50 dark:border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          goal.status === GoalStatus.COMPLETED ? 'bg-emerald-500' : 
                          goal.status === GoalStatus.BEHIND ? 'bg-rose-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Wallet size={10} /> Next Contribution</p>
                          <p className="text-sm font-black text-slate-800 dark:text-white">{goal.contributionAmount.toLocaleString()} <span className="text-[10px] opacity-40">ETB</span></p>
                          <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase">{goal.contributionFrequency}</p>
                       </div>
                       <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl">
                          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={10} /> Time Remaining</p>
                          <p className="text-sm font-black text-slate-800 dark:text-white">{daysLeft} Days</p>
                          <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase">Ends {new Date(goal.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                       </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center text-slate-300 dark:text-slate-700">
                <Target size={64} className="mx-auto opacity-10 mb-6" />
                <p className="font-black text-slate-900 dark:text-slate-100">No active visions</p>
                <p className="text-sm font-medium">Add a goal to start the growth engine.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col h-fit text-left">
          <div className="flex items-center justify-between mb-10">
            <h4 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight flex items-center gap-3 uppercase">
              <Clock size={28} className="text-amber-600" />
              Payment Queue
            </h4>
            {isAdmin && (
              <button onClick={onAddPlanned} className="px-6 py-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl hover:bg-amber-600 hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-sm">
                <Plus size={18} className="inline mr-1" /> Add Pending
              </button>
            )}
          </div>
          <div className="space-y-4 flex-1">
            {planned.length > 0 ? planned.map(p => {
              const daysToDue = Math.ceil((new Date(p.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isUrgent = daysToDue <= 3;

              return (
                <div key={p.id} className="p-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-between border-2 border-transparent hover:border-amber-100 dark:hover:border-amber-500/30 hover:bg-white dark:hover:bg-slate-800 transition-all group text-left">
                  <div className="flex items-center gap-6">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isUrgent ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-200 dark:shadow-rose-900/40' : 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm shadow-amber-50 dark:shadow-none'}`}>
                       <Banknote size={24} />
                     </div>
                     <div>
                       <p className="text-lg font-black text-slate-800 dark:text-white">{p.title}</p>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${isUrgent ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>
                         Due in {daysToDue} Days • {new Date(p.dueDate).toLocaleDateString()}
                       </p>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{p.amount.toLocaleString()} <span className="text-xs font-bold text-slate-400 dark:text-slate-600">ETB</span></p>
                    <ArrowRight size={20} className="text-slate-200 dark:text-slate-700 mt-2 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center text-slate-300 dark:text-slate-700">
                <Clock size={64} className="mx-auto opacity-10 mb-6" />
                <p className="font-black text-slate-900 dark:text-white">Queue clear</p>
                <p className="text-sm font-medium">All upcoming payments are accounted for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthManager;