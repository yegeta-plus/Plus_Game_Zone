
import React, { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Users, 
  PieChart, 
  Settings, 
  LogOut,
  Menu,
  Wallet,
  Smartphone,
  TrendingUp,
  Banknote,
  Handshake,
  CalendarDays,
  Package,
  FileText,
  Eye,
  EyeOff,
  Lock,
  MessagesSquare,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { UserRole } from '../types';
import BrandLogo from './BrandLogo.tsx';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
  isMasked: boolean;
  onToggleMask: () => void;
  onLock: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  userRole, 
  userName,
  onLogout,
  isMasked,
  onToggleMask,
  onLock,
  theme,
  onToggleTheme
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wallet', label: 'Vault', icon: Smartphone },
    { id: 'income', label: 'Sales', icon: ArrowUpCircle },
    { id: 'expense', label: 'Costs', icon: ArrowDownCircle },
    { id: 'chat', label: 'Partner Chat', icon: MessagesSquare },
    { id: 'equb', label: 'Equb Tracker', icon: Wallet },
    { id: 'loans', label: 'Finance', icon: Banknote },
    { id: 'assets', label: 'Assets', icon: Package },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'investments', label: 'Equity', icon: Handshake },
    { id: 'growth', label: 'Goals', icon: TrendingUp },
    { id: 'reports', label: 'Analytics', icon: PieChart },
    { id: 'accounting', label: 'Journal', icon: FileText },
  ];

  if (userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN) {
    menuItems.push({ id: 'users', label: 'Partners', icon: Users });
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 z-[110] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" />
              <div className="text-left">
                <h1 className="font-bold text-slate-800 dark:text-white text-base leading-none">Plus Zone</h1>
                <span className="text-[8px] text-slate-500 dark:text-indigo-400 uppercase tracking-widest font-black">Managing Partners</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
            {menuItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400'} /> 
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-100 dark:border-white/5 space-y-1">
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}><Settings size={20} /> Settings</button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 dark:text-rose-500 hover:bg-red-50 dark:hover:bg-rose-500/10"><LogOut size={20} /> Log Out</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-20 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white capitalize truncate max-w-[150px] sm:max-w-none">
              {menuItems.find(m => m.id === activeTab)?.label || activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 bg-slate-100/50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
               <button onClick={onToggleTheme} title="Toggle Theme" className="p-2 sm:p-2.5 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-colors">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
               <button onClick={onToggleMask} title="Mask Values" className="p-2 sm:p-2.5 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-colors">{isMasked ? <EyeOff size={18} /> : <Eye size={18} />}</button>
               <button onClick={onLock} title="Lock Vault" className="p-2 sm:p-2.5 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-colors"><Lock size={18} /></button>
            </div>
            
            <div className="hidden md:block text-right">
              <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{userName}</p>
              <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest">{userRole.replace('_', ' ')}</p>
            </div>
            <button onClick={() => setActiveTab('settings')} className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl border-2 border-white dark:border-white/5 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black">
              {userName.charAt(0)}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 scroll-smooth">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
