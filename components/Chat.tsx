import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';
import { generateAIDJResponse } from '../services/geminiService';

interface ChatProps {
  messages: ChatMessage[];
  currentUser: User;
  onSendMessage: (text: string, senderId?: string) => void;
  currentSongTitle: string;
}

export const Chat: React.FC<ChatProps> = ({ messages, currentUser, onSendMessage, currentSongTitle }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    // Send user message
    onSendMessage(userText);

    // AI Logic
    if (Math.random() > 0.6 || userText.toLowerCase().includes('dj') || userText.toLowerCase().includes('bot') || userText.toLowerCase().includes('abi')) {
      setIsTyping(true);
      const history = messages.slice(-5).map(m => `${m.userId}: ${m.text}`);
      
      try {
        const aiResponse = await generateAIDJResponse(history, currentSongTitle);
        setTimeout(() => {
           onSendMessage(aiResponse, 'dj'); // Pass 'dj' as sender
           setIsTyping(false);
        }, 2000);
      } catch (e) {
        setIsTyping(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-full bg-surface/50 rounded-xl overflow-hidden glass-panel border border-slate-700">
      <div className="p-3 border-b border-slate-700 bg-surface/80 flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-200">
          <i className="fa-regular fa-comments mr-2 text-primary"></i>
          Oda Sohbeti
        </h2>
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30 flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI DJ
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.userId === currentUser.id;
          const isSystem = msg.isSystem;
          const isDJ = msg.userId === 'dj';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-1 rounded-full border border-slate-700">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
               <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar for DJ or Friends */}
                  {!isMe && (
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-slate-600">
                       {isDJ ? (
                         <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px]">🤖</div>
                       ) : (
                         <img src={`https://picsum.photos/seed/${msg.userId}/50/50`} alt="avatar" className="w-full h-full" />
                       )}
                    </div>
                  )}

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 mb-1 mx-1">
                      {isDJ ? 'GrooveBot' : msg.userId === currentUser.id ? 'Ben' : msg.userId}
                    </span>
                    <div 
                      className={`px-3 py-2 rounded-2xl text-sm shadow-sm ${
                        isMe 
                          ? 'bg-primary text-white rounded-br-none' 
                          : isDJ 
                            ? 'bg-gradient-to-r from-slate-700 to-slate-800 border border-purple-500/30 text-purple-100 rounded-bl-none' 
                            : 'bg-slate-700 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
               </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start animate-pulse ml-8">
             <div className="bg-slate-700/50 px-3 py-2 rounded-2xl rounded-bl-none text-xs text-slate-400 flex gap-1">
                <span>DJ yazıyor</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-surface border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesaj yaz..."
            className="flex-1 bg-slate-800 border border-slate-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-white placeholder-slate-500"
          />
          <button 
            onClick={handleSend}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};