import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Playlist } from './components/Playlist';
import { Player } from './components/Player';
import { Chat } from './components/Chat';
import { InviteModal } from './components/InviteModal';
import { Song, User, ChatMessage } from './types';
import { INITIAL_SONGS, MOCK_USERS, CURRENT_USER, INITIAL_MESSAGES } from './constants';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(true);
  
  // Room Management State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [roomId] = useState(() => Math.random().toString(36).substring(2, 9).toUpperCase());
  const [roomPassword, setRoomPassword] = useState('');

  // Derived state
  const currentSong = songs[currentSongIndex] || null;

  // Handlers
  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    addMessage({
      id: Date.now().toString(),
      userId: 'system',
      text: `${CURRENT_USER.name} şarkıyı değiştirdi: ${songs[index].title}`,
      timestamp: Date.now(),
      isSystem: true
    });
  };

  const handleAddSong = (song: Song) => {
    setSongs([...songs, song]);
    if (songs.length === 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  };

  const handleDeleteSong = (index: number) => {
    const newSongs = songs.filter((_, i) => i !== index);
    setSongs(newSongs);
    if (index === currentSongIndex && newSongs.length > 0) {
      setCurrentSongIndex(0);
    } else if (newSongs.length === 0) {
      setIsPlaying(false);
    }
  };

  const handleNextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(prev => prev + 1);
    } else {
      setCurrentSongIndex(0);
    }
  };

  // Triggered by Sidebar button
  const handleOpenInvite = () => {
    setIsInviteModalOpen(true);
  };

  // Simulates a user using the link to join
  const handleSimulateJoin = () => {
    const newId = `u${Date.now()}`;
    const names = ["Zeynep", "Can", "Elif", "Burak", "Selin", "Ege"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const newFriend: User = {
      id: newId,
      name: `${randomName} (Misafir)`,
      avatar: `https://picsum.photos/seed/${newId}/50/50`,
      status: 'online'
    };
    
    setUsers(prev => [...prev, newFriend]);
    addMessage({
      id: Date.now().toString(),
      userId: 'system',
      text: `${newFriend.name} odaya katıldı.`,
      timestamp: Date.now(),
      isSystem: true
    });
  };

  // Host kicking a user
  const handleKickUser = (userId: string) => {
    const userToKick = users.find(u => u.id === userId);
    if (userToKick) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      addMessage({
        id: Date.now().toString(),
        userId: 'system',
        text: `${userToKick.name} odadan çıkarıldı.`,
        timestamp: Date.now(),
        isSystem: true
      });
    }
  };

  const addMessage = (msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleChatInput = (text: string, senderOverride?: string) => {
     const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: senderOverride || CURRENT_USER.id,
      text: text,
      timestamp: Date.now()
    };
    addMessage(newMessage);
  };

  return (
    <div className="flex h-screen w-full bg-background text-slate-200 font-sans selection:bg-primary/30">
      {/* Invite Modal Overlay */}
      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        roomId={roomId}
        users={[CURRENT_USER, ...users.filter(u => u.id !== CURRENT_USER.id)]} // Ensure host is in list but logic handles correctly
        currentUserId={CURRENT_USER.id}
        onKickUser={handleKickUser}
        roomPassword={roomPassword}
        onSetPassword={setRoomPassword}
        onSimulateJoin={handleSimulateJoin}
      />

      {/* Sidebar - Friends */}
      <Sidebar users={users} onAddFriend={handleOpenInvite} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (Mobile) */}
        <div className="md:hidden p-4 border-b border-slate-700 flex items-center justify-between">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">GrooveSync</span>
          <button onClick={handleOpenInvite}><i className="fa-solid fa-user-plus"></i></button>
        </div>

        <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          
          {/* Left Column: Player & Playlist (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2 pb-20 md:pb-0">
            <Player 
              currentSong={currentSong} 
              isPlaying={isPlaying}
              onEnded={handleNextSong}
              onPlayStateChange={setIsPlaying}
              isBroadcasting={isBroadcasting}
              onToggleBroadcast={() => setIsBroadcasting(!isBroadcasting)}
            />
            
            <div className="flex-1 min-h-[300px]">
              <Playlist 
                songs={songs}
                currentSongIndex={currentSongIndex}
                onSongSelect={handleSongSelect}
                onAddSong={handleAddSong}
                onDeleteSong={handleDeleteSong}
              />
            </div>
          </div>

          {/* Right Column: Chat (Span 1) */}
          <div className="h-[400px] lg:h-full flex flex-col">
            <Chat 
              messages={messages} 
              currentUser={CURRENT_USER}
              onSendMessage={handleChatInput}
              currentSongTitle={currentSong?.title || "None"}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;