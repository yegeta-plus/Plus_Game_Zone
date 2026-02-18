
import React, { useState } from 'react';
import { Users, UserPlus, Mail, Shield, ShieldCheck, ShieldAlert, Trash2, Search, Edit3, X, Save, Key } from 'lucide-react';
import { User, UserRole } from '../types';

interface UsersManagerProps {
  users: User[];
  onAddPartner?: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onDelete?: (id: string) => void;
  currentUser: User;
}

const UsersManager: React.FC<UsersManagerProps> = ({ users, onAddPartner, onUpdateUser, onDelete, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Partner Form State
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    pin: '',
    role: UserRole.MEMBER,
    equityPercentage: 0
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;

  const getRoleIcon = (role: UserRole) => {
    switch(role) {
      case UserRole.SUPER_ADMIN: return <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={18} />;
      case UserRole.ADMIN: return <Shield className="text-emerald-600 dark:text-emerald-400" size={18} />;
      default: return <Users className="text-slate-400 dark:text-slate-500" size={18} />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch(role) {
      case UserRole.SUPER_ADMIN: return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20';
      case UserRole.ADMIN: return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-white/5';
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser && onUpdateUser) {
      onUpdateUser(editingUser);
      setEditingUser(null);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddPartner) {
      const userObj: User = {
        ...newPartner,
        id: Math.random().toString(36).substr(2, 9),
        totalDividendsPaid: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      onAddPartner(userObj);
      setShowAddModal(false);
      setNewPartner({ name: '', email: '', pin: '', role: UserRole.MEMBER, equityPercentage: 0 });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-left">
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Staff Directory</h3>
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">Manage partner access and organizational roles</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isSuperAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
            >
              <UserPlus size={18} />
              Add Partner
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-8 bg-slate-50/50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-50/30 dark:hover:shadow-indigo-500/10 transition-all group text-left">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-600 text-indigo-600 dark:text-white rounded-2xl flex items-center justify-center font-black text-2xl border-4 border-white dark:border-slate-700 shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="flex gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {user.role.replace('_', ' ')}
                  </span>
                  {isSuperAdmin && currentUser.id !== user.id && (
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-white/10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-all"
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{user.name}</h4>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mt-1">
                    <Mail size={14} />
                    <span className="text-xs font-bold">{user.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Equity</p>
                    <p className="text-base font-black text-slate-700 dark:text-slate-300">{user.equityPercentage || 0}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Dividends</p>
                    <p className="text-base font-black text-slate-700 dark:text-slate-300">{user.totalDividendsPaid?.toLocaleString() || 0} <span className="text-[10px] opacity-40">ETB</span></p>
                  </div>
                </div>

                {isSuperAdmin && currentUser.id !== user.id && (
                  <button 
                    onClick={() => onDelete?.(user.id)}
                    className="w-full mt-4 py-3 bg-white dark:bg-slate-700 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Revoke Access
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Recruit Partner</h3>
              <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-600 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm text-slate-900 dark:text-white"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                  placeholder="e.g. Dawit Belay"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Login Email</label>
                <input 
                  type="email" required
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm text-slate-900 dark:text-white"
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                  placeholder="name@birrtrack.et"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Security PIN (4-Digits)</label>
                <div className="relative">
                  <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" maxLength={4} required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm tracking-widest text-slate-900 dark:text-white"
                    value={newPartner.pin}
                    onChange={(e) => setNewPartner({...newPartner, pin: e.target.value.replace(/\D/g, '')})}
                    placeholder="0000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Partner Role</label>
                  <select 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                    value={newPartner.role}
                    onChange={(e) => setNewPartner({...newPartner, role: e.target.value as UserRole})}
                  >
                    <option value={UserRole.MEMBER}>Audit (Member)</option>
                    <option value={UserRole.ADMIN}>Operating (Admin)</option>
                    <option value={UserRole.SUPER_ADMIN}>Managing (Super)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Equity (%)</label>
                  <input 
                    type="number" max={100} min={0}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm text-slate-900 dark:text-white"
                    value={newPartner.equityPercentage}
                    onChange={(e) => setNewPartner({...newPartner, equityPercentage: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl dark:shadow-none uppercase tracking-widest"
              >
                Onboard Partner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Partner Permissions</h3>
              <button onClick={() => setEditingUser(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-600 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Partner Role</label>
                <select 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.MEMBER}>Audit Partner (Member)</option>
                  <option value={UserRole.ADMIN}>Operating Partner (Admin)</option>
                  <option value={UserRole.SUPER_ADMIN}>Managing Partner (Super Admin)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Equity Stake (%)</label>
                <input 
                  type="number" max={100} min={0}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-slate-800 dark:text-white"
                  value={editingUser.equityPercentage || 0}
                  onChange={(e) => setEditingUser({...editingUser, equityPercentage: parseInt(e.target.value)})}
                />
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 flex items-start gap-3">
                <ShieldAlert size={20} className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 leading-relaxed uppercase tracking-tight">
                  Changing partner roles affects their ability to authorize payments and view sensitive ledger nodes.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl dark:shadow-none uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <Save size={20} />
                Save Access
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
