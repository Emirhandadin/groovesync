import React, { useState } from 'react';
import { User } from '../types';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  users: User[];
  currentUserId: string;
  onKickUser: (userId: string) => void;
  roomPassword: string;
  onSetPassword: (pass: string) => void;
  onSimulateJoin: () => void; // Helper to demonstrate list updating
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  roomId,
  users,
  currentUserId,
  onKickUser,
  roomPassword,
  onSetPassword,
  onSimulateJoin
}) => {
  const [activeTab, setActiveTab] = useState<'invite' | 'participants'>('invite');
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteLink = `http://groove-music.duckdns.org:8080/room/${roomId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-surface border border-slate-600 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-users-rays text-primary"></i>
            Oda Yönetimi
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('invite')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'invite' 
                ? 'bg-slate-700/50 text-primary border-b-2 border-primary' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Davet & Ayarlar
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'participants' 
                ? 'bg-slate-700/50 text-primary border-b-2 border-primary' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Katılımcılar ({users.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto">
          
          {/* INVITE TAB */}
          {activeTab === 'invite' && (
            <div className="space-y-6">
              
              {/* Link Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Davet Linki
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={inviteLink}
                    className="flex-1 bg-background border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none select-all"
                  />
                  <button 
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                      copied ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-primary hover:bg-primary/80 text-white'
                    }`}
                  >
                    {copied ? <i className="fa-solid fa-check"></i> : <i className="fa-regular fa-copy"></i>}
                    {copied ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="border-t border-slate-700 pt-4">
                <button 
                  onClick={() => setShowQr(!showQr)}
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <i className={`fa-solid fa-chevron-right transition-transform ${showQr ? 'rotate-90' : ''}`}></i>
                  <i className="fa-solid fa-qrcode"></i>
                  QR Kodu Göster
                </button>
                
                {showQr && (
                  <div className="mt-4 flex justify-center bg-white p-4 rounded-xl w-fit mx-auto">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(inviteLink)}`} 
                      alt="Room QR Code" 
                      className="w-32 h-32"
                    />
                  </div>
                )}
              </div>

              {/* Password Section */}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Oda Şifresi (Opsiyonel)
                  </label>
                  {roomPassword && (
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">
                      Aktif
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <input
                    type="text"
                    value={roomPassword}
                    onChange={(e) => onSetPassword(e.target.value)}
                    placeholder="Şifre belirle..."
                    className="w-full bg-background border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-primary focus:outline-none transition-colors placeholder-slate-600"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Şifre belirlerseniz, davet linkine tıklayan kullanıcılar bu şifreyi girmeden odaya katılamazlar.
                </p>
              </div>

            </div>
          )}

          {/* PARTICIPANTS TAB */}
          {activeTab === 'participants' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-sm font-medium text-slate-300">Odadaki Kişiler</h3>
                 <button 
                   onClick={onSimulateJoin} 
                   className="text-xs text-primary hover:underline"
                 >
                   + Simüle Et (Kişi Ekle)
                 </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {users.map(user => {
                   const isMe = user.id === currentUserId;
                   return (
                     <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-background border border-slate-700">
                       <div className="flex items-center gap-3">
                         <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                         <div>
                           <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
                             {user.name}
                             {isMe && <span className="text-[10px] bg-slate-700 px-1.5 rounded text-slate-400">Host</span>}
                           </div>
                           <div className="text-[10px] text-slate-500 flex items-center gap-1">
                             <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                             {user.status}
                           </div>
                         </div>
                       </div>
                       
                       {!isMe && (
                         <button 
                           onClick={() => onKickUser(user.id)}
                           className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all group"
                           title="Kullanıcıyı Çıkar"
                         >
                           <i className="fa-solid fa-user-xmark"></i>
                         </button>
                       )}
                     </div>
                   );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="bg-slate-900/50 p-3 text-center border-t border-slate-700">
          <p className="text-[10px] text-slate-500">
             GrooveSync v1.0 • Güvenli Bağlantı
          </p>
        </div>

      </div>
    </div>
  );
};