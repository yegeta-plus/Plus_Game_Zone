
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import OptionsManager from './components/OptionsManager.tsx';
import UsersManager from './components/UsersManager.tsx';
import AdminReport from './components/AdminReport.tsx';
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
  ExpenseCategory,
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
  ShieldCheck, CheckCircle, AlertCircle, LogOut, Quote, Gamepad2, ArrowRight, Sun, Moon, Sparkles, RefreshCcw, Key, Mail, Send, Globe, Cpu, Terminal, Copy, ExternalLink, ArrowLeft
} from 'lucide-react';
import { generateGamingImage, getFinancialAdvice } from './services/geminiService.ts';

const GAMING_QUOTES = [
  { text: "It's dangerous to go alone! Take this.", source: "The Legend of Zelda" },
  { text: "The right man in the wrong place can make all the difference in the world.", source: "Half-Life 2" },
  { text: "Stay awhile and listen!", source: "Diablo II" },
  { text: "What is a man? A miserable little pile of secrets.", source: "Castlevania: SotN" },
  { text: "War. War never changes.", source: "Fallout" },
  { text: "Even in the darkest of times, there is always hope.", source: "Dragon Age" },
  { text: "A man chooses, a slave obeys.", source: "BioShock" },
  { text: "Nothing is true, everything is permitted.", source: "Assassin's Creed" },
  { text: "Wake up, Mr. Freeman. Wake up and smell the ashes.", source: "Half-Life 2" },
  { text: "Praise the Sun!", source: "Dark Souls" }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(GAMING_QUOTES[0]);
  const [isLocked, setIsLocked] = useState(false);
  const [isMasked, setIsMasked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [showForgotPass, setShowForgotPass] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('plus_theme') as 'light' | 'dark') || 'light';
  });
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
  const [transitionImage, setTransitionImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // App Data State with robust fallbacks
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
      [PaymentMethod.CASH]: 5000,
      [PaymentMethod.TELEBIRR]: 12400,
      [PaymentMethod.CBE]: 25000,
      [PaymentMethod.EBIRR]: 1500,
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
  }, [users, transactions, balances, equbs, assets, loans, goals, investments, plannedPayments, sentReports, activityLogs, approvalRequests]);

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
    notify(action);
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

  const handleScannerParsed = (data: any) => {
    handleTransactionSubmit({
      ...data,
      note: `Scanned: ${data.vendor || 'Receipt'}`,
      date: new Date().toISOString().split('T')[0]
    });
    setShowScanner(false);
  };

  const requestDeleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    setConfirmModal({
      isOpen: true,
      title: 'Delete Transaction',
      message: `Are you sure you want to permanently erase the record "${tx.note || 'General'}" of ${tx.amount} ETB? This will affect your current wallet balances.`,
      type: 'danger',
      onConfirm: () => {
        setBalances(prev => {
          const modifier = tx.type === TransactionType.INCOME ? -tx.amount : tx.amount;
          return { ...prev, [tx.method]: (prev[tx.method] || 0) + modifier };
        });
        setTransactions(prev => prev.filter(t => t.id !== id));
        logAction('Deleted Transaction', `${tx.note} - ${tx.amount} ETB`);
      }
    });
  };

  const handleToggleTheme = async () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    const randomQuote = GAMING_QUOTES[Math.floor(Math.random() * GAMING_QUOTES.length)];
    setSelectedQuote(randomQuote);
    setIsThemeTransitioning(true);
    setTransitionImage(null);
    setIsGeneratingImage(true);
    setTheme(nextTheme);
    const imageUrl = await generateGamingImage(randomQuote.text);
    setTransitionImage(imageUrl);
    setIsGeneratingImage(false);
  };

  const handleTransactionSubmit = (formData: any) => {
    const amount = parseFloat(formData.amount);
    if (editingTransaction) {
      setBalances(prev => {
        const modifier = editingTransaction.type === TransactionType.INCOME ? -editingTransaction.amount : editingTransaction.amount;
        return { ...prev, [editingTransaction.method]: (prev[editingTransaction.method] || 0) + modifier };
      });
      setBalances(prev => {
        const modifier = formData.type === TransactionType.INCOME ? amount : -amount;
        return { ...prev, [formData.method]: (prev[formData.method] || 0) + modifier };
      });
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...formData, amount } : t));
      logAction('Updated Transaction', `${formData.note} - ${amount} ETB`);
    } else {
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: amount,
        type: formData.type,
        method: formData.method,
        category: formData.category,
        note: formData.note,
        vendor: formData.vendor || 'Floor',
        date: formData.date || new Date().toISOString(),
        isAutoGenerated: false
      };
      setTransactions(prev => [newTx, ...prev]);
      setBalances(prev => {
        const modifier = formData.type === TransactionType.INCOME ? amount : -amount;
        return { ...prev, [formData.method]: (prev[formData.method] || 0) + modifier };
      });
      logAction(`Recorded ${formData.type}`, `${formData.note} - ${amount} ETB`);
    }
    setShowTransactionModal(false);
    setEditingTransaction(null);
  };

  const handleEqubSubmit = (data: EqubGroup) => {
    if (editingEqub) {
      setEqubs(prev => prev.map(e => e.id === editingEqub.id ? data : e));
      logAction('Updated Equb Circle', data.name);
    } else {
      setEqubs(prev => [data, ...prev]);
      logAction('Created Equb Circle', data.name);
    }
    setShowEqubModal(false);
    setEditingEqub(null);
  };

  const handleLoanSubmit = (data: Loan) => {
    if (editingLoan) {
      setLoans(prev => prev.map(l => l.id === editingLoan.id ? data : l));
      logAction('Updated Loan Contract', data.loanName);
    } else {
      setLoans(prev => [data, ...prev]);
      logAction('Registered New Loan', data.loanName);
    }
    setShowLoanModal(false);
    setEditingLoan(null);
  };

  const handleGoalSubmit = (data: Goal) => {
    if (editingGoal) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? data : g));
      logAction('Updated Financial Goal', data.title);
    } else {
      setGoals(prev => [data, ...prev]);
      logAction('Established New Goal', data.title);
    }
    setShowGoalModal(false);
    setEditingGoal(null);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingRecovery(true);
    setTimeout(() => {
      setIsSendingRecovery(false);
      setShowForgotPass(false);
      notify("Recovery signal sent to " + forgotEmail);
      setForgotEmail('');
    }, 1500);
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
                const randomQuote = GAMING_QUOTES[Math.floor(Math.random() * GAMING_QUOTES.length)];
                setSelectedQuote(randomQuote);
                setCurrentUser(user);
                setShowQuote(true);
                setAuthError('');
              } else {
                setAuthError('Access Denied: Invalid Credentials');
              }
            }} className="space-y-6">
              <input 
                type="email" required placeholder="PARTNER EMAIL" 
                className="w-full py-5 px-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xl text-center outline-none font-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} 
              />
              <input 
                type="password" maxLength={4} required placeholder="ACCESS PIN" 
                className="w-full py-5 px-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xl text-center outline-none font-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 tracking-widest" 
                value={password} onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))} 
              />
              {authError && <p className="text-xs font-bold text-rose-500 text-center animate-shake">{authError}</p>}
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95">Authenticate</button>
              <button 
                type="button" 
                onClick={() => setShowForgotPass(true)} 
                className="w-full text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                Forgot Access PIN?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
               <div className="flex items-center gap-2 mb-4">
                 <button 
                   type="button" 
                   onClick={() => setShowForgotPass(false)} 
                   className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                 >
                   <ArrowLeft size={20} />
                 </button>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Return to Login</span>
               </div>
               <input 
                 type="email" required placeholder="RECOVERY EMAIL" 
                 className="w-full py-5 px-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xl text-center font-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" 
                 value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} 
               />
               <button type="submit" disabled={isSendingRecovery} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50">
                 {isSendingRecovery ? 'Sending Signal...' : 'Send Signal'}
               </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {isLocked && <SecurityOverlay onUnlock={(enteredPin) => { if (currentUser && enteredPin === currentUser.pin) setIsLocked(false); else setAuthError('Invalid PIN'); }} error={authError} />}
      <ConfirmationModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal(prev => ({...prev, isOpen: false}))} onConfirm={confirmModal.onConfirm} title={confirmModal.title} message={confirmModal.message} type={confirmModal.type} />
      
      {showTransactionModal && <TransactionModal isOpen={showTransactionModal} onClose={() => { setShowTransactionModal(false); setEditingTransaction(null); }} onSubmit={handleTransactionSubmit} initialType={modalType} editingTransaction={editingTransaction} />}
      {showEqubModal && <EqubModal isOpen={showEqubModal} onClose={() => { setShowEqubModal(false); setEditingEqub(null); }} onSubmit={handleEqubSubmit} editingEqub={editingEqub} />}
      {showLoanModal && <LoanModal isOpen={showLoanModal} onClose={() => { setShowLoanModal(false); setEditingLoan(null); }} onSubmit={handleLoanSubmit} editingLoan={editingLoan} />}
      {showGoalModal && <GoalModal isOpen={showGoalModal} onClose={() => { setShowGoalModal(false); setEditingGoal(null); }} onSubmit={handleGoalSubmit} editingGoal={editingGoal} />}
      {showScanner && <CameraScanner onClose={() => setShowScanner(false)} onParsed={handleScannerParsed} />}

      <JoystickMenu onAction={handleJoystickAction} />
      
      <Layout 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        userRole={currentUser.role} userName={currentUser.name} 
        onLogout={() => setCurrentUser(null)} isMasked={isMasked}
        onToggleMask={() => setIsMasked(!isMasked)} onLock={() => setIsLocked(true)}
        theme={theme} onToggleTheme={handleToggleTheme}
      >
        <div className="max-w-7xl mx-auto space-y-8 pb-32 relative text-left">
          {notification && (
            <div className={`fixed top-24 right-8 z-[200] px-10 py-6 rounded-[2.5rem] shadow-2xl bg-white/90 backdrop-blur-md flex items-center gap-4 animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'text-indigo-700' : 'text-rose-600'}`}>
              {notification.type === 'success' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
              <p className="font-black tracking-tight">{notification.message}</p>
            </div>
          )}

          {activeTab === 'dashboard' && <Dashboard transactions={transactions} isMasked={isMasked} />}
          
          {activeTab === 'income' && <TransactionList type={TransactionType.INCOME} transactions={transactions} userRole={currentUser.role} onAdd={() => { setModalType(TransactionType.INCOME); setEditingTransaction(null); setShowTransactionModal(true); }} onDelete={requestDeleteTransaction} onEdit={(tx) => { setEditingTransaction(tx); setModalType(TransactionType.INCOME); setShowTransactionModal(true); }} />}
          
          {activeTab === 'expense' && <TransactionList type={TransactionType.EXPENSE} transactions={transactions} userRole={currentUser.role} onAdd={() => { setModalType(TransactionType.EXPENSE); setEditingTransaction(null); setShowTransactionModal(true); }} onDelete={requestDeleteTransaction} onEdit={(tx) => { setEditingTransaction(tx); setModalType(TransactionType.EXPENSE); setShowTransactionModal(true); }} />}

          {activeTab === 'assets' && <AssetsManager assets={assets} onAdd={(a) => { setAssets(p => [a, ...p]); logAction('Added Asset', a.name); }} onUpdate={(a) => { setAssets(p => p.map(i => i.id === a.id ? a : i)); logAction('Updated Asset', a.name); }} onDelete={(id) => setAssets(p => p.filter(i => i.id !== id))} isAdmin={currentUser.role !== UserRole.MEMBER} />}
          
          {activeTab === 'wallet' && <WalletView balances={balances} transactions={transactions} onTransfer={(f,t,a) => logAction('Balance Transfer', `${f} to ${t}`)} onAddFunds={() => {}} />}
          
          {activeTab === 'equb' && <EqubTracker groups={equbs} isAdmin={currentUser.role !== UserRole.MEMBER} onAdd={() => { setEditingEqub(null); setShowEqubModal(true); }} onSettle={(g) => logAction('Settle Equb')} onEdit={(e) => { setEditingEqub(e); setShowEqubModal(true); }} onDelete={(id) => setEqubs(p => p.filter(i => i.id !== id))} />}
          
          {activeTab === 'loans' && <LoanManager loans={loans} onPay={(id, amt) => logAction('Pay Loan')} onAdd={() => { setEditingLoan(null); setShowLoanModal(true); }} onEdit={(l) => { setEditingLoan(l); setShowLoanModal(true); }} onDelete={(id) => setLoans(p => p.filter(i => i.id !== id))} isAdmin={currentUser.role !== UserRole.MEMBER} />}

          {activeTab === 'growth' && <GrowthManager goals={goals} planned={plannedPayments} onAddGoal={() => { setEditingGoal(null); setShowGoalModal(true); }} onEditGoal={(g) => { setEditingGoal(g); setShowGoalModal(true); }} onDeleteGoal={(id) => setGoals(p => p.filter(g => g.id !== id))} isAdmin={currentUser.role !== UserRole.MEMBER} />}
          
          {activeTab === 'chat' && <ChatCenter messages={messages} currentUser={currentUser} onSendMessage={(t,c) => setMessages(p => [...p, { id: Math.random().toString(), senderId: currentUser.id, senderName: currentUser.name, text: t, timestamp: new Date().toISOString(), channel: c }])} />}
          {activeTab === 'schedule' && <ScheduleView equbs={equbs} loans={loans} planned={plannedPayments} onPayLoan={(id, amt) => logAction('Pay Loan')} />}
          {activeTab === 'reports' && <Reports transactions={transactions} loans={loans} equbs={equbs} goals={goals} />}
          {activeTab === 'accounting' && <AccountingManager transactions={transactions} users={users} currentUser={currentUser} onSendReport={(r) => logAction('Send Report')} onApproveReport={(id) => logAction('Approve Report')} sentReports={sentReports} />}
          
          {activeTab === 'users' && <UsersManager users={users} currentUser={currentUser} onUpdateUser={(u) => logAction('Update Partner')} onAddPartner={(u) => logAction('Add Partner')} onDelete={(id) => logAction('Revoke Access')} />}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-10 text-left">
               <div className={`p-12 rounded-[3.5rem] border shadow-2xl transition-all ${theme === 'dark' ? 'bg-slate-900 border-indigo-500/20' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-4xl font-black tracking-tighter uppercase mb-8 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Zone Command</h3>
                  
                  <div className={`p-8 rounded-[2.5rem] text-left mb-8 flex items-center justify-between border ${theme === 'dark' ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                     <div><p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</p></div>
                  </div>
                  <button onClick={() => setCurrentUser(null)} className="w-full py-6 bg-rose-600 text-white rounded-[2rem] font-black text-xl uppercase">Exit Zone</button>
               </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default App;
