import React, { useState, useEffect } from 'react';
import { TransactionType, PaymentMethod, ExpenseCategory, Transaction } from '../types';
import { X, Save, Coins, Wrench, AlertCircle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialType: TransactionType;
  editingTransaction?: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSubmit, initialType, editingTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: initialType,
    method: PaymentMethod.CASH,
    category: ExpenseCategory.OTHER,
    note: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount.toString(),
        type: editingTransaction.type,
        method: editingTransaction.method,
        category: editingTransaction.category || ExpenseCategory.OTHER,
        note: editingTransaction.note || '',
        vendor: editingTransaction.vendor || '',
        date: new Date(editingTransaction.date).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        amount: '',
        type: initialType,
        method: PaymentMethod.CASH,
        category: ExpenseCategory.OTHER,
        note: '',
        vendor: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingTransaction, initialType, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 text-left">
      <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300 max-h-[95vh] flex flex-col border dark:border-white/5">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50 text-left">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${formData.type === TransactionType.INCOME ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
              {formData.type === TransactionType.INCOME ? <Coins size={20} /> : <Wrench size={20} />}
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
              {editingTransaction ? 'Modify Entry' : (formData.type === TransactionType.INCOME ? 'Add Sales' : 'Add Expense')}
            </h3>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-all">
            <X size={24} />
          </button>
        </div>
        
        <form className="p-6 sm:p-10 space-y-8 overflow-y-auto text-left" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          {editingTransaction && (
            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-tight">
                Warning: Editing this record will automatically adjust your consolidated wallet balances.
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Amount</label>
              <div className="relative">
                <input 
                  type="number" required
                  className="w-full p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[2rem] text-4xl font-black focus:border-indigo-500 outline-none text-indigo-600 dark:text-indigo-400 placeholder:text-slate-200 dark:placeholder:text-slate-800"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 dark:text-slate-600">ETB</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Paid via</label>
                <select 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl font-black text-xs uppercase dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={formData.method}
                  onChange={(e) => setFormData({...formData, method: e.target.value as PaymentMethod})}
                >
                  {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Category</label>
                <select 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl font-black text-xs uppercase dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as ExpenseCategory})}
                >
                  {Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Note</label>
              <input 
                type="text" placeholder="e.g. PS5 Tokens, Repair, CBE Transfer"
                className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Date</label>
              <input 
                type="date" required
                className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-6 rounded-[2rem] font-black text-xl text-white uppercase shadow-2xl dark:shadow-none transition-all active:scale-95 ${
              formData.type === TransactionType.INCOME ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'
            }`}
          >
            <Save size={24} className="inline mr-2" />
            {editingTransaction ? 'Confirm Update' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;