
import React, { useState, useEffect } from 'react';
import { X, Save, Target, Calendar, Wallet, TrendingUp, Info, AlertCircle, ShoppingCart, Banknote } from 'lucide-react';
import { Goal, GoalType, PaymentMethod, GoalStatus } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Goal) => void;
  editingGoal?: Goal | null;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSubmit, editingGoal }) => {
  const [formData, setFormData] = useState<Partial<Goal>>(
    editingGoal || {
      title: '',
      type: GoalType.SAVINGS,
      targetAmount: 0,
      currentAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
      fundingSource: PaymentMethod.TELEBIRR,
      contributionFrequency: 'MONTHLY',
      contributionAmount: 0,
      status: GoalStatus.ON_TRACK
    }
  );

  useEffect(() => {
    // Automatically calculate recommended contribution
    if (formData.targetAmount && formData.deadline && formData.startDate) {
      const start = new Date(formData.startDate).getTime();
      const end = new Date(formData.deadline).getTime();
      const diffMs = end - start;
      const remaining = Number(formData.targetAmount) - Number(formData.currentAmount || 0);

      if (diffMs > 0 && remaining > 0) {
        let divisor = 1;
        if (formData.contributionFrequency === 'MONTHLY') divisor = diffMs / (1000 * 60 * 60 * 24 * 30.44);
        if (formData.contributionFrequency === 'WEEKLY') divisor = diffMs / (1000 * 60 * 60 * 24 * 7);
        if (formData.contributionFrequency === 'DAILY') divisor = diffMs / (1000 * 60 * 60 * 24);
        
        const recommended = Math.ceil(remaining / Math.max(1, divisor));
        setFormData(prev => ({ ...prev, contributionAmount: recommended }));
      }
    }
  }, [formData.targetAmount, formData.currentAmount, formData.deadline, formData.contributionFrequency]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: editingGoal?.id || Math.random().toString(36).substr(2, 9),
    } as Goal);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 text-left">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] border dark:border-white/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            {editingGoal ? 'Modify Vision' : 'Establish Goal'}
          </h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-600 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Goal Identity</label>
              <div className="relative">
                <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                <input 
                  type="text" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Merkato Shop Inventory"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Objective Type</label>
              <select 
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as GoalType})}
              >
                <option value={GoalType.SAVINGS}>Pure Savings</option>
                <option value={GoalType.LOAN_PAYOFF}>Debt Settlement</option>
                <option value={GoalType.ASSET_PURCHASE}>Asset Acquisition</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Primary Funding</label>
              <div className="relative">
                <Wallet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                <select 
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                  value={formData.fundingSource}
                  onChange={(e) => setFormData({...formData, fundingSource: e.target.value as PaymentMethod})}
                >
                  {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-6 bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-3xl">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest ml-1">Target Birr</label>
              <input 
                type="number" required min={1}
                className="w-full p-4 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 rounded-xl outline-none font-black text-slate-800 dark:text-white text-xl"
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest ml-1">Initial Birr</label>
              <input 
                type="number" required min={0}
                className="w-full p-4 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 rounded-xl outline-none font-black text-slate-800 dark:text-white text-xl"
                value={formData.currentAmount}
                onChange={(e) => setFormData({...formData, currentAmount: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Commencement</label>
              <input 
                type="date" required
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Maturity Date</label>
              <input 
                type="date" required
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">Dynamic Planning</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-400 dark:text-emerald-500 uppercase tracking-widest">Cadence</label>
                  <select 
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 rounded-xl outline-none font-black text-xs dark:text-white"
                    value={formData.contributionFrequency}
                    onChange={(e) => setFormData({...formData, contributionFrequency: e.target.value as any})}
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-400 dark:text-emerald-500 uppercase tracking-widest">Calculated Birr / {formData.contributionFrequency?.slice(0,-2)}</label>
                  <input 
                    type="number"
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 rounded-xl outline-none font-black text-slate-800 dark:text-white"
                    value={formData.contributionAmount}
                    onChange={(e) => setFormData({...formData, contributionAmount: parseFloat(e.target.value)})}
                  />
               </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl dark:shadow-none active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
          >
            <Save size={20} />
            {editingGoal ? 'Update Strategy' : 'Confirm Goal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
