
import React, { useState, useEffect } from 'react';
import { X, Save, Percent, Calculator, Landmark } from 'lucide-react';
import { Loan, PaymentMethod, Recurrence } from '../types';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Loan) => void;
  editingLoan?: Loan | null;
}

const LoanModal: React.FC<LoanModalProps> = ({ isOpen, onClose, onSubmit, editingLoan }) => {
  const [formData, setFormData] = useState<Partial<Loan>>({
    loanName: '',
    lenderName: '',
    totalAmount: 0,
    interestRate: 14,
    durationMonths: 24,
    monthlyRepayment: 0,
    monthlyCompulsorySaving: 0,
    remainingAmount: 0,
    startDate: new Date().toISOString().split('T')[0],
    nextPaymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: PaymentMethod.CBE,
    paymentsMadeCount: 0,
    recurrence: 'MONTHLY' as Recurrence
  });

  useEffect(() => {
    if (editingLoan) {
      setFormData(editingLoan);
    } else {
      setFormData({
        loanName: '',
        lenderName: '',
        totalAmount: 0,
        interestRate: 14,
        durationMonths: 24,
        monthlyRepayment: 0,
        monthlyCompulsorySaving: 0,
        remainingAmount: 0,
        startDate: new Date().toISOString().split('T')[0],
        nextPaymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: PaymentMethod.CBE,
        paymentsMadeCount: 0,
        recurrence: 'MONTHLY' as Recurrence
      });
    }
  }, [editingLoan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = Number(formData.totalAmount) || 0;
    const duration = Number(formData.durationMonths) || 12;
    const interest = Number(formData.interestRate) || 0;
    
    const totalInterest = (totalAmount * (interest / 100)) * (duration / 12);
    const totalPayable = totalAmount + totalInterest;
    const monthly = totalPayable / duration;
    
    const endDate = new Date(formData.startDate!);
    endDate.setMonth(endDate.getMonth() + duration);

    const paymentsMade = Number(formData.paymentsMadeCount) || 0;
    const remaining = totalPayable - (paymentsMade * monthly);

    onSubmit({
      ...formData,
      id: editingLoan?.id || Math.random().toString(36).substr(2, 9),
      totalInterest,
      totalPayableAmount: totalPayable,
      monthlyRepayment: monthly,
      remainingAmount: remaining,
      endDate: endDate.toISOString().split('T')[0],
      paymentsRemainingCount: duration - paymentsMade
    } as Loan);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 text-left">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] border dark:border-white/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            {editingLoan ? 'Modify Loan' : 'Register Loan'}
          </h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-600 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contract Name</label>
              <input 
                type="text" required
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                value={formData.loanName}
                onChange={(e) => setFormData({...formData, loanName: e.target.value})}
                placeholder="e.g. Expansion Loan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Lender / Institution</label>
              <div className="relative">
                <Landmark size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                <input 
                  type="text" required
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                  value={formData.lenderName}
                  onChange={(e) => setFormData({...formData, lenderName: e.target.value})}
                  placeholder="e.g. Aggar MF"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Principal (ETB)</label>
              <input 
                type="number" required
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                value={formData.totalAmount}
                onChange={(e) => setFormData({...formData, totalAmount: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Rate (%)</label>
              <div className="relative">
                <Percent size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                <input 
                  type="number" required
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({...formData, interestRate: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Tenure (Months)</label>
              <input 
                type="number" required
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                value={formData.durationMonths}
                onChange={(e) => setFormData({...formData, durationMonths: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Payments Made</label>
              <input 
                type="number" required min={0} max={formData.durationMonths}
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                value={formData.paymentsMadeCount}
                onChange={(e) => setFormData({...formData, paymentsMadeCount: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Monthly Saving (ETB)</label>
              <input 
                type="number"
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                value={formData.monthlyCompulsorySaving}
                onChange={(e) => setFormData({...formData, monthlyCompulsorySaving: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
              <input 
                type="date" required
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Method</label>
              <select 
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})}
              >
                {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-2xl dark:shadow-none active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
          >
            <Calculator size={20} />
            {editingLoan ? 'Update Contract' : 'Authorize Contract'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanModal;
