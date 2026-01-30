import React, { useEffect, useRef, useState } from 'react';
import { Song } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onEnded: () => void;
  onPlayStateChange: (playing: boolean) => void;
  isBroadcasting: boolean;
  onToggleBroadcast: () => void;
}

export const Player: React.FC<PlayerProps> = ({ 
  currentSong, 
  isPlaying, 
  onEnded, 
  onPlayStateChange,
  isBroadcasting,
  onToggleBroadcast
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay prevented:", error);
            onPlayStateChange(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying, onPlayStateChange]);

  const togglePlay = () => {
    onPlayStateChange(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      // Fallback for duration if NaN
      if (!isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return (
      <div className="w-full aspect-video bg-surface rounded-xl flex flex-col items-center justify-center text-slate-600 border border-slate-700 shadow-2xl">
        <i className="fa-solid fa-music text-6xl mb-4 opacity-50"></i>
        <p className="text-lg font-medium">Bir şarkı seç</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={onEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {/* Visualizer / Cover Art Area */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-slate-700 group flex items-center justify-center">
        {/* Blurry Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110 transition-all duration-[10s]"
          style={{ backgroundImage: `url(${currentSong.thumbnail})` }}
        ></div>
        
        {/* Main Album Art */}
        <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-2xl overflow-hidden border-4 border-surface/50 animate-[spin_10s_linear_infinite]" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
          <img src={currentSong.thumbnail} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Vinyl center hole */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-surface rounded-full border border-slate-600"></div>
        </div>

        {/* Fake Visualizer Bars */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 px-10 pb-4 opacity-50">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 bg-white rounded-t-full animate-pulse"
                style={{ 
                  height: `${Math.random() * 80 + 20}%`,
                  animationDuration: `${Math.random() * 0.5 + 0.5}s` 
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Sync Indicator */}
        {isBroadcasting && (
          <div className="absolute top-4 right-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse z-20 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            CANLI YAYIN
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-surface/60 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 flex flex-col gap-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-white font-bold text-lg truncate">{currentSong.title}</h2>
            <p className="text-slate-400 text-sm truncate">Ekleyen: {currentSong.addedBy}</p>
          </div>

          <div className="flex items-center gap-4">
             {/* Volume Control (Hidden on mobile mostly) */}
            <div className="hidden md:flex items-center gap-2 group">
              <i className={`fa-solid text-slate-400 text-xs ${volume === 0 ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-slate-400 [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>

            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white hover:bg-slate-200 text-black flex items-center justify-center transition-transform hover:scale-105"
            >
              <i className={`fa-solid text-xl ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>
            </button>
            
            <button 
              onClick={onEnded}
              className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-forward-step"></i>
            </button>

            <button 
              onClick={onToggleBroadcast}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isBroadcasting 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                  : 'bg-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Yayını Değiştir"
            >
              <i className="fa-solid fa-tower-broadcast"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};