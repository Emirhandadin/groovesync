import React, { useState } from 'react';
import { Song } from '../types';
import { isValidAudioUrl, getRandomCover } from '../utils/youtube';

interface PlaylistProps {
  songs: Song[];
  currentSongIndex: number;
  onSongSelect: (index: number) => void;
  onAddSong: (song: Song) => void;
  onDeleteSong: (index: number) => void;
}

export const Playlist: React.FC<PlaylistProps> = ({ 
  songs, 
  currentSongIndex, 
  onSongSelect, 
  onAddSong,
  onDeleteSong
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    setError('');
    
    // Allow basic URL validation or empty for demo purposes? No, require URL.
    if (!urlInput.trim() || !isValidAudioUrl(urlInput)) {
      setError('Geçerli bir MP3 bağlantısı girin.');
      return;
    }

    const id = Date.now().toString(); // Generate temp ID
    const newSong: Song = {
      id,
      url: urlInput,
      title: `Audio Track ${songs.length + 1}`, // Default title
      addedBy: 'Ben',
      thumbnail: getRandomCover(id)
    };

    onAddSong(newSong);
    setUrlInput('');
  };

  const handleAddDemo = () => {
     const demos = [
       "https://cdn.pixabay.com/audio/2022/04/18/audio_822f5188d8.mp3",
       "https://cdn.pixabay.com/audio/2022/10/25/audio_55a2989b5c.mp3",
       "https://cdn.pixabay.com/audio/2021/11/01/audio_01675a3283.mp3"
     ];
     const randomDemo = demos[Math.floor(Math.random() * demos.length)];
     const id = Date.now().toString();
     
     onAddSong({
       id,
       url: randomDemo,
       title: "Demo Song (Random)",
       addedBy: "Ben",
       thumbnail: getRandomCover(id)
     });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="flex flex-col h-full bg-surface/50 rounded-xl overflow-hidden glass-panel">
      <div className="p-4 border-b border-slate-700 bg-surface/80">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <i className="fa-solid fa-list-ul text-secondary"></i>
          Çalma Listesi
        </h2>
        
        {/* Input Area */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="MP3 linki yapıştır..."
            className="flex-1 bg-slate-800 border border-slate-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-white placeholder-slate-500"
          />
          <button 
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/80 text-white px-3 py-2 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        
        <div className="flex items-center justify-between">
            {error ? <p className="text-red-400 text-xs">{error}</p> : <div></div>}
            <button 
                onClick={handleAddDemo}
                className="text-xs text-primary hover:text-primary/80 underline cursor-pointer"
            >
                + Rastgele Demo Ekle
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
            <i className="fa-solid fa-music text-3xl mb-2 opacity-50"></i>
            <p>Liste boş.</p>
          </div>
        ) : (
          songs.map((song, index) => {
            const isPlaying = index === currentSongIndex;
            return (
              <div 
                key={`${song.id}-${index}`}
                onClick={() => onSongSelect(index)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer group transition-all ${
                  isPlaying ? 'bg-primary/20 border border-primary/30' : 'hover:bg-slate-700/50 border border-transparent'
                }`}
              >
                <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-black">
                  <img src={song.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                       <i className="fa-solid fa-play text-white text-xs"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium truncate ${isPlaying ? 'text-primary' : 'text-slate-200'}`}>
                    {song.title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">Ekleyen: {song.addedBy}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteSong(index); }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 transition-opacity"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};