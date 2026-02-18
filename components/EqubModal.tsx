
import React, { useState, useEffect } from 'react';
import { X, Save, Wallet, Users, RefreshCw, UserPlus, AlertCircle } from 'lucide-react';
import { EqubGroup, Recurrence } from '../types';

interface EqubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EqubGroup) => void;
  editingEqub?: EqubGroup | null;
}

const EqubModal: React.FC<EqubModalProps> = ({ isOpen, onClose, onSubmit, editingEqub }) => {
  const [formData, setFormData] = useState<Partial<EqubGroup>>({
    name: '',
    membersCount: 12,
    currentRound: 1,
    contributionAmount: 0,
    frequency: 'WEEKLY',
    startDate: new Date().toISOString().split('T')[0],
    myTurnIndex: 1,
    joinedAtRound: 1,
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (editingEqub) {
      setFormData(editingEqub);
    } else {
      setFormData({
        name: '',
        membersCount: 12,
        currentRound: 1,
        contributionAmount: 0,
        frequency: 'WEEKLY',
        startDate: new Date().toISOString().split('T')[0],
        myTurnIndex: 1,
        joinedAtRound: 1,
        status: 'ACTIVE'
      });
    }
  }, [editingEqub, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: editingEqub?.id || Math.random().toString(36).substr(2, 9)
    } as EqubGroup);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 text-left">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto border dark:border-white/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            {editingEqub ? 'Modify Circle' : 'Establish Circle'}
          </h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-600 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {editingEqub && (
            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-tight">
                Notice: Updating circle parameters will change how progress is calculated in future reports.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Circle Name</label>
            <input 
              type="text" required
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Neighborhood Weekly Equb"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Total Members</label>
              <div className="relative">
                <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                <input 
                  type="number" required min={2}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                  value={formData.membersCount}
                  onChange={(e) => setFormData({...formData, membersCount: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Joined at Round</label>
              <div className="relative">
                <UserPlus size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                <input 
                  type="number" required min={1}
                  max={formData.membersCount}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                  value={formData.joinedAtRound}
                  onChange={(e) => setFormData({...formData, joinedAtRound: parseInt(e.target.value)})}
                  placeholder="Round index you joined"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Frequency</label>
              <select 
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value as Recurrence})}
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="EVERY_10_DAYS">Every 10 Days</option>
                <option value="EVERY_15_DAYS">Every 15 Days</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Round</label>
              <div className="relative">
                <RefreshCw size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                <input 
                  type="number" required min={1}
                  max={formData.membersCount}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                  value={formData.currentRound}
                  onChange={(e) => setFormData({...formData, currentRound: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contribution (ETB)</label>
              <div className="relative">
                <Wallet size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-indigo-400" />
                <input 
                  type="number" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-xl font-black tabular-nums dark:text-white"
                  value={formData.contributionAmount}
                  onChange={(e) => setFormData({...formData, contributionAmount: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">My Turn Index</label>
              <input 
                type="number" required min={1} max={formData.membersCount}
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                value={formData.myTurnIndex}
                onChange={(e) => setFormData({...formData, myTurnIndex: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
            <input 
              type="date" required
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl dark:shadow-none active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
          >
            <Save size={20} />
            {editingEqub ? 'Confirm Update' : 'Establish Circle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EqubModal;
