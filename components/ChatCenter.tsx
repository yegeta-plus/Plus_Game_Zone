
import React, { useState, useRef, useEffect } from 'react';
import { Send, Hash, Users, Sparkles, Plus, Clock, MoreHorizontal, Smile, Paperclip } from 'lucide-react';
import { ChatMessage, User } from '../types';

interface ChatCenterProps {
  messages: ChatMessage[];
  currentUser: User;
  onSendMessage: (text: string, channel: ChatMessage['channel']) => void;
}

const ChatCenter: React.FC<ChatCenterProps> = ({ messages, currentUser, onSendMessage }) => {
  const [activeChannel, setActiveChannel] = useState<ChatMessage['channel']>('GENERAL');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const filteredMessages = messages.filter(m => m.channel === activeChannel);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText, activeChannel);
      setInputText('');
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Channel Sidebar */}
      <aside className="w-64 border-r border-slate-100 dark:border-white/5 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
        <div className="p-8 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 text-left">Partner Channels</h3>
          <div className="space-y-2">
            {(['GENERAL', 'FINANCE', 'STRATEGY'] as const).map(ch => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-black transition-all ${
                  activeChannel === ch 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Hash size={16} className={activeChannel === ch ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'} />
                {ch}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-8 flex-1 overflow-y-auto">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 text-left">Online Partners</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-600/20 rounded-xl flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400">A</div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Abebe (You)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 dark:text-slate-600">S</div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900 rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Sara</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white dark:bg-slate-900">
        {/* Header */}
        <header className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Hash size={24} />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{activeChannel} Channel</h4>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Direct partner communication vault</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"><Users size={20} /></button>
            <button className="p-3 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"><MoreHorizontal size={20} /></button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {filteredMessages.length > 0 ? filteredMessages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    {!isMe && <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">{msg.senderName}</span>}
                    <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={`px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
               <Sparkles size={64} className="mb-6 text-indigo-600 dark:text-indigo-400" />
               <p className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-widest">No signals in this channel</p>
               <p className="text-sm font-medium dark:text-slate-400">Start the conversation with your partners.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <footer className="p-8 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900">
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex gap-3 text-slate-400 dark:text-slate-600">
               <button type="button" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Smile size={20} /></button>
               <button type="button" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Paperclip size={20} /></button>
            </div>
            <input 
              type="text" 
              placeholder={`Message # ${activeChannel.toLowerCase()}...`}
              className="w-full pl-24 pr-20 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="mt-4 text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest text-center">
            Locked & Encrypted • Channel Visibility: Internal Partners Only
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ChatCenter;
