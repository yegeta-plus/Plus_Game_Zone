
import React from 'react';
import { 
  FileCheck, 
  ShieldAlert, 
  Activity, 
  Users, 
  Database,
  Lock,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { ActivityLog, ApprovalRequest } from '../types';

interface AdminReportProps {
  logs: ActivityLog[];
  approvals: ApprovalRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const AdminReport: React.FC<AdminReportProps> = ({ logs, approvals, onApprove, onReject }) => {
  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
        <div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Command Center</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">Full system integrity and multi-partner authorization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Authorization Queue */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm text-left">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-amber-500" />
              Approval Queue
            </h4>
            <span className="px-4 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-500/20">
              {pendingApprovals.length} Pending
            </span>
          </div>
          
          <div className="space-y-4">
            {pendingApprovals.length > 0 ? pendingApprovals.map(req => (
              <div key={req.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-rose-600 dark:text-rose-400 text-xs uppercase tracking-widest mb-1">{req.actionType.replace('_', ' ')}</p>
                    <p className="font-black text-slate-900 dark:text-white text-lg">{req.targetName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Requested by {req.requesterName} • {new Date(req.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
                    <Trash2 size={20} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onApprove(req.id)}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
                  >
                    Authorize
                  </button>
                  <button 
                    onClick={() => onReject(req.id)}
                    className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-40">
                <CheckCircle size={48} className="mx-auto mb-4 text-emerald-500 dark:text-emerald-400" />
                <p className="font-black text-lg text-slate-900 dark:text-white">Queue is Clear</p>
                <p className="text-sm font-medium dark:text-slate-400">All sensitive operations are currently authorized.</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group text-left">
          <div className="absolute top-0 right-0 p-12 opacity-5 -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-1000">
            <FileCheck size={350} />
          </div>
          <div className="relative z-10 flex flex-col h-[600px]">
            <h4 className="text-2xl font-black tracking-tight uppercase mb-8 flex items-center gap-4 shrink-0">
              <Activity size={32} className="text-indigo-400" />
              Partner Audit Trail
            </h4>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 scrollbar-hide">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group/item">
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-black shrink-0">
                      {log.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-sm text-white group-hover/item:text-indigo-400 transition-colors leading-tight">
                        {log.action}
                      </p>
                      {log.details && (
                        <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed italic opacity-70">
                          {log.details}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-3 tracking-widest flex items-center gap-2">
                        <Clock size={10} />
                        {log.userName} • {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="p-2 text-slate-700 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <ArrowRight size={16} />
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="py-24 text-center opacity-30 italic flex flex-col items-center">
                  <AlertCircle size={48} className="mb-4" />
                  <p>No activity recorded in the master ledger yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
