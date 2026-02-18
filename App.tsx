
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import EqubTracker from './components/EqubTracker.tsx';
import TransactionList from './components/TransactionList.tsx';
import WalletView from './components/WalletView.tsx';
import TransactionModal from './components/TransactionModal.tsx';
import GrowthManager from './components/GrowthManager.tsx';
import GoalModal from './components/GoalModal.tsx';
import Reports from './components/Reports.tsx';
import LoanManager from './components/LoanManager.tsx';
import LoanModal from './components/LoanModal.tsx';
import ScheduleView from './components/ScheduleView.tsx';
import AssetsManager from './components/AssetsManager.tsx';
import AccountingManager from './components/AccountingManager.tsx';
import EqubModal from './components/EqubModal.tsx';
import SecurityOverlay from './components/SecurityOverlay.tsx';
import ChatCenter from './components/ChatCenter.tsx';
import ConfirmationModal from './components/ConfirmationModal.tsx';
import UsersManager from './components/UsersManager.tsx';
import BrandLogo from './components/BrandLogo.tsx';
import JoystickMenu from './components/JoystickMenu.tsx';
import CameraScanner from './components/CameraScanner.tsx';
import { 
  User, 
  UserRole, 
  Transaction, 
  EqubGroup, 
  TransactionType,
  PaymentMethod,
  WalletBalances,
  Goal,
  Loan,
  Asset,
  ChatMessage,
  Investment,
  PlannedPayment,
  SentReport,
  ActivityLog,
  ApprovalRequest
} from './types.ts';
import { MOCK_USERS, MOCK_EQUB_GROUPS, MOCK_TRANSACTIONS, MOCK_ASSETS } from './constants.ts';
import { 
  CheckCircle, AlertCircle, ArrowLeft
} from 'lucide-react';
import { getFinancialAdvice } from './services/geminiService.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isMasked, setIsMasked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [showForgotPass, setShowForgotPass] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('plus_theme') as 'light' | 'dark') || 'dark';
  });
  
  // App Data State
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('plus_users');
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed.length > 0 ? parsed : MOCK_USERS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('plus_transactions');
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed.length > 0 ? parsed : MOCK_TRANSACTIONS;
  });
  const [equbs, setEqubs] = useState<EqubGroup[]>(() => {
    const stored = localStorage.getItem('plus_equbs');
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed.length > 0 ? parsed : MOCK_EQUB_GROUPS;
  });
  const [balances, setBalances] = useState<WalletBalances>(() => {
    const stored = localStorage.getItem('plus_balances');
    const parsed = stored ? JSON.parse(stored) : null;
    return parsed || {
      [PaymentMethod.CASH]: 15000,
      [PaymentMethod.TELEBIRR]: 42400,
      [PaymentMethod.CBE]: 85000,
      [PaymentMethod.EBIRR]: 5500,
    };
  });
  const [assets, setAssets] = useState<Asset[]>(() => {
    const stored = localStorage.getItem('plus_assets');
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed.length > 0 ? parsed : MOCK_ASSETS;
  });
  const [goals, setGoals] = useState<Goal[]>(() => JSON.parse(localStorage.getItem('plus_goals') || '[]'));
  const [investments, setInvestments] = useState<Investment[]>(() => JSON.parse(localStorage.getItem('plus_investments') || '[]'));
  const [plannedPayments, setPlannedPayments] = useState<PlannedPayment[]>(() => JSON.parse(localStorage.getItem('plus_planned') || '[]'));
  const [messages, setMessages] = useState<ChatMessage[]>(() => JSON.parse(localStorage.getItem('plus_messages') || '[]'));
  const [loans, setLoans] = useState<Loan[]>(() => JSON.parse(localStorage.getItem('plus_loans') || '[]'));
  const [sentReports, setSentReports] = useState<SentReport[]>(() => JSON.parse(localStorage.getItem('plus_reports') || '[]'));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => JSON.parse(localStorage.getItem('plus_activity_logs') || '[]'));
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(() => JSON.parse(localStorage.getItem('plus_approval_requests') || '[]'));

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [showEqubModal, setShowEqubModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingEqub, setEditingEqub] = useState<EqubGroup | null>(null);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; title: string; message: string; onConfirm: () => void; type: 'danger' | 'warning';}>({
    isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'danger'
  });

  useEffect(() => {
    localStorage.setItem('plus_users', JSON.stringify(users));
    localStorage.setItem('plus_transactions', JSON.stringify(transactions));
    localStorage.setItem('plus_balances', JSON.stringify(balances));
    localStorage.setItem('plus_equbs', JSON.stringify(equbs));
    localStorage.setItem('plus_assets', JSON.stringify(assets));
    localStorage.setItem('plus_loans', JSON.stringify(loans));
    localStorage.setItem('plus_goals', JSON.stringify(goals));
    localStorage.setItem('plus_investments', JSON.stringify(investments));
    localStorage.setItem('plus_planned', JSON.stringify(plannedPayments));
    localStorage.setItem('plus_reports', JSON.stringify(sentReports));
    localStorage.setItem('plus_activity_logs', JSON.stringify(activityLogs));
    localStorage.setItem('plus_approval_requests', JSON.stringify(approvalRequests));
    localStorage.setItem('plus_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [users, transactions, balances, equbs, assets, loans, goals, investments, plannedPayments, sentReports, activityLogs, approvalRequests, theme]);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const logAction = (action: string, details?: string) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleJoystickAction = async (action: 'ADD_SALES' | 'ADD_EXPENSE' | 'AI_INSIGHT' | 'SCAN') => {
    switch(action) {
      case 'ADD_SALES':
        setModalType(TransactionType.INCOME);
        setEditingTransaction(null);
        setShowTransactionModal(true);
        break;
      case 'ADD_EXPENSE':
        setModalType(TransactionType.EXPENSE);
        setEditingTransaction(null);
        setShowTransactionModal(true);
        break;
      case 'AI_INSIGHT':
        notify("Analyzing Zone data...");
        const advice = await getFinancialAdvice(transactions);
        setConfirmModal({
          isOpen: true,
          title: "AI Strategy Insight",
          message: advice,
          type: 'warning',
          onConfirm: () => {}
        });
        break;
      case 'SCAN':
        setShowScanner(true);
        break;
    }
  };

  const handleTransactionSubmit = (formData: any) => {
    const amount = parseFloat(formData.amount);
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...formData, amount } : t));
      logAction('Updated Transaction', `${formData.note} - ${amount} ETB`);
    } else {
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount,
        type: formData.type,
        method: formData.method,
        category: formData.category,
        note: formData.note,
        vendor: formData.vendor || 'Zone Floor',
        date: formData.date || new Date().toISOString(),
        isAutoGenerated: false
      };
      setTransactions(prev => [newTx, ...prev]);
      logAction(`Recorded ${formData.type}`, `${formData.note} - ${amount} ETB`);
    }
    setShowTransactionModal(false);
    setEditingTransaction(null);
    notify("Ledger Updated");
  };

  const handleLoanPay = (loanId: string, amount: number) => {
    logAction('Paid Loan Installment', `${loanId} - ${amount} ETB`);
    notify("Repayment Processed");
  };

  const handleEqubSettle = (group: EqubGroup) => {
    logAction('Equb Contribution', `${group.name} - Round ${group.currentRound}`);
    notify("Contribution Recorded");
  };

  const handleTransfer = (from: PaymentMethod, to: PaymentMethod, amount: number) => {
    logAction('Balance Swap', `${from} to ${to} - ${amount} ETB`);
    notify("Swap Successful");
  };

  const requestDeleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    setConfirmModal({
      isOpen: true,
      title: 'Delete Transaction',
      message: `Are you sure you want to permanently erase the record "${tx.note || 'General'}" of ${tx.amount} ETB?`,
      type: 'danger',
      onConfirm: () => {
        setTransactions(prev => prev.filter(t => t.id !== id));
        logAction('Deleted Transaction', `${tx.note} - ${tx.amount} ETB`);
        notify("Record Removed");
      }
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl p-12 border border-slate-200 dark:border-white/5 text-left">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mx-auto mb-6">
              <BrandLogo size="xl" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">Plus Zone</h1>
            <p className="text-indigo-600 font-black uppercase text-[10px]">Managing Partner • Secure Entry</p>
          </div>

          {!showForgotPass ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              const normalizedEmail = loginEmail.trim().toLowerCase();
              const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.pin === password);
              if (user) {
                setCurrentUser(user);
                setAuthError('');
              } else {
                setAuthError('Access Denied: Invalid Credentials');
              }
            }} className="space-y-6">
              <input 
                type="email" required placeholder="PARTNER EMAIL" 
                className="w-full py-5 px-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xl text-center outline-none font-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 uppercase" 
                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} 
              />
              <input 
                type="password" maxLength={4} required placeholder="ACCESS PIN" 
                className="w-full py-5 px-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xl text-center outline-none font-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 tracking-widest" 
                value={password} onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))} 
              />
              {authError && <p className="text-xs font-bold text-rose-500 text-center">{authError}</p>}
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95">Authenticate</button>
              <button type="button" onClick={() => setShowForgotPass(true)} className="w-full text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest hover:text-indigo-600 transition-colors">Forgot Access PIN?</button>
            </form>
          ) : (
            <div className="text-center">
               <button onClick={() => setShowForgotPass(false)} className="flex items-center gap-2 mb-8 text-slate-400 font-black text-[10px] uppercase tracking-widest"><ArrowLeft size={16} /> Back</button>
               <p className="text-sm font-medium dark:text-slate-400 mb-6 leading-relaxed">Please contact the Managing Partner (Super Admin) to retrieve or reset your authorized access credentials for this terminal.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        userRole={currentUser.role} userName={currentUser.name} 
        onLogout={() => setCurrentUser(null)} isMasked={isMasked}
        onToggleMask={() => setIsMasked(!isMasked)} onLock={() => setIsLocked(true)}
        theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <div className="max-w-7xl mx-auto space-y-8 pb-32 relative text-left">
          {notification && (
            <div className={`fixed top-24 right-8 z-[200] px-10 py-6 rounded-[2.5rem] shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center gap-4 animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'text-indigo-700 dark:text-indigo-300' : 'text-rose-600'}`}>
              {notification.type === 'success' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
              <p className="font-black tracking-tight uppercase text-[10px]">{notification.message}</p>
            </div>
          )}

          {activeTab === 'dashboard' && <Dashboard transactions={transactions} isMasked={isMasked} />}
          {activeTab === 'income' && <TransactionList type={TransactionType.INCOME} transactions={transactions} userRole={currentUser.role} onAdd={() => { setModalType(TransactionType.INCOME); setEditingTransaction(null); setShowTransactionModal(true); }} onDelete={requestDeleteTransaction} onEdit={(tx) => { setEditingTransaction(tx); setModalType(TransactionType.INCOME); setShowTransactionModal(true); }} />}
          {activeTab === 'expense' && <TransactionList type={TransactionType.EXPENSE} transactions={transactions} userRole={currentUser.role} onAdd={() => { setModalType(TransactionType.EXPENSE); setEditingTransaction(null); setShowTransactionModal(true); }} onDelete={requestDeleteTransaction} onEdit={(tx) => { setEditingTransaction(tx); setModalType(TransactionType.EXPENSE); setShowTransactionModal(true); }} />}
          {activeTab === 'wallet' && <WalletView balances={balances} transactions={transactions} onTransfer={handleTransfer} onAddFunds={() => {}} />}
          {activeTab === 'equb' && <EqubTracker groups={equbs} isAdmin={currentUser.role !== UserRole.MEMBER} onAdd={() => { setEditingEqub(null); setShowEqubModal(true); }} onSettle={handleEqubSettle} onEdit={(e) => { setEditingEqub(e); setShowEqubModal(true); }} onDelete={(id) => setEqubs(p => p.filter(i => i.id !== id))} />}
          {activeTab === 'loans' && <LoanManager loans={loans} onPay={handleLoanPay} onAdd={() => { setEditingLoan(null); setShowLoanModal(true); }} onEdit={(l) => { setEditingLoan(l); setShowLoanModal(true); }} onDelete={(id) => setLoans(p => p.filter(i => i.id !== id))} isAdmin={currentUser.role !== UserRole.MEMBER} />}
          {activeTab === 'growth' && <GrowthManager goals={goals} planned={plannedPayments} onAddGoal={() => { setEditingGoal(null); setShowGoalModal(true); }} onEditGoal={(g) => { setEditingGoal(g); setShowGoalModal(true); }} onDeleteGoal={(id) => setGoals(p => p.filter(g => g.id !== id))} isAdmin={currentUser.role !== UserRole.MEMBER} />}
          {activeTab === 'chat' && <ChatCenter messages={messages} currentUser={currentUser} onSendMessage={(t,c) => setMessages(p => [...p, { id: Math.random().toString(), senderId: currentUser.id, senderName: currentUser.name, text: t, timestamp: new Date().toISOString(), channel: c }])} />}
          {activeTab === 'schedule' && <ScheduleView equbs={equbs} loans={loans} planned={plannedPayments} onPayLoan={handleLoanPay} />}
          {activeTab === 'reports' && <Reports transactions={transactions} loans={loans} equbs={equbs} goals={goals} />}
          {activeTab === 'accounting' && <AccountingManager transactions={transactions} users={users} currentUser={currentUser} onSendReport={(r) => { setSentReports(p => [r, ...p]); logAction('Dispatch Report', `${r.month} ${r.year}`); }} onApproveReport={(id) => { setSentReports(p => p.map(r => r.id === id ? { ...r, status: 'SENT', approvedById: currentUser.id, approvedAt: new Date().toISOString() } : r)); logAction('Authorized Ledger Node', id); }} sentReports={sentReports} />}
          {activeTab === 'assets' && <AssetsManager assets={assets} onAdd={(a) => { setAssets(p => [a, ...p]); logAction('Added Asset', a.name); }} onUpdate={(a) => { setAssets(p => p.map(i => i.id === a.id ? a : i)); logAction('Updated Asset', a.name); }} onDelete={(id) => setAssets(p => p.filter(i => i.id !== id))} isAdmin={currentUser.role !== UserRole.MEMBER} />}
          {activeTab === 'users' && <UsersManager users={users} currentUser={currentUser} onUpdateUser={(u) => setUsers(p => p.map(i => i.id === u.id ? u : i))} onAddPartner={(u) => setUsers(p => [...p, u])} onDelete={(id) => setUsers(p => p.filter(i => i.id !== id))} />}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-10 text-left">
               <div className="p-12 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-2xl transition-all">
                  <h3 className="text-4xl font-black tracking-tighter uppercase mb-8 dark:text-white">Zone Command</h3>
                  <div className="p-8 rounded-[2.5rem] text-left mb-8 flex items-center justify-between border bg-slate-50 dark:bg-slate-950 dark:border-white/5">
                     <div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Authenticated Partner</p>
                        <p className="text-2xl font-black dark:text-white">{currentUser.name}</p>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{currentUser.role.replace('_', ' ')}</p>
                     </div>
                  </div>
                  <button onClick={() => setCurrentUser(null)} className="w-full py-6 bg-rose-600 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-95 shadow-xl">Terminate Session</button>
               </div>
            </div>
          )}
        </div>
      </Layout>

      {/* Interaction Overlays - Rendered outside Layout for global z-index management */}
      <JoystickMenu onAction={handleJoystickAction} />
      
      {isLocked && <SecurityOverlay onUnlock={(enteredPin) => { if (enteredPin === currentUser.pin) setIsLocked(false); else setAuthError('Invalid PIN'); }} error={authError} />}
      
      {confirmModal.isOpen && (
        <ConfirmationModal 
          isOpen={confirmModal.isOpen} 
          onClose={() => setConfirmModal(prev => ({...prev, isOpen: false}))} 
          onConfirm={confirmModal.onConfirm} 
          title={confirmModal.title} 
          message={confirmModal.message} 
          type={confirmModal.type} 
        />
      )}
      
      {showTransactionModal && <TransactionModal isOpen={showTransactionModal} onClose={() => { setShowTransactionModal(false); setEditingTransaction(null); }} onSubmit={handleTransactionSubmit} initialType={modalType} editingTransaction={editingTransaction} />}
      {showEqubModal && <EqubModal isOpen={showEqubModal} onClose={() => { setShowEqubModal(false); setEditingEqub(null); }} onSubmit={(data) => { setEqubs(prev => editingEqub ? prev.map(e => e.id === editingEqub.id ? data : e) : [data, ...prev]); setShowEqubModal(false); notify("Circle Updated"); }} editingEqub={editingEqub} />}
      {showLoanModal && <LoanModal isOpen={showLoanModal} onClose={() => { setShowLoanModal(false); setEditingLoan(null); }} onSubmit={(data) => { setLoans(prev => editingLoan ? prev.map(l => l.id === editingLoan.id ? data : l) : [data, ...prev]); setShowLoanModal(false); notify("Loan Indexed"); }} editingLoan={editingLoan} />}
      {showGoalModal && <GoalModal isOpen={showGoalModal} onClose={() => { setShowGoalModal(false); setEditingGoal(null); }} onSubmit={(data) => { setGoals(prev => editingGoal ? prev.map(g => g.id === editingGoal.id ? data : g) : [data, ...prev]); setShowGoalModal(false); notify("Goal Targeted"); }} editingGoal={editingGoal} />}
      {showScanner && <CameraScanner onClose={() => setShowScanner(false)} onParsed={(data) => { handleTransactionSubmit({ ...data, note: `Vision Scan: ${data.vendor || 'Receipt'}` }); setShowScanner(false); }} />}
    </>
  );
};

export default App;
