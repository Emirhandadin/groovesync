import React from 'react';
import { User } from '../types';

interface SidebarProps {
  users: User[];
  onAddFriend: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ users, onAddFriend }) => {
  return (
    <div className="w-20 md:w-64 flex-shrink-0 bg-surface border-r border-slate-700 flex flex-col h-full transition-all duration-300">
      <div className="p-4 border-b border-slate-700 flex items-center justify-center md:justify-start gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
          <i className="fa-solid fa-music"></i>
        </div>
        <h1 className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          GrooveSync
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h2 className="hidden md:block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Arkadaşlar ({users.length})
          </h2>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-600 group-hover:border-primary transition-colors" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${
                    user.status === 'online' ? 'bg-green-500' : 
                    user.status === 'listening' ? 'bg-primary' : 'bg-slate-500'
                  }`}></div>
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-sm text-slate-200">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.status === 'listening' ? 'Dinliyor...' : user.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={onAddFriend}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-user-plus"></i>
          <span className="hidden md:inline">Arkadaş Ekle</span>
        </button>
      </div>
    </div>
  );
};