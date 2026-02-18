
import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Send, 
  Users, 
  Calendar, 
  CheckCircle, 
  Download, 
  Calculator, 
  ArrowRight,
  Share2,
  Bell,
  X,
  Plus,
  Inbox,
  Clock,
  Printer,
  FileCheck,
  ChevronRight,
  Eye,
  Check,
  Zap,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Transaction, TransactionType, User, SentReport, UserRole } from '../types';

interface AccountingManagerProps {
  transactions: Transaction[];
  users: User[];
  currentUser: User;
  onSendReport: (report: SentReport) => void;
  onApproveReport: (reportId: string) => void;
  sentReports: SentReport[];
}

const AccountingManager: React.FC<AccountingManagerProps> = ({ 
  transactions, 
  users, 
  currentUser, 
  onSendReport,
  onApproveReport,
  sentReports
}) => {
  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  
  const [activeSubTab, setActiveSubTab] = useState<'DISPATCH' | 'INBOX' | 'QUEUE'>(isAdmin ? 'DISPATCH' : 'INBOX');
  const [showSendModal, setShowSendModal] = useState(false);
  const [viewingReport, setViewingReport] = useState<SentReport | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [reportType, setReportType] = useState<'MONTHLY' | 'OCCASIONAL'>('MONTHLY');
  const [occasionName, setOccasionName] = useState('');
  const [isAutoEnabled, setIsAutoEnabled] = useState(true);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const reportStats = useMemo(() => {
    const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
    
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const inboxReports = useMemo(() => {
    return sentReports.filter(r => r.status === 'SENT' && r.recipientIds.includes(currentUser.id));
  }, [sentReports, currentUser.id]);

  const pendingReports = useMemo(() => {
    return sentReports.filter(r => r.status === 'PENDING');
  }, [sentReports]);

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSend = () => {
    if (selectedUsers.length === 0) return;

    const newReport: SentReport = {
      id: Math.random().toString(36).substr(2, 9),
      generatedAt: new Date().toISOString(),
      month: currentMonth,
      year: currentYear,
      senderId: currentUser.id,
      recipientIds: selectedUsers,
      type: reportType,
      occasionName: reportType === 'OCCASIONAL' ? occasionName : undefined,
      status: isSuperAdmin ? 'SENT' : 'PENDING',
      approvedById: isSuperAdmin ? currentUser.id : undefined,
      approvedAt: isSuperAdmin ? new Date().toISOString() : undefined,
      summary: {
        totalIncome: reportStats.income,
        totalExpense: reportStats.expense,
        netBalance: reportStats.balance
      }
    };

    onSendReport(newReport);
    setShowSendModal(false);
    setSelectedUsers([]);
    setOccasionName('');
  };

  const handleApprove = (reportId: string) => {
    onApproveReport(reportId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Official Ledger</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">Plus Game Zone authorized financial statement hub</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <button 
              onClick={() => setActiveSubTab('INBOX')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeSubTab === 'INBOX' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              <Inbox size={16} />
              Inbox ({inboxReports.length})
            </button>
            {isAdmin && (
              <button 
                onClick={() => setActiveSubTab('DISPATCH')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeSubTab === 'DISPATCH' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
              >
                <FileText size={16} />
                Hub
              </button>
            )}
            {isSuperAdmin && (
              <button 
                onClick={() => setActiveSubTab('QUEUE')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeSubTab === 'QUEUE' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
              >
                <ShieldCheck size={16} />
                Queue ({pendingReports.length})
              </button>
            )}
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowSendModal(true)}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl dark:shadow-none font-black text-sm active:scale-95"
            >
              <Share2 size={20} />
              Dispatch
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-10 rounded-[2.5rem] bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-950 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2 text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
            <Calculator size={180} />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Plus Game Zone Master Ledger</p>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-black tabular-nums">{reportStats.balance.toLocaleString()}</span>
              <span className="text-xl font-bold opacity-60">ETB</span>
            </div>
            <div className="mt-8 flex items-center gap-6">
              <div className="px-5 py-2.5 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                {currentMonth} Portfolio
              </div>
              <div className="flex items-center gap-2 text-emerald-300 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle size={16} />
                  Audited & Verified
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-blue-500 dark:from-indigo-600 dark:to-blue-800 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left">
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <Bell size={140} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 p-2 rounded-xl w-fit mb-4">
              <Calendar size={24} />
            </div>
            <h4 className="text-xl font-black mb-1">Authorization Node</h4>
            <div className="flex items-center justify-between mt-4 bg-white/10 p-4 rounded-2xl">
               <span className="text-xs font-black uppercase tracking-widest">Automation</span>
               <button 
                onClick={() => setIsAutoEnabled(!isAutoEnabled)}
                className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${isAutoEnabled ? 'bg-emerald-400' : 'bg-slate-400 dark:bg-slate-700'}`}
               >
                 <div className={`w-4 h-4 bg-white rounded-full transition-all ${isAutoEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden p-10">
        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight flex items-center gap-3">
          <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />
          Plus Game Zone Statement Journal
        </h4>
        <div className="space-y-4">
          {activeSubTab === 'INBOX' ? (
            inboxReports.map((report) => (
              <div key={report.id} onClick={() => setViewingReport(report)} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <FileCheck size={24} className="dark:text-white" />
                    </div>
                    <div>
                      <p className="font-black text-lg text-slate-800 dark:text-white">{report.type === 'MONTHLY' ? `${report.month} ${report.year}` : report.occasionName}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Authorized by {users.find(u => u.id === report.approvedById)?.name || 'Managing Partner'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-right">
                        <p className="text-xl font-black text-slate-900 dark:text-white">{report.summary.netBalance.toLocaleString()} ETB</p>
                        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Signed Statement</p>
                     </div>
                     <ChevronRight size={24} className="text-slate-200 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            pendingReports.map((report) => (
              <div key={report.id} className="p-8 bg-amber-50 dark:bg-amber-500/10 rounded-[2.5rem] border border-amber-100 dark:border-amber-500/20 group transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-amber-600 dark:text-amber-400">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="font-black text-lg text-slate-800 dark:text-white">{report.type === 'MONTHLY' ? `${report.month} ${report.year}` : report.occasionName}</p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-500 font-bold uppercase tracking-widest">Awaiting Verification</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <button 
                      onClick={() => handleApprove(report.id)}
                      className="px-6 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl dark:shadow-none"
                     >
                       Approve & Dispatch
                     </button>
                  </div>
                </div>
              </div>
            ))
          )}
          {(activeSubTab === 'INBOX' ? inboxReports.length : pendingReports.length) === 0 && (
            <div className="py-24 text-center">
               <FileText size={64} className="mx-auto opacity-10 mb-6 dark:text-white" />
               <p className="font-black text-xl text-slate-900 dark:text-white">Journal Empty</p>
               <p className="text-sm font-medium mt-1 dark:text-slate-500">Authorized statements for Plus Game Zone will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Viewing Modal */}
      {viewingReport && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md z-[250] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[4rem] w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden border dark:border-white/5 text-left">
             <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                      <FileText size={28} />
                   </div>
                   <h3 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Official Statement</h3>
                </div>
                <button onClick={() => setViewingReport(null)} className="p-4 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/5">
                   <X size={22} />
                </button>
             </div>
             <div className="p-12 space-y-10 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl border border-emerald-100 dark:border-emerald-500/20">
                      <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 text-left">Total Inflow</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">+{viewingReport.summary.totalIncome.toLocaleString()}</p>
                   </div>
                   <div className="p-8 bg-rose-50 dark:bg-rose-500/10 rounded-3xl border border-rose-100 dark:border-rose-500/20">
                      <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-2 text-left">Total Outflow</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">-{viewingReport.summary.totalExpense.toLocaleString()}</p>
                   </div>
                   <div className="p-8 bg-indigo-600 rounded-3xl shadow-xl dark:shadow-none text-white">
                      <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2 text-left">Net Balance</p>
                      <p className="text-2xl font-black">{viewingReport.summary.netBalance.toLocaleString()} ETB</p>
                   </div>
                </div>

                <div className="p-10 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-center">
                   <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Official Verification</p>
                   <div className="flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-400">
                      <ShieldCheck size={48} />
                      <div className="text-left">
                         <p className="text-lg font-black leading-tight uppercase tracking-tight dark:text-white">Plus Game Zone Certified</p>
                         <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Authorized by {users.find(u => u.id === viewingReport.approvedById)?.name || 'Managing Partner'} on {new Date(viewingReport.approvedAt!).toLocaleDateString()}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingManager;
